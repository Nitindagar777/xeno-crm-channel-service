# xeno-crm-channel-service

A stubbed messaging channel simulator that mimics external messaging provider gateways (like Twilio, Gupshup, or SendGrid). It validates delivery requests and simulates full message lifecycles asynchronously.

---

## ⚙️ How It Works (Simulation Engine)
Instead of integrating a live paid provider, this service mocks the network lifecycle of a message:
1. **Send API (`POST /api/channel/send`)**: Accepts incoming message details (recipient, body, channel) from the CRM, generates a vendor tracking ID, and responds with a `202 Accepted` queue status.
2. **Lifecycle Simulation**: Launches an asynchronous timer chain with randomized delays to trigger subsequent statuses:
   - **Sent** (after 0.5s – 1.5s)
   - **Delivered** (85% probability, 1s - 3s after Sent) OR **Failed** (15% probability, 0.5s - 1.0s after Sent)
   - **Opened** (55% probability, 5s - 15s after Delivered)
   - **Read** (70% probability, 2s - 8s after Opened)
   - **Clicked** (30% probability, 3s - 10s after Read)
3. **Webhook Callback**: Calls back to the CRM receipt endpoint with the updated status reports.
4. **Retry Mechanism**: If the CRM backend is unresponsive (network timeout, system restart, etc.), the simulator retries the callback up to 3 times using an exponential backoff schedule (1s, 2s, 4s).

---

## ⚙️ Local Development Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **CRM Backend**: The `crm-backend` server must be running on port `5000` to process webhook callbacks.

### Setup Steps
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in:
   ```bash
   cp .env.example .env
   ```
   Provide the port, callback url, and the callback shared secret:
   ```env
   PORT=5001
   CRM_CALLBACK_URL=http://localhost:5000/api/campaigns/receipt
   CRM_CALLBACK_SECRET=xeno_channel_shared_secret_2026
   ```
3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

## 📡 API Reference

### POST `/api/channel/send`
Queues a message for simulation delivery.

**Headers**:
- `Content-Type: application/json`

**Body**:
```json
{
  "vendorMessageId": "string",
  "campaignId": "string",
  "customerId": "string",
  "message": "string",
  "channel": "whatsapp | sms | email | rcs",
  "recipientPhone": "string",
  "recipientEmail": "string",
  "callbackUrl": "string"
}
```

**Response (`202 Accepted`)**:
```json
{
  "success": true,
  "vendorMessageId": "ch_7a9f82d1",
  "status": "queued"
}
```
