/* ============================================================
   CALIS ADVENTURES — AI Assistant Widget
   ============================================================ */

(function () {
  /* ── Inject CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    /* ── Trigger Button ── */
    #calis-ai-btn {
      position: fixed;
      bottom: 2rem;
      right: 6.5rem;
      z-index: 997;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #C9A84C 0%, #9A7A2E 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      box-shadow: 0 4px 24px rgba(201,168,76,0.45);
      transition: transform 0.3s, box-shadow 0.3s;
      animation: calisFloat 3s ease-in-out infinite;
    }
    #calis-ai-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 30px rgba(201,168,76,0.65);
    }
    #calis-ai-btn .ai-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(201,168,76,0.4);
      animation: calisPulse 2s infinite;
      pointer-events: none;
    }
    @keyframes calisFloat {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes calisPulse {
      0%   { transform: scale(1);   opacity: 0.7; }
      70%  { transform: scale(1.4); opacity: 0; }
      100% { transform: scale(1.4); opacity: 0; }
    }

    /* ── Tooltip label ── */
    #calis-ai-btn::after {
      content: 'Ask Calis AI';
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      background: #1A1A1A;
      color: #E8D5A3;
      font-family: 'Jost', sans-serif;
      font-size: 11px;
      font-weight: 400;
      letter-spacing: 0.06em;
      white-space: nowrap;
      padding: 5px 10px;
      border-radius: 3px;
      border: 1px solid rgba(201,168,76,0.25);
      opacity: 0;
      transform: translateY(4px);
      transition: opacity 0.2s, transform 0.2s;
      pointer-events: none;
    }
    #calis-ai-btn:hover::after {
      opacity: 1;
      transform: translateY(0);
    }

    /* ── Chat Window ── */
    #calis-ai-panel {
      position: fixed;
      bottom: 6.5rem;
      right: 6.5rem;
      z-index: 998;
      width: 360px;
      max-height: 520px;
      background: #111111;
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.08);
      transform: scale(0.92) translateY(16px);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease;
      transform-origin: bottom right;
      font-family: 'Jost', sans-serif;
    }
    #calis-ai-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    /* Header */
    .cai-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(201,168,76,0.15);
      flex-shrink: 0;
    }
    .cai-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C9A84C, #9A7A2E);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }
    .cai-avatar::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    }
    .cai-header-info { flex: 1; }
    .cai-header-name {
      font-size: 14px;
      font-weight: 500;
      color: #E8D5A3;
      letter-spacing: 0.04em;
    }
    .cai-header-status {
      font-size: 11px;
      color: rgba(232,213,163,0.5);
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 1px;
    }
    .cai-header-status::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #25D366;
      display: inline-block;
      box-shadow: 0 0 6px rgba(37,211,102,0.7);
    }
    .cai-close {
      background: none;
      border: none;
      color: rgba(232,213,163,0.4);
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 0 2px;
      transition: color 0.2s;
    }
    .cai-close:hover { color: #C9A84C; }

    /* Messages */
    .cai-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(201,168,76,0.2) transparent;
    }
    .cai-messages::-webkit-scrollbar { width: 3px; }
    .cai-messages::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }

    .cai-bubble {
      max-width: 85%;
      padding: 10px 13px;
      border-radius: 10px;
      font-size: 13.5px;
      line-height: 1.55;
      font-weight: 300;
      animation: caiPop 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes caiPop {
      from { transform: scale(0.88) translateY(6px); opacity: 0; }
      to   { transform: scale(1)    translateY(0);   opacity: 1; }
    }
    .cai-bubble.bot {
      background: #1E1E1E;
      color: #E8D5A3;
      border: 1px solid rgba(201,168,76,0.12);
      border-bottom-left-radius: 3px;
      align-self: flex-start;
    }
    .cai-bubble.user {
      background: linear-gradient(135deg, #C9A84C, #9A7A2E);
      color: #0A0A0A;
      font-weight: 400;
      border-bottom-right-radius: 3px;
      align-self: flex-end;
    }

    /* Typing indicator */
    .cai-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 12px 14px;
      background: #1E1E1E;
      border: 1px solid rgba(201,168,76,0.12);
      border-radius: 10px;
      border-bottom-left-radius: 3px;
      align-self: flex-start;
      animation: caiPop 0.25s ease;
    }
    .cai-typing span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #C9A84C;
      animation: caiDot 1.2s ease-in-out infinite;
    }
    .cai-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cai-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes caiDot {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30%            { transform: translateY(-5px); opacity: 1; }
    }

    /* Quick replies */
    .cai-quick {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 16px 10px;
      flex-shrink: 0;
    }
    .cai-quick-btn {
      background: transparent;
      border: 1px solid rgba(201,168,76,0.3);
      color: #C9A84C;
      font-family: 'Jost', sans-serif;
      font-size: 11.5px;
      font-weight: 400;
      letter-spacing: 0.04em;
      padding: 5px 11px;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      white-space: nowrap;
    }
    .cai-quick-btn:hover {
      background: rgba(201,168,76,0.12);
    }

    /* Input row */
    .cai-input-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-top: 1px solid rgba(201,168,76,0.12);
      flex-shrink: 0;
    }
    .cai-input {
      flex: 1;
      background: #1A1A1A;
      border: 1px solid rgba(201,168,76,0.18);
      border-radius: 6px;
      color: #E8D5A3;
      font-family: 'Jost', sans-serif;
      font-size: 13px;
      font-weight: 300;
      padding: 9px 12px;
      outline: none;
      transition: border-color 0.2s;
      resize: none;
    }
    .cai-input::placeholder { color: rgba(232,213,163,0.3); }
    .cai-input:focus { border-color: rgba(201,168,76,0.45); }
    .cai-send {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #C9A84C, #9A7A2E);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s, opacity 0.2s;
    }
    .cai-send:hover { transform: scale(1.08); }
    .cai-send:disabled { opacity: 0.4; cursor: default; transform: none; }

    /* Mobile */
    @media (max-width: 480px) {
      #calis-ai-panel {
        width: calc(100vw - 2rem);
        right: 1rem;
        bottom: 5.5rem;
      }
      #calis-ai-btn { right: 5.5rem; }
    }
  `;
  document.head.appendChild(style);

  /* ── Knowledge base ── */
  const KB = `
