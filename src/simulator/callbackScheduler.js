const axios = require('axios');

// ---------------------------------------------------------------------------
// In-memory counter for active simulations
// ---------------------------------------------------------------------------
let activeSimulations = 0;

function bumpActive() {
  activeSimulations++;
}

function dropActive() {
  activeSimulations = Math.max(0, activeSimulations - 1);
}

function getActiveCount() {
  return activeSimulations;
}

// ---------------------------------------------------------------------------
// Callback delivery with retry
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 1000; // 1s → 2s → 4s (exponential)
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Posts a status callback to the CRM backend.
 *
 * If the request fails we retry up to 3 times with exponential backoff.
 * We intentionally swallow errors after all retries are exhausted —
 * a stuck callback shouldn't kill the simulation for other messages.
 */
async function postCallback(callbackUrl, payload) {
  const secret = process.env.CRM_CALLBACK_SECRET || '';
  const tag = `[callback] ${payload.vendorMessageId} → ${payload.status}`;

  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      await axios.post(callbackUrl, payload, {
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          'X-Channel-Secret': secret,
        },
      });

      console.log(`${tag} delivered (attempt ${attempt})`);
      return; // success — bail out
    } catch (err) {
      const isLastAttempt = attempt === MAX_RETRIES + 1;
      const status = err.response?.status || 'no response';

      if (isLastAttempt) {
        console.error(
          `${tag} FAILED after ${MAX_RETRIES + 1} attempts (last status: ${status})`
        );
        return; // give up gracefully
      }

      // Exponential backoff: 1s, 2s, 4s
      const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
      console.warn(
        `${tag} attempt ${attempt} failed (${status}), retrying in ${backoff}ms…`
      );
      await new Promise((r) => setTimeout(r, backoff));
    }
  }
}

module.exports = { postCallback, bumpActive, dropActive, getActiveCount };
