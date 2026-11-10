/* RDC Locksmiths — chat assistant widget
 *
 * Two modes, shown clearly in the widget header:
 *  - LIVE AI: when server.js is running with ANTHROPIC_API_KEY set, /api/chat/status returns {live:true}
 *    and free-text questions are answered by Claude via the server (the key never reaches the browser).
 *  - DEMO: otherwise, answers come from the scripted FAQ below. The widget is labelled "Demo assistant".
 * Quote/lead capture works in both modes and is delivered via SiteSubmit() (email if configured, otherwise a pre-filled WhatsApp message).
 */
(function () {
  'use strict';
  const S = window.SITE;
  const root = document.getElementById('chatbot-root');
  if (!root || !S) return;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ic = (n) => `<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const BASE = window.SITE_BASE || '';

  root.innerHTML = `
  <button class="cb-launcher" aria-label="Open chat assistant" aria-controls="cb-panel" aria-expanded="false">
    <span class="cb-av">${ic('sparkle')}</span><span class="dot"></span><span class="cb-label">Questions?</span>
  </button>
  <section class="cb-panel" id="cb-panel" role="dialog" aria-label="Chat with RDC Locksmiths" aria-modal="false">
    <header class="cb-head">
      <span class="cb-av">${ic('sparkle')}</span>
      <div><strong>RDC Locksmiths</strong><small><span class="cb-mode" title="Scripted answers – not connected to an AI service">Automated assistant</span></small></div>
      <button class="cb-close" aria-label="Close chat">${ic('close')}</button>
    </header>
    <div class="cb-body" aria-live="polite"></div>
    <div class="cb-quick"></div>
    <form class="cb-form" autocomplete="off">
      <label class="hp" for="cb-input">Type your message</label>
      <input id="cb-input" type="text" placeholder="Type your message…" maxlength="600" required>
      <button type="submit" aria-label="Send message">${ic('send')}</button>
    </form>
    <p class="cb-foot">Prefer a human? <a href="${S.phoneHref}">Call ${S.phone}</a>${S.whatsapp ? ` · <a href="${S.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>` : (S.email ? ` · <a href="mailto:${S.email}">Email us</a>` : '')}</p>
  </section>`;

  const launcher = root.querySelector('.cb-launcher');
  const body = root.querySelector('.cb-body');
  const quick = root.querySelector('.cb-quick');
  const form = root.querySelector('.cb-form');
  const input = root.querySelector('#cb-input');
  const modeTag = root.querySelector('.cb-mode');

  let live = false; let started = false; let busy = false;
  const history = []; // for live AI context
  let lead = null; // { step, name, email, phone, enquiry }

  // ---------- open / close ----------
  const open = () => {
    document.body.classList.add('cb-open'); launcher.setAttribute('aria-expanded', 'true');
    if (!started) { started = true; init(); }
    setTimeout(() => input.focus({ preventScroll: true }), 300);
  };
  const close = () => { document.body.classList.remove('cb-open'); launcher.setAttribute('aria-expanded', 'false'); launcher.focus(); };
  launcher.addEventListener('click', open);
  root.querySelector('.cb-close').addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('cb-open')) close(); });
  // Any element with data-open-chat opens the assistant
  document.addEventListener('click', (e) => { const t = e.target.closest('[data-open-chat]'); if (t) { e.preventDefault(); open(); } });

  // ---------- rendering ----------
  const scroll = () => { body.scrollTop = body.scrollHeight; };
  const add = (html, who = 'bot') => {
    const d = document.createElement('div'); d.className = 'cb-msg cb-' + who; d.innerHTML = html; body.appendChild(d); scroll(); return d;
  };
  const typing = () => { const d = add('<span class="cb-typing"><span></span><span></span><span></span></span>'); d.style.padding = '0'; return d; };
  const say = (html, delay = 550) => new Promise((res) => { const t = typing(); setTimeout(() => { t.remove(); add(html); res(); }, delay); });
  const chips = (arr) => {
    quick.innerHTML = '';
    arr.forEach((label) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.addEventListener('click', () => handle(label)); quick.appendChild(b);
    });
  };
  const MAIN_CHIPS = ['Locked out', 'Our services', 'Get a quote', 'Areas covered', 'Contact details'];

  async function init() {
    try {
      // Live AI only exists when the site is run with server.js (which sets SITE.chatApi). Static hosting = demo mode.
      if (S.chatApi) { const r = await fetch(S.chatApi + '/status', { headers: { Accept: 'application/json' } }); if (r.ok) { const j = await r.json(); live = !!j.live; } }
    } catch (e) { live = false; }
    if (live) { modeTag.textContent = 'AI assistant'; modeTag.classList.add('live'); modeTag.title = 'Answers generated by AI – please confirm prices and bookings with our team'; }
    await say(`Hello and welcome to RDC Locksmiths. I can help with lockouts, locks, doors and glass, tell you where we cover, or take your details for a quote.`, 400);
    if (!live) add(`<small>This is an <strong>automated assistant</strong> with set answers. For anything else, call us on <a href="${S.phoneHref}">${S.phone}</a> and you’ll get one of us.</small>`);
    chips(MAIN_CHIPS);
  }

  // ---------- scripted knowledge (demo mode + quick replies in both modes) ----------
  const svcList = () => S.services.map((s) => `• <a href="${BASE}services/index.html#${s.id}">${esc(s.title)}</a> — ${esc(s.short)}`).join('\n');
  const contactHtml = () => `📞 <a href="${S.phoneHref}">${S.phone}</a>` + (S.whatsapp ? `\n💬 <a href="${S.whatsapp}" target="_blank" rel="noopener">WhatsApp us</a>` : '') + (S.email ? `\n✉️ <a href="mailto:${S.email}">${S.email}</a>` : '') + `\n📍 ${esc(S.addressLine)}` + (S.openTo == null ? '' : `\n🕗 ${S.openTo - S.openFrom >= 24 ? 'Open 24 hours, 7 days' : S.hoursLabel}`);
  const hoursHtml = () => S.hours.map(([d, h]) => `${d}: <strong>${h}</strong>`).join('\n');

  const intents = [
    { re: /locked out|lock out|lockout|can'?t get in|cannot get in|lost (my )?key|keys? (inside|locked)|emergency|urgent|snapped key|broken key/i, run: () => say(`If you’re locked out, please call us now on <a href="${S.phoneHref}">${S.phone}</a>. Don’t force the door; we use non-destructive entry wherever possible.`).then(() => chips(['Contact details', 'Our services'])) },
    { re: /\b(quote|price|pric|cost|how much|book|booking|estimate|appointment)\b/i, run: startLead },
    { re: /glass|glazing|window|misted|smashed|broken pane|double glaz/i, run: () => svc('glass-replacement', 'We replace broken, cracked and misted glass in doors and windows, so your home is secure and weathertight again.') },
    { re: /new door|install|fit a door|replace (my|the) door|door fitting/i, run: () => svc('door-installation', 'We supply and fit front, back and internal doors, with quality locks.') },
    { re: /hinge|upvc|won'?t (lock|close)|sticking|drop|mechanism|handle|letterbox|door (repair|problem)/i, run: () => svc('door-repairs', 'We fix doors that drop, stick or won’t lock, including hinges, uPVC mechanisms and handles.') },
    { re: /change (my|the)? ?lock|lock change|new lock|replace (a |the )?lock|cylinder|euro|mortice|night latch|stiff lock|lock repair/i, run: () => svc('lock-changes', 'We repair and replace locks, including euro cylinders, mortice locks and night latches, and supply new keys.') },
    { re: /security|anti.?snap|keypad|smart lock|landlord|business|safe/i, run: () => svc('security-upgrades', 'We check and upgrade security, from anti-snap cylinders to keypad and smart locks for businesses.') },
    { re: /area|where|cover|location|based|inverness|kessock|black isle|nairn|dingwall|culloden|highland|near/i, run: () => say(`We’re based in North Kessock and cover ${esc(S.area)}. Not sure if we reach you? Just ask.`).then(() => chips(['Get a quote', 'Contact details'])) },
    { re: /\b(service|services|offer|do you do|what do you)\b/i, run: () => say(`Here’s what we do:\n${svcList()}`).then(() => chips(['Get a quote', 'Locked out', 'Door repairs', 'Glass'])) },
    { re: /hour|open|time|when|weekend|sunday|saturday|today|tonight/i, run: () => say(`For availability, please call or WhatsApp us on <a href="${S.phoneHref}">${S.phone}</a>.`).then(() => chips(['Get a quote', 'Contact details'])) },
    { re: /contact|phone|call|number|email|whatsapp|reach|talk|human|person|facebook/i, run: () => say(`You can reach us here:\n${contactHtml()}` + (S.facebook ? `\n👍 <a href="${S.facebook}" target="_blank" rel="noopener">Facebook</a>` : '')).then(() => chips(MAIN_CHIPS)) },
    { re: /review|rating|rated|stars|recommend/i, run: () => say(`We’re rated 5.0 by local customers. One said: “Robert is very reliable. He turned up when he said he would.” You can read more on our <a href="${S.facebook}" target="_blank" rel="noopener">Facebook page</a>.`).then(() => chips(MAIN_CHIPS)) },
    { re: /insur|dbs|vetted|checked|qualified|certif/i, run: () => say(`Good question. Please ask Robert directly and he’ll be happy to explain:\n${contactHtml()}`).then(() => chips(['Get a quote'])) },
    { re: /^(hi|hello|hey|hiya|good (morning|afternoon|evening))\b/i, run: () => say('Hello! How can I help?').then(() => chips(MAIN_CHIPS)) },
    { re: /thank|thanks|cheers|\bta\b/i, run: () => say('You’re welcome. Anything else I can help with?').then(() => chips(MAIN_CHIPS)) },
  ];
  function svc(id, text) {
    const s = S.services.find((x) => x.id === id);
    return say(`<strong>${esc(s.title)}</strong>\n${text}\n\n<a href="${BASE}services/index.html#${id}">Read more about ${esc(s.title.toLowerCase())}</a>`).then(() => chips(['Get a free quote', 'Our services', 'Contact details']));
  }

  // ---------- lead capture ----------
  function startLead() {
    lead = { step: 'name' };
    chips([]);
    return say('Great. First, what’s your <strong>name</strong>?');
  }
  async function leadStep(text) {
    const v = text.trim();
    if (/^(cancel|stop|exit|quit)$/i.test(v)) { lead = null; await say('No problem, I’ve cancelled that. Anything else?'); chips(MAIN_CHIPS); return; }
    if (lead.step === 'name') {
      if (v.length < 2) return say('Could you tell me your name?');
      lead.name = v.slice(0, 80); lead.step = 'email';
      return say(`Thanks, ${esc(lead.name.split(' ')[0])}! What’s the best <strong>email address</strong> to send your quote to?`);
    }
    if (lead.step === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return say('That doesn’t look like a valid email — could you double-check it?');
      lead.email = v; lead.step = 'phone';
      chips(['Skip']);
      return say('And a <strong>phone number</strong>? (Optional — tap “Skip” if you’d rather not.)');
    }
    if (lead.step === 'phone') {
      if (!/^skip$/i.test(v)) {
        if (!/^[+\d][\d\s()-]{8,16}$/.test(v)) return say('Please enter a valid phone number, or tap “Skip”.');
        lead.phone = v;
      }
      lead.step = 'enquiry'; chips(['Lock change', 'Door repair', 'New door', 'Glass']);
      return say('Lastly, what do you need help with? Include your area and any photos you can send later.');
    }
    if (lead.step === 'enquiry') {
      if (v.length < 3) return say('Could you add a few more details?');
      lead.enquiry = v.slice(0, 1500); chips([]);
      const payload = {
        _subject: `New chatbot enquiry from ${lead.name}`,
        source: 'Website chat assistant', name: lead.name, email: lead.email, phone: lead.phone || 'Not provided', message: lead.enquiry,
      };
      const first = esc(lead.name.split(' ')[0]);
      if (!S.formEndpoint) {
        // No business email configured: hand the enquiry over via WhatsApp (needs a tap, so it isn't blocked as a pop-up)
        const link = window.SiteWhatsAppLink(payload);
        await say(`Thanks ${first}! I’ve put your request together. Tap below to send it to us on WhatsApp:\n<a class="btn btn-wa btn-sm" style="margin-top:8px;text-decoration:none" href="${link.url}" target="_blank" rel="noopener">Send on WhatsApp</a>\nNo WhatsApp? <a href="${link.sms}">Send as a text</a> or call <a href="${S.phoneHref}">${S.phone}</a>.`);
      } else {
        const t = typing();
        try {
          await window.SiteSubmit(payload);
          t.remove();
          add(`✅ <strong>Sent!</strong> Thanks ${first}, your request is with us and we’ll reply to <strong>${esc(lead.email)}</strong> shortly.\nNeed us sooner? Call <a href="${S.phoneHref}">${S.phone}</a>.`);
        } catch (e) {
          t.remove();
          const mail = `mailto:${S.email}?subject=${encodeURIComponent('Quote request')}&body=${encodeURIComponent(`Name: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || '-'}\n\n${lead.enquiry}`)}`;
          add(`Sorry, I couldn’t send that automatically. Please <a href="${mail}">send it by email</a> (I’ve filled it in for you) or call <a href="${S.phoneHref}">${S.phone}</a>.`);
        }
      }
      lead = null; chips(MAIN_CHIPS);
    }
  }

  // ---------- message handling ----------
  async function handle(text) {
    if (busy || !text.trim()) return;
    busy = true;
    add(esc(text), 'user');
    try {
      if (lead) { await leadStep(text); return; }
      const map = { 'Locked out': 'locked out', 'Our services': 'services', 'Get a quote': 'quote', 'Areas covered': 'area', 'Contact details': 'contact', 'Door repairs': 'door repair', 'Glass': 'glass' };
      const q = map[text] || text;
      const scripted = intents.find((it) => it.re.test(q));
      const isChip = Object.prototype.hasOwnProperty.call(map, text) ;
      if (live && !isChip && !(scripted && scripted.run === startLead)) { await askAI(text); return; }
      if (scripted) { await scripted.run(); return; }
      await say(`I’m only a demo assistant, so I don’t have an answer for that one. Our team will happily help:\n${contactHtml()}\n\nOr I can take your details for a quote.`);
      chips(MAIN_CHIPS);
    } finally { busy = false; }
  }

  async function askAI(text) {
    history.push({ role: 'user', content: text });
    const t = typing();
    try {
      const r = await fetch(S.chatApi, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history.slice(-12) }) });
      if (!r.ok) throw new Error('status ' + r.status);
      const j = await r.json();
      t.remove();
      const reply = (j.reply || '').trim() || 'Sorry, I didn’t catch that.';
      history.push({ role: 'assistant', content: reply });
      add(linkify(esc(reply)));
      if (/\b(quote|book)/i.test(reply)) chips(['Get a free quote', 'Contact details']); else chips(MAIN_CHIPS);
    } catch (e) {
      t.remove(); history.pop();
      add(`Sorry, I’m having trouble connecting right now. You can reach us on ${contactHtml()}`);
      chips(MAIN_CHIPS);
    }
  }
  function linkify(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\b[\w.+-]+@[\w-]+\.[\w.]+\b)/g, '<a href="mailto:$1">$1</a>')
      .replace(/(07\d{3}\s?\d{6})/g, (m) => `<a href="${S.phoneHref}">${m}</a>`);
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value; input.value = ''; handle(v); });
})();
