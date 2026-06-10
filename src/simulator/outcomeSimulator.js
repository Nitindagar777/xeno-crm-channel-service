const { postCallback, bumpActive, dropActive } = require('./callbackScheduler');
const { updateMessageStatus } = require('./messagesStore');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Random integer in [min, max] (inclusive). */
function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Promise-based delay so we can use clean async/await chains. */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Rolls a probability check.  probability should be between 0 and 1.
 * Returns true if the "dice roll" succeeds.
 */
function chancePasses(probability) {
  return Math.random() < probability;
}

// ---------------------------------------------------------------------------
// Core simulation
// ---------------------------------------------------------------------------

/**
 * Walks a message through a realistic lifecycle:
 *   queued → sent → delivered/failed → opened → read → clicked
 *
 * At each transition we wait a randomised delay and POST a callback
 * to the CRM backend so it can update its own records.
 *
 * The probabilities and timings are tuned to feel plausible for a
 * real-world messaging provider (WhatsApp-style), but obviously
 * compressed into seconds instead of minutes/hours.
 */
async function simulateOutcome(ctx) {
  const { vendorMessageId, campaignId, customerId, channel, callbackUrl } = ctx;

  bumpActive();

  try {
    // --- Step 1: "sent" — the provider accepted the message ---
    const sentDelay = randBetween(500, 1500);
    await wait(sentDelay);
    updateMessageStatus(vendorMessageId, 'sent');
    await postCallback(callbackUrl, {
      vendorMessageId,
      campaignId,
      customerId,
      status: 'sent',
      timestamp: new Date().toISOString(),
      meta: { channel, simulatedDelay: sentDelay },
    });

    // --- Step 2: delivery outcome ---
    if (chancePasses(0.85)) {
      // 85 % → delivered
      const deliveredDelay = randBetween(1000, 3000);
      await wait(deliveredDelay);
      updateMessageStatus(vendorMessageId, 'delivered');
      await postCallback(callbackUrl, {
        vendorMessageId,
        campaignId,
        customerId,
        status: 'delivered',
        timestamp: new Date().toISOString(),
        meta: { channel, simulatedDelay: deliveredDelay },
      });
    } else {
      // 15 % → hard failure (bad number, carrier block, etc.)
      const failDelay = randBetween(500, 1000);
      await wait(failDelay);
      updateMessageStatus(vendorMessageId, 'failed');
      await postCallback(callbackUrl, {
        vendorMessageId,
        campaignId,
        customerId,
        status: 'failed',
        timestamp: new Date().toISOString(),
        meta: { channel, simulatedDelay: failDelay, reason: 'simulated_delivery_failure' },
      });
      return; // nothing more to do
    }

    // --- Step 3: opened (55 % of delivered messages) ---
    if (!chancePasses(0.55)) return;

    const openDelay = randBetween(5000, 15000);
    await wait(openDelay);
    updateMessageStatus(vendorMessageId, 'opened');
    await postCallback(callbackUrl, {
      vendorMessageId,
      campaignId,
      customerId,
      status: 'opened',
      timestamp: new Date().toISOString(),
      meta: { channel, simulatedDelay: openDelay },
    });

    // --- Step 4: read (70 % of opened messages) ---
    if (!chancePasses(0.70)) return;

    const readDelay = randBetween(2000, 8000);
    await wait(readDelay);
    updateMessageStatus(vendorMessageId, 'read');
    await postCallback(callbackUrl, {
      vendorMessageId,
      campaignId,
      customerId,
      status: 'read',
      timestamp: new Date().toISOString(),
      meta: { channel, simulatedDelay: readDelay },
    });

    // --- Step 5: clicked (30 % of read messages) ---
    if (!chancePasses(0.30)) return;

    const clickDelay = randBetween(3000, 10000);
    await wait(clickDelay);
    updateMessageStatus(vendorMessageId, 'clicked');
    await postCallback(callbackUrl, {
      vendorMessageId,
      campaignId,
      customerId,
      status: 'clicked',
      timestamp: new Date().toISOString(),
      meta: { channel, simulatedDelay: clickDelay },
    });
  } catch (err) {
    // If the whole simulation blows up we log it but don't crash.
    // Individual callback failures are already retried inside postCallback.
    console.error(`[simulator] Fatal error for ${vendorMessageId}:`, err.message);
  } finally {
    dropActive();
  }
}

module.exports = { simulateOutcome };
