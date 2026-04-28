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
  const QUICK = ['Our services', 'Book a safari', 'Diving trips', 'Airport transfer', 'Get a quote'];

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

  /* ── Rule-Based Response Engine ── */
  const WA = 'https://wa.me/254732633470?text=Hi%20Calis%20Adventures%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.';
  const TEL = 'tel:254732633470';
  const EMAIL = 'mailto:Calisadventures545@gmail.com';
  const SITE = 'https://styv1220.github.io/calis-website/';

  const RESPONSES = [
    // ── Greetings ──
    {
      keys: ['hello', 'hi', 'hey', 'jambo', 'habari', 'good morning', 'good afternoon', 'good evening', 'sasa', 'niaje'],
      reply: `👋 <strong>Jambo!</strong> Welcome to Calis Adventures — where luxury meets adventure!<br><br>I can help you with our services, bookings, destinations, pricing, and more. What would you like to know?`
    },

    // ── Services overview ──
    {
      keys: ['service', 'offer', 'what do you do', 'what you do', 'what can you do', 'options', 'packages'],
      reply: `🌍 Here's everything we offer:<br><br>🚌 <strong>Bus Tours</strong> — group travel across East Africa<br>🤿 <strong>Diving</strong> — certified instructors, Kenyan coast<br>🚙 <strong>Car Hire</strong> — 4×4s, minibuses, saloons<br>✈️ <strong>Airport Transfers</strong> — JKIA, Wilson & regional<br>🏨 <strong>Hotel Reservations</strong> — lodges, camps & hotels<br>🧭 <strong>Tourist Guides</strong> — bilingual local experts<br>🎪 <strong>Event Hosting</strong> — corporate & private events<br>🤝 <strong>Team Building</strong> — outdoor adventure retreats<br>🦁 <strong>Safaris</strong> — Masai Mara, Amboseli, Tsavo & more<br><br>Which one interests you?`
    },

    // ── Safari ──
    {
      keys: ['safari', 'masai mara', 'mara', 'amboseli', 'tsavo', 'game drive', 'wildlife', 'animal', 'big five', 'lion', 'elephant', 'leopard'],
      reply: `🦁 Our <strong>Safari Packages</strong> cover Kenya's finest parks:<br><br>• <strong>Masai Mara</strong> — Big Five, wildebeest migration<br>• <strong>Amboseli</strong> — elephants with Kilimanjaro views<br>• <strong>Tsavo East & West</strong> — vast wilderness, red elephants<br>• <strong>Nakuru</strong> — flamingos, rhinos, giraffes<br>• <strong>Samburu</strong> — rare northern species<br><br>Every safari is fully tailored — private game drives, luxury camps, expert guides.<br><br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a>`
    },

    // ── Diving ──
    {
      keys: ['dive', 'diving', 'snorkel', 'snorkelling', 'coral', 'reef', 'marine', 'underwater', 'scuba', 'ocean', 'sea', 'fish'],
      reply: `🤿 Our <strong>Diving Services</strong> operate along the stunning Kenyan coast:<br><br>• Certified dive instructors for all levels<br>• Beginner lessons & advanced dives<br>• Vibrant coral reefs & marine life<br>• Full equipment provided<br><br>Popular spots: <strong>Diani, Watamu, Malindi, Shimoni</strong><br><br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a>`
    },

    // ── Bus Tours ──
    {
      keys: ['bus', 'bus tour', 'coach', 'group tour', 'group travel', 'church', 'school trip', 'matatu'],
      reply: `🚌 Our <strong>Bus Tours</strong> are perfect for groups of any size:<br><br>• Modern air-conditioned coaches<br>• Church groups, school trips, corporate travel<br>• Nationwide coverage across East Africa<br>• Professional drivers included<br><br>💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a> for a group quote · 📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a>`
    },

    // ── Car Hire ──
    {
      keys: ['car', 'vehicle', 'hire', 'rent', '4x4', 'minibus', 'saloon', 'drive', 'self drive', 'chauffeur'],
      reply: `🚙 Our <strong>Car Reservations</strong> include:<br><br>• 4×4 safari vehicles for off-road<br>• Minibuses for group travel<br>• Saloons for city transfers<br>• All vehicles well-maintained & insured<br>• Driver-guided or self-drive options<br><br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a>`
    },

    // ── Airport Transfer ──
    {
      keys: ['airport', 'transfer', 'pickup', 'pick up', 'jkia', 'wilson', 'drop', 'drop off', 'nairobi airport', 'flight', 'arrive', 'arrival', 'departure', 'land'],
      reply: `✈️ Our <strong>Airport Transfer</strong> service covers:<br><br>• <strong>JKIA</strong> (Jomo Kenyatta International)<br>• <strong>Wilson Airport</strong><br>• Regional airstrips across Kenya<br>• Meet & greet on arrival<br>• Clean, punctual, professional drivers<br><br>Book in advance to guarantee your slot:<br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a>`
    },

    // ── Hotel / Accommodation ──
    {
      keys: ['hotel', 'lodge', 'camp', 'accommodation', 'stay', 'book hotel', 'tented', 'airbnb', 'where to stay', 'night', 'room'],
      reply: `🏨 We curate and book the finest stays across Kenya:<br><br>• Luxury tented camps in the wild<br>• Premium lodges near national parks<br>• Boutique hotels in Nairobi & coast<br>• Budget-friendly options available<br><br>Tell us your destination, dates & budget and we'll find the perfect fit:<br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a>`
    },

    // ── Tourist Guide ──
    {
      keys: ['guide', 'tourist guide', 'local guide', 'bilingual', 'tour guide', 'interpreter', 'accompany'],
      reply: `🧭 Our <strong>Tourist Guides</strong> are the best in the business:<br><br>• Born & raised in East Africa<br>• Bilingual — English & Swahili<br>• Deep knowledge of wildlife, culture & history<br>• Available for day trips & multi-day tours<br>• Safety trained & fully vetted<br><br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a>`
    },

    // ── Events ──
    {
      keys: ['event', 'hosting', 'gala', 'festival', 'celebration', 'corporate event', 'party', 'wedding', 'conference', 'meetup', 'graduation'],
      reply: `🎪 Our <strong>Event Hosting</strong> service covers everything:<br><br>• Corporate galas & conferences<br>• Outdoor festivals & concerts<br>• Private celebrations & weddings<br>• Venue sourcing, logistics & décor<br>• Catering coordination<br>• End-to-end management<br><br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a> for a proposal`
    },

    // ── Team Building ──
    {
      keys: ['team building', 'team', 'corporate', 'retreat', 'company', 'staff', 'office', 'hr', 'bonding', 'employees'],
      reply: `🤝 Our <strong>Team Building</strong> packages are designed to energise and bond your team:<br><br>• Adventure-based outdoor activities<br>• Collaborative challenges & games<br>• Nature retreats — Naivasha, Elementaita & more<br>• Customised for your team size & goals<br>• Full catering & transport options<br><br>Past clients from Nairobi, Mombasa & Eldoret.<br>💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a> · 📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a>`
    },

    // ── Pricing ──
    {
      keys: ['price', 'cost', 'how much', 'rate', 'charge', 'fee', 'pricing', 'quote', 'budget', 'afford', 'cheap', 'expensive', 'ksh', 'kes', 'shilling'],
      reply: `💰 Our pricing is fully <strong>custom</strong> based on:<br><br>• Service type<br>• Group size<br>• Duration & destination<br>• Season & availability<br><br>We don't do fixed packages — every quote is tailored to you. Get yours now:<br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a><br>💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a><br>✉️ <a href="${EMAIL}" style="color:#C9A84C;">Calisadventures545@gmail.com</a>`
    },

    // ── Booking ──
    {
      keys: ['book', 'booking', 'reserve', 'reservation', 'schedule', 'appointment', 'inquiry', 'enquiry', 'interested', 'how do i'],
      reply: `📋 Booking with us is simple — 3 ways:<br><br>1️⃣ 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a> — fastest response<br>2️⃣ 📞 <a href="${TEL}" style="color:#C9A84C;">Call +254 732 633 470</a><br>3️⃣ ✉️ <a href="${EMAIL}" style="color:#C9A84C;">Email us</a><br><br>We respond within <strong>24 hours</strong> with a personalised itinerary & quote.`
    },

    // ── Contact ──
    {
      keys: ['contact', 'reach', 'call', 'phone', 'email', 'whatsapp', 'talk', 'speak', 'message', 'get in touch'],
      reply: `📬 <strong>Contact Calis Adventures:</strong><br><br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a><br>💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a><br>✉️ <a href="${EMAIL}" style="color:#C9A84C;">Calisadventures545@gmail.com</a><br>🌐 <a href="${SITE}" target="_blank" style="color:#C9A84C;">Visit our website</a><br><br>🕐 Daily: 9:00am – 5:00pm EAT`
    },

    // ── Working Hours ──
    {
      keys: ['hour', 'open', 'working hours', 'time', 'available', 'when', 'office hours', 'closed', 'weekend', 'holiday'],
      reply: `🕐 We are open <strong>every day</strong> including weekends and public holidays:<br><br>⏰ <strong>9:00am – 5:00pm EAT</strong><br><br>For urgent inquiries outside office hours, <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a> is your best option — we monitor it regularly.`
    },

    // ── Location ──
    {
      keys: ['location', 'where', 'address', 'based', 'nairobi', 'office', 'find you', 'physical'],
      reply: `📍 We are based in <strong>Nairobi, Kenya</strong> and operate nationwide across Kenya and East Africa.<br><br>We don't have a walk-in office — all bookings are handled via phone, WhatsApp, and email for your convenience.<br><br>💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a> · 📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a>`
    },

    // ── Destinations ──
    {
      keys: ['destination', 'naivasha', 'nakuru', 'diani', 'watamu', 'malindi', 'samburu', 'lake', 'mombasa', 'kisumu', 'eldoret', 'coast', 'rift valley', 'where do you go', 'where can i go'],
      reply: `🗺️ We cover destinations all across Kenya:<br><br>🦁 <strong>Wildlife:</strong> Masai Mara, Amboseli, Tsavo, Samburu, Nakuru<br>🌊 <strong>Coast:</strong> Diani, Watamu, Malindi, Mombasa, Shimoni<br>💧 <strong>Lakes:</strong> Naivasha, Nakuru, Elementaita, Baringo<br>🏙️ <strong>Cities:</strong> Nairobi, Mombasa, Kisumu, Eldoret<br><br>Tell us where you want to go:<br>💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a>`
    },

    // ── About ──
    {
      keys: ['about', 'who are you', 'who is calis', 'company', 'history', 'founded', 'story', 'background', 'calis elite', 'calis adventures'],
      reply: `🌍 <strong>Calis Adventures</strong> — premium brand: <em>Calis Elite</em><br><br>Founded in <strong>Nairobi, Kenya</strong> with one vision: to show the world the breathtaking beauty of East Africa in a personal, authentic way.<br><br>📊 In just 2 years:<br>• 2 safaris completed<br>• 4 clients served<br>• 7 destinations visited<br>• 2,000+ lives impacted<br><br>🌐 <a href="${SITE}" target="_blank" style="color:#C9A84C;">Visit our full website</a>`
    },

    // ── Reviews / Testimonials ──
    {
      keys: ['review', 'testimonial', 'rating', 'feedback', 'experience', 'client', 'trust', 'legit', 'reliable', 'reputation'],
      reply: `⭐ Our clients rate us <strong>4.9 / 5</strong> on average.<br><br>Here's what they say:<br><br>💬 <em>"Every moment felt curated just for us"</em> — Collins, Kisumu<br>💬 <em>"Arrived everywhere on time, guides were brilliant"</em> — Stephen, Eldoret<br>💬 <em>"My mum — terrified of water — loved the diving"</em> — Kevin, Nakuru<br><br>🌐 <a href="${SITE}#testimonials" target="_blank" style="color:#C9A84C;">Read all reviews on our website</a>`
    },

    // ── Safety ──
    {
      keys: ['safe', 'safety', 'secure', 'risk', 'danger', 'first aid', 'insured', 'trust', 'reliable', 'certified'],
      reply: `🛡️ Your safety is our top priority at Calis Adventures:<br><br>• All guides are <strong>first aid trained</strong><br>• Vehicles are regularly inspected & insured<br>• Routes are planned with safety protocols<br>• Dive instructors are fully <strong>certified</strong><br>• 24/7 support during your trip<br><br>Any concerns? 📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a>`
    },

    // ── Group size ──
    {
      keys: ['group', 'group size', 'how many', 'people', 'family', 'solo', 'couple', 'friends', 'large group', 'small group'],
      reply: `👥 We cater for all group sizes:<br><br>• Solo travellers<br>• Couples & families<br>• Small groups (3–10)<br>• Large groups (11–50+)<br>• Corporate teams of any size<br><br>Pricing adjusts based on group size — larger groups get better rates.<br>💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a> with your group size for a quote.`
    },

    // ── Payment ──
    {
      keys: ['pay', 'payment', 'mpesa', 'cash', 'bank', 'deposit', 'transfer', 'invoice', 'receipt', 'how to pay'],
      reply: `💳 <strong>Payment options:</strong><br><br>• M-Pesa (most popular)<br>• Bank transfer<br>• Cash on agreement<br><br>A deposit is typically required to confirm your booking. Full payment details are shared when you book.<br><br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a>`
    },

    // ── Cancellation / Refund ──
    {
      keys: ['cancel', 'cancellation', 'refund', 'reschedule', 'change date', 'postpone'],
      reply: `🔄 <strong>Cancellation & Rescheduling:</strong><br><br>We understand plans can change. Our policy:<br>• Rescheduling is possible with advance notice<br>• Cancellation terms depend on how close to the travel date<br>• We handle every case with flexibility & fairness<br><br>Contact us directly to discuss:<br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a>`
    },

    // ── What to bring / pack ──
    {
      keys: ['bring', 'pack', 'packing', 'what to wear', 'clothes', 'prepare', 'preparation', 'checklist', 'luggage', 'bag'],
      reply: `🎒 <strong>What to bring on your trip:</strong><br><br>🦁 <strong>Safari:</strong> Neutral-coloured clothes, sunscreen, hat, binoculars, camera, insect repellent<br>🤿 <strong>Diving:</strong> Swimwear, towel, sunscreen, water shoes (equipment provided)<br>🚌 <strong>Bus Tours:</strong> Comfortable clothes, snacks, camera, valid ID<br>✈️ <strong>Airport Transfer:</strong> Just your luggage — we handle the rest<br><br>Questions? 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a>`
    },

    // ── Best time to visit ──
    {
      keys: ['best time', 'season', 'when to go', 'weather', 'rainy', 'dry season', 'migration', 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
      reply: `📅 <strong>Best times to visit Kenya:</strong><br><br>🌞 <strong>Jul – Oct</strong> — Best for wildlife, wildebeest migration in Mara<br>🌞 <strong>Jan – Feb</strong> — Excellent game viewing, fewer crowds<br>🌊 <strong>Oct – Mar</strong> — Best for diving & coast visits<br>🌧️ <strong>Apr – Jun</strong> — Long rains, lush landscapes, lower prices<br><br>We operate <strong>year-round</strong> — every season has something special.<br>💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">Ask us what's best for your dates</a>`
    },

    // ── Visa / Documents ──
    {
      keys: ['visa', 'passport', 'document', 'id', 'permit', 'entry', 'foreigner', 'tourist visa', 'eta'],
      reply: `🛂 <strong>Visiting Kenya:</strong><br><br>• Most nationalities need a visa — apply via the <a href="https://evisa.go.ke" target="_blank" style="color:#C9A84C;">Kenya eVisa portal</a><br>• ETA (Electronic Travel Authorisation) introduced in 2023<br>• Valid passport required (6+ months remaining)<br>• Yellow fever certificate required from some countries<br><br>For latest entry requirements: <a href="https://www.immigration.go.ke" target="_blank" style="color:#C9A84C;">Kenya Immigration</a><br><br>We can help advise — 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp us</a>`
    },

    // ── Currency / Money ──
    {
      keys: ['currency', 'money', 'forex', 'exchange', 'dollar', 'euro', 'pound', 'ksh', 'shilling', 'atm', 'cash'],
      reply: `💵 <strong>Currency in Kenya:</strong><br><br>• Official currency: <strong>Kenyan Shilling (KES/KSh)</strong><br>• USD, EUR & GBP widely accepted at hotels & parks<br>• ATMs widely available in cities<br>• M-Pesa is the dominant mobile payment<br>• Forex bureaus in Nairobi city centre & airports<br><br>Check live rates: <a href="https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=KES" target="_blank" style="color:#C9A84C;">XE Currency Converter</a>`
    },

    // ── Thankyou ──
    {
      keys: ['thank', 'thanks', 'asante', 'appreciate', 'great', 'awesome', 'perfect', 'wonderful', 'excellent', 'good job'],
      reply: `😊 You're most welcome! It's our pleasure.<br><br>Whenever you're ready to book or have more questions, we're here:<br>📞 <a href="${TEL}" style="color:#C9A84C;">+254 732 633 470</a> · 💬 <a href="${WA}" target="_blank" style="color:#C9A84C;">WhatsApp</a>`
    },

    // ── Goodbye ──
    {
      keys: ['bye', 'goodbye', 'see you', 'later', 'kwaheri', 'ciao', 'take care'],
      reply: `👋 <strong>Kwaheri!</strong> Thank you for chatting with Calis Adventures.<br><br>We look forward to making your next adventure truly unforgettable. Safe travels! 🌍<br><br>🌐 <a href="${SITE}" target="_blank" style="color:#C9A84C;">Visit our website anytime</a>`
    }
  ];

  function getRuleBasedReply(text) {
    const lower = text.toLowerCase();
    for (const rule of RESPONSES) {
      if (rule.keys.some(k => lower.includes(k))) {
        return rule.reply;
      }
    }
    return '🤔 I\'m not sure about that one. For detailed help, please reach us directly:<br><br>📞 <a href="tel:254732633470" style="color:#C9A84C;">+254 732 633 470</a><br>💬 <a href="https://wa.me/254732633470?text=Hi%20Calis%20Adventures%2C%20I%20would%20like%20to%20inquire%20about%20your%20services." target="_blank" style="color:#C9A84C;">WhatsApp</a><br>✉️ <a href="mailto:Calisadventures545@gmail.com" style="color:#C9A84C;">Calisadventures545@gmail.com</a>';
  }

  /* ── Send ── */
  function sendMessage(text) {
    text = (text || inputEl.value).trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    addBubble('user', escHtml(text));
    quickEl.style.display = 'none';

    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    // Simulate natural typing delay
    setTimeout(() => {
      hideTyping();
      const reply = getRuleBasedReply(text);
      addBubble('bot', reply);
      isLoading = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }, 800);
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
