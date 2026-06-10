function getDashboardHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XenoCRM Channel Service Simulator</title>
  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-dark: #0B0B0F;
      --bg-card: #14141E;
      --bg-elevated: #1F1F2E;
      --border: #2E2E3E;
      --text-primary: #F0F0F5;
      --text-secondary: #9090A8;
      --text-muted: #5A5A75;
      --primary: #F59E0B;
      --primary-light: #FBBF24;
      --success: #10B981;
      --danger: #EF4444;
      --info: #3B82F6;
      --warning: #F59E0B;
      --purple: #8B5CF6;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-dark);
      color: var(--text-primary);
      font-family: 'Inter', sans-serif;
      min-height: 100vh;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    /* Header Styling */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, var(--bg-card) 0%, #171725 100%);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem 2rem;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-icon {
      background: linear-gradient(135deg, var(--primary) 0%, #D97706 100%);
      height: 36px;
      width: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #fff;
      font-family: 'Outfit', sans-serif;
    }

    .logo-text h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .logo-text p {
      font-size: 10px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      margin-top: 1px;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: var(--success);
      font-size: 11px;
      font-weight: 700;
      padding: 0.5rem 1rem;
      border-radius: 99px;
    }

    .status-dot {
      height: 8px;
      width: 8px;
      background-color: var(--success);
      border-radius: 50%;
      display: inline-block;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.6; }
    }

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-cols: 1;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .kpi-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: border-color 0.2s ease;
    }

    .kpi-card:hover {
      border-color: rgba(245, 158, 11, 0.3);
    }

    .kpi-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }

    .kpi-value {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .kpi-desc {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Filters and Controls */
    .controls-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .search-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 250px;
      background-color: var(--bg-dark);
      border: 1px solid var(--border);
      color: var(--text-primary);
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 12px;
      outline: none;
      transition: border-color 0.2s;
    }

    .search-input:focus {
      border-color: var(--primary);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-right: 0.25rem;
    }

    .filter-btn {
      background-color: var(--bg-dark);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      color: var(--text-primary);
      border-color: var(--text-muted);
    }

    .filter-btn.active {
      background-color: var(--primary);
      border-color: var(--primary);
      color: #fff;
    }

    /* Table Card */
    .table-card {
      background-color: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      overflow: hidden;
    }

    .table-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-title {
      font-size: 14px;
      font-weight: 700;
      font-family: 'Outfit', sans-serif;
    }

    .table-container {
      overflow-x: auto;
      max-height: 480px;
      overflow-y: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 12px;
    }

    th {
      background-color: rgba(31, 31, 46, 0.3);
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.05em;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(46, 46, 62, 0.4);
      color: var(--text-secondary);
      vertical-align: middle;
    }

    tr:hover td {
      background-color: rgba(255, 255, 255, 0.015);
      color: var(--text-primary);
    }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      font-size: 10px;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      text-transform: uppercase;
    }

    /* Channel badges */
    .badge-whatsapp { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: var(--success); }
    .badge-sms { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: var(--info); }
    .badge-email { background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); color: var(--purple); }
    .badge-rcs { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); color: var(--warning); }

    /* Status badges */
    .status-queued { background: #18181b; border: 1px solid #27272a; color: #a1a1aa; }
    .status-sent { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: var(--info); }
    .status-delivered { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.2); color: var(--success); }
    .status-opened { background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.2); color: #06b6d4; }
    .status-read { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.2); color: #6366f1; }
    .status-clicked { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.2); color: var(--warning); }
    .status-failed { background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.2); color: var(--danger); }

    .msg-cell {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .msg-mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
    }

    .text-center {
      text-align: center;
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: var(--text-muted);
    }

    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 100;
    }

    .toast {
      background-color: var(--bg-elevated);
      border: 1px solid var(--border);
      border-left: 4px solid var(--primary);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      color: var(--text-primary);
      font-size: 11px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from { transform: translateX(110%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  </style>
</head>
<body>

  <div class="toast-container" id="toastContainer"></div>

  <div class="container">
    <!-- Header -->
    <header>
      <div class="logo-container">
        <div class="logo-icon">X</div>
        <div class="logo-text">
          <h1>XenoCRM</h1>
          <p>Channel Simulator</p>
        </div>
      </div>
      <div class="status-badge">
        <span class="status-dot"></span>
        <span>Simulator Active</span>
      </div>
    </header>

    <!-- KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-title">Simulations Sent</span>
        <span class="kpi-value" id="kpiTotal">0</span>
        <span class="kpi-desc">Total processed queries</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-title">Avg Delivery Rate</span>
        <span class="kpi-value" id="kpiDelivery">0%</span>
        <span class="kpi-desc">Successful message receipt</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-title">Active Pipelines</span>
        <span class="kpi-value" id="kpiActive">0</span>
        <span class="kpi-desc">Running in background</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-title">Response Rate</span>
        <span class="kpi-value" id="kpiResponse">0%</span>
        <span class="kpi-desc">Clicked / Total sent</span>
      </div>
    </div>

    <!-- Controls -->
    <div class="controls-card">
      <div class="search-row">
        <input type="text" id="searchInput" class="search-input" placeholder="Search by message text, recipient, or campaign ID...">
      </div>

      <div class="search-row" style="gap: 1.5rem;">
        <div class="filter-group">
          <span class="filter-label">Medium:</span>
          <button class="filter-btn active" onclick="setMediumFilter('')">All</button>
          <button class="filter-btn" onclick="setMediumFilter('whatsapp')">WhatsApp</button>
          <button class="filter-btn" onclick="setMediumFilter('sms')">SMS</button>
          <button class="filter-btn" onclick="setMediumFilter('email')">Email</button>
          <button class="filter-btn" onclick="setMediumFilter('rcs')">RCS</button>
        </div>

        <div class="filter-group">
          <span class="filter-label">Status:</span>
          <button class="filter-btn active" onclick="setStatusFilter('')">All</button>
          <button class="filter-btn" onclick="setStatusFilter('queued')">Queued</button>
          <button class="filter-btn" onclick="setStatusFilter('sent')">Sent</button>
          <button class="filter-btn" onclick="setStatusFilter('delivered')">Delivered</button>
          <button class="filter-btn" onclick="setStatusFilter('read')">Read</button>
          <button class="filter-btn" onclick="setStatusFilter('clicked')">Clicked</button>
          <button class="filter-btn" onclick="setStatusFilter('failed')">Failed</button>
        </div>
      </div>
    </div>

    <!-- Messages List -->
    <div class="table-card">
      <div class="table-header">
        <span class="table-title">Live Simulated Logs</span>
        <span class="status-badge" style="background:transparent; border:none; padding:0; color:var(--text-muted)">
          Refreshes every 1.5 seconds
        </span>
      </div>

      <div class="table-container">
        <table id="logsTable">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Vendor MSG ID</th>
              <th>Campaign ID</th>
              <th>Medium</th>
              <th>Recipient</th>
              <th>Content preview</th>
              <th class="text-center">Simulated Status</th>
            </tr>
          </thead>
          <tbody id="logsTableBody">
            <tr>
              <td colspan="7" class="empty-state">Loading simulated messages...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script>
    let rawMessages = [];
    let activeFilterMedium = '';
    let activeFilterStatus = '';
    let searchQuery = '';
    let lastSeenCount = 0;

    // Filters functions
    function setMediumFilter(val) {
      activeFilterMedium = val;
      updateFilterButtons('Medium', val);
      render();
    }

    function setStatusFilter(val) {
      activeFilterStatus = val;
      updateFilterButtons('Status', val);
      render();
    }

    function updateFilterButtons(group, activeValue) {
      const labels = document.querySelectorAll('.filter-group');
      labels.forEach(lbl => {
        if (lbl.querySelector('.filter-label').textContent.includes(group)) {
          const btns = lbl.querySelectorAll('.filter-btn');
          btns.forEach(btn => {
            if (btn.textContent.toLowerCase() === (activeValue || 'all')) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
        }
      });
    }

    // Polling simulated data
    async function fetchMessages() {
      try {
        const res = await fetch('/api/channel/messages');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          rawMessages = json.data;
          
          // Toast trigger if new message added
          if (rawMessages.length > lastSeenCount && lastSeenCount > 0) {
            const diff = rawMessages.length - lastSeenCount;
            showToast(\`Received \${diff} new simulation request(s) 📨\`);
          }
          lastSeenCount = rawMessages.length;

          render();
          recalculateStats();
        }
      } catch (err) {
        console.error('Failed to poll logs:', err);
      }
    }

    function showToast(text) {
      const c = document.getElementById('toastContainer');
      const t = document.createElement('div');
      t.className = 'toast';
      t.textContent = text;
      c.appendChild(t);
      setTimeout(() => {
        t.style.opacity = '0';
        t.style.transition = 'opacity 0.3s ease';
        setTimeout(() => t.remove(), 300);
      }, 3000);
    }

    function recalculateStats() {
      const total = rawMessages.length;
      document.getElementById('kpiTotal').textContent = total;

      let deliveredCount = 0;
      let failedCount = 0;
      let clickedCount = 0;
      let activeCount = 0;

      rawMessages.forEach(m => {
        if (['delivered', 'opened', 'read', 'clicked'].includes(m.status)) deliveredCount++;
        if (m.status === 'failed') failedCount++;
        if (m.status === 'clicked') clickedCount++;
        if (['queued', 'sent'].includes(m.status)) activeCount++;
      });

      const deliveryRate = total > 0 ? Math.round((deliveredCount / total) * 100) : 0;
      const responseRate = total > 0 ? Math.round((clickedCount / total) * 100) : 0;

      document.getElementById('kpiDelivery').textContent = deliveryRate + '%';
      document.getElementById('kpiResponse').textContent = responseRate + '%';
      document.getElementById('kpiActive').textContent = activeCount;
    }

    // Search query binding
    document.getElementById('searchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      render();
    });

    function formatTime(isoStr) {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function render() {
      const tbody = document.getElementById('logsTableBody');
      
      // Filter list
      const filtered = rawMessages.filter(m => {
        const matchesMedium = !activeFilterMedium || m.channel.toLowerCase() === activeFilterMedium;
        const matchesStatus = !activeFilterStatus || m.status.toLowerCase() === activeFilterStatus;
        
        let matchesSearch = true;
        if (searchQuery) {
          const text = (m.message || '').toLowerCase();
          const recipient = (m.recipient || '').toLowerCase();
          const campaign = (m.campaignId || '').toLowerCase();
          const vendorId = (m.vendorMessageId || '').toLowerCase();
          matchesSearch = text.includes(searchQuery) || recipient.includes(searchQuery) || campaign.includes(searchQuery) || vendorId.includes(searchQuery);
        }

        return matchesMedium && matchesStatus && matchesSearch;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = \`<tr><td colspan="7" class="empty-state">No simulated logs match the filters.</td></tr>\`;
        return;
      }

      tbody.innerHTML = filtered.map(m => {
        return \`
          <tr class="animate-fade-in">
            <td class="msg-mono">\${formatTime(m.timestamp)}</td>
            <td class="msg-mono">\${m.vendorMessageId}</td>
            <td class="msg-mono" style="color:var(--text-primary)">\${m.campaignId}</td>
            <td>
              <span class="badge badge-\${m.channel.toLowerCase()}">\${m.channel}</span>
            </td>
            <td class="msg-mono">\${m.recipient}</td>
            <td class="msg-cell" title="\${m.message}">\${m.message}</td>
            <td class="text-center">
              <span class="badge status-\${m.status.toLowerCase()}">\${m.status}</span>
            </td>
          </tr>
        \`;
      }).join('');
    }

    // Start polling
    fetchMessages();
    setInterval(fetchMessages, 1500);
  </script>
</body>
</html>`;
}

module.exports = { getDashboardHtml };