You are the Calis Adventures AI assistant. Be warm, helpful and concise. Always sign off messages with a friendly offer to help further.

COMPANY INFO:
- Name: Calis Adventures (premium brand: Calis Elite)
- Founded: 2014, Nairobi, Kenya
- Tagline: "Where Luxury Meets Adventure"
- Phone: +254 732 633 470
- Email: Calisadventures405@gmail.com
- WhatsApp: https://wa.me/254732633470
- Experience: 2 years active, 2 safaris completed, 4 clients served, 7 destinations visited, 2,000+ lives impacted
- Location: Nationwide across Kenya
- Working hours: Daily 9:00am – 5:00pm EAT, including public holidays

SERVICES:
1. Bus Tours — modern air-conditioned coaches for groups across East Africa
2. Diving Services — certified instructors, Kenyan coast coral reefs
3. Car Reservations — luxury vehicle hire
4. Airport Transfers — seamless door-to-door transfers
5. Hotel Reservations — curated hotel bookings
6. Tourist Guide Services — expert local guides
7. Event Hosting — corporate and private events
8. Team Building — curated outdoor team experiences
9. Safari Packages — Masai Mara, Amboseli, Tsavo and more
10. Mount Kenya / hiking — guided summit and trail hikes

BOOKING: Direct visitors to call +254 732 633 470, WhatsApp, or use the booking form on the page (scroll to #bookings).

TONE: Warm, professional, luxury-focused. Keep responses to 2-4 sentences max. Never make up prices — say "contact us for a custom quote".
  `.trim();

  /* ── Quick suggestions ── */
  const QUICK = ['Our services', 'Book a safari', 'Contact us', 'Diving trips', 'Airport transfer'];

  /* ── DOM Build ── */
  // Trigger button
  const btn = document.createElement('button');
  btn.id = 'calis-ai-btn';
  btn.title = 'Chat with Calis AI';
  btn.setAttribute('aria-label', 'Open Calis AI Assistant');
  btn.innerHTML = `
    <div class="ai-pulse"></div>
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#0A0A0A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <path d="M8 10h8M8 14h5" stroke="#0A0A0A" stroke-width="1.6"/>
    </svg>
  `;

  // Panel
  const panel = document.createElement('div');
  panel.id = 'calis-ai-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Calis AI Assistant');
  panel.innerHTML = `
    <div class="cai-header">
      <div class="cai-avatar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round">
          <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="#0A0A0A"/>
        </svg>
      </div>
      <div class="cai-header-info">
        <div class="cai-header-name">Calis AI Assistant</div>
        <div class="cai-header-status">Online · Ready to help</div>
      </div>
      <button class="cai-close" id="caiClose" aria-label="Close assistant">×</button>
    </div>
    <div class="cai-messages" id="caiMessages"></div>
    <div class="cai-quick" id="caiQuick"></div>
    <div class="cai-input-row">
      <input class="cai-input" id="caiInput" type="text" placeholder="Ask me anything…" autocomplete="off" maxlength="300"/>
      <button class="cai-send" id="caiSend" aria-label="Send">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0A0A0A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#0A0A0A" stroke="none"/>
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  /* ── Refs ── */
  const messagesEl = document.getElementById('caiMessages');
  const inputEl    = document.getElementById('caiInput');
  const sendBtn    = document.getElementById('caiSend');
  const closeBtn   = document.getElementById('caiClose');
  const quickEl    = document.getElementById('caiQuick');

  let isOpen    = false;
  let isLoading = false;
  let history   = [];

  /* ── Quick reply chips ── */
  QUICK.forEach(q => {
    const b = document.createElement('button');
    b.className = 'cai-quick-btn';
    b.textContent = q;
    b.addEventListener('click', () => sendMessage(q));
    quickEl.appendChild(b);
  });

  /* ── Toggle ── */
  function openPanel() {
    isOpen = true;
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    if (!messagesEl.children.length) greet();
    setTimeout(() => inputEl.focus(), 300);
  }
  function closePanel() {
    isOpen = false;
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => isOpen ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);

  /* ── Greeting ── */
  function greet() {
    addBubble('bot', '👋 <strong>Jambo!</strong> I\'m the Calis AI Assistant. I can help you explore our safaris, services, and booking options across East Africa. What would you like to know?');
  }

  /* ── Bubble ── */
  function addBubble(role, html) {
    const div = document.createElement('div');
    div.className = `cai-bubble ${role}`;
    div.innerHTML = html;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  /* ── Typing indicator ── */
  function showTyping() {
    const t = document.createElement('div');
    t.className = 'cai-typing';
    t.id = 'caiTyping';
    t.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(t);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    const t = document.getElementById('caiTyping');
    if (t) t.remove();
  }

  /* ── Send ── */
  async function sendMessage(text) {
    text = (text || inputEl.value).trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    addBubble('user', escHtml(text));
    quickEl.style.display = 'none';

    history.push({ role: 'user', content: text });

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: KB,
          messages: history
        })
      });

      const data = await res.json();
      hideTyping();

      const reply = data?.content?.[0]?.text || "I'm sorry, I couldn't get a response. Please try calling us on +254 732 633 470 or WhatsApp!";
      history.push({ role: 'assistant', content: reply });
      addBubble('bot', formatReply(reply));

    } catch (e) {
      hideTyping();
      addBubble('bot', 'Sorry, something went wrong. Please reach us directly on <a href="https://wa.me/254732633470" target="_blank" style="color:#C9A84C;">WhatsApp</a> or call <a href="tel:254732633470" style="color:#C9A84C;">+254 732 633 470</a>.');
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  /* ── Helpers ── */
  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function formatReply(s) {
    // Linkify phone and WhatsApp mentions
    return escHtml(s)
      .replace(/\+254[\s\d]{9,12}/g, m => `<a href="tel:${m.replace(/\s/g,'')}" style="color:#C9A84C;">${m}</a>`)
      .replace(/wa\.me\/\S+/g, m => `<a href="https://${m}" target="_blank" style="color:#C9A84C;">${m}</a>`)
      .replace(/\n/g, '<br>');
  }

  /* ── Keyboard ── */
  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  sendBtn.addEventListener('click', () => sendMessage());

  /* ── Close on outside click ── */
  document.addEventListener('click', e => {
    if (isOpen && !panel.contains(e.target) && e.target !== btn) closePanel();
  });

})();
