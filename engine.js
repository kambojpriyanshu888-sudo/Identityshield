/* IdentityShield: deterministic, browser-local signals. No network requests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.IdentityEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clean = value => String(value || '').trim();
  const normalize = value => clean(value).toLowerCase().replace(/\s+/g, ' ');
  const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'shorturl.at', 'rb.gy', 'is.gd', 'cutt.ly'];
  const brands = {
    linkedin: ['linkedin.com', 'lnkd.in'], google: ['google.com', 'google.co.in', 'gmail.com'],
    microsoft: ['microsoft.com', 'microsoftonline.com', 'live.com', 'outlook.com'],
    instagram: ['instagram.com'], facebook: ['facebook.com', 'fb.com'], paypal: ['paypal.com']
  };
  function parseLink(value) {
    const text = clean(value);
    if (!text || /\s/.test(text)) throw new Error('Enter a complete link or domain without spaces.');
    if (/^[a-z][a-z0-9+.-]*:/i.test(text) && !/^https?:\/\//i.test(text)) {
      throw new Error('Use an http or https web link. Other link types are not supported.');
    }
    let url;
    try { url = new URL(/^https?:\/\//i.test(text) ? text : 'https://' + text); }
    catch (_) { throw new Error('That link could not be read. Check the spelling and try again.'); }
    if (!url.hostname || (!url.hostname.includes('.') && url.hostname !== 'localhost')) {
      throw new Error('Enter a full domain, such as example.com.');
    }
    return { hostname: url.hostname.toLowerCase().replace(/\.$/, ''), protocol: url.protocol,
      username: url.username, password: url.password, href: url.href };
  }
  const matchesDomain = (host, domain) => host === domain || host.endsWith('.' + domain);
  function level(score, signals) {
    return score >= 6 ? 'high' : signals.length ? 'medium' : 'low';
  }
  const labels = { high: 'Strong warning signs', medium: 'Some warning signs', low: 'No clear warning signs' };
  function requestSignals(text) {
    const signals = [];
    const sentences = clean(text).split(/(?:[.!?]\s+|\n)/);
    const negated = s => /(?:do not|don['’]t|never)\s+(?:ever\s+)?(?:share|send|provide|enter|give|reveal|tell|upload|pay|transfer|deposit)\b/i.test(s)
      || /(?:will not|won['’]t|never)\s+ask\b/i.test(s);
    const request = /\b(?:send|share|provide|confirm|enter|submit|tell|give|verify|upload|reply|need)\b[\s\S]{0,85}\b(?:otp|one[- ]time (?:password|code|passcode)|password|passcode|pin|cvv|recovery code|backup code|security code)\b/i;
    const identity = /\b(?:send|share|upload|provide|submit)\b[\s\S]{0,85}\b(?:aadhaar|aadhar|passport|pan card|government id|identity document|bank details|card details)\b/i;
    const credential = sentences.find(s => !negated(s) && request.test(s));
    const document = sentences.find(s => !negated(s) && identity.test(s));
    if (credential) signals.push({ id: 'credentials', title: 'A secret or sign-in code is being requested',
      detail: 'A request to disclose a password, PIN or one-time code can expose an account. Verify independently before acting.',
      evidence: credential.trim().slice(0, 210), weight: 6, source: 'Message' });
    if (document) signals.push({ id: 'identity', title: 'Sensitive identity information is requested',
      detail: 'Identity documents and banking details can be misused. Confirm the organisation and its collection process through an official channel.',
      evidence: document.trim().slice(0, 210), weight: 3, source: 'Message' });
    const urgency = /\b(?:act now|immediately|urgent|last chance|today only|within \d+ (?:minutes?|hours?)|account (?:will be |has been )?(?:blocked|suspended|deleted)|avoid suspension)\b/i.exec(text);
    if (urgency) signals.push({ id: 'urgency', title: 'Pressure to act quickly',
      detail: 'Time pressure can discourage verification. Urgency alone does not establish fraud.',
      evidence: urgency[0], weight: 1, source: 'Message' });
    const moneyPattern = /\b(?:pay|transfer|deposit|send)\b[^.!?\n]{0,65}(?:₹|\brs\.?\s*\d|\b(?:money|rupees|fee|payment|upi)\b)|\b(?:registration|processing|verification|refundable) fee\b/i;
    const moneySentence = sentences.find(s => !negated(s) && moneyPattern.test(s));
    const money = moneySentence ? moneyPattern.exec(moneySentence) : null;
    if (money) signals.push({ id: 'money', title: 'A payment or transfer is requested',
      detail: 'Confirm payment instructions with the person or organisation using contact information you already trust.',
      evidence: money[0].slice(0, 180), weight: 2, source: 'Message' });
    return signals;
  }
  function linkSignals(link, expectedDomain) {
    const signals = [];
    if (link.username || link.password) signals.push({ id: 'userinfo', title: 'The link disguises its destination',
      detail: 'Text before an @ sign is not the website host. The actual destination is the hostname shown below.',
      evidence: link.hostname, weight: 4, source: 'Link' });
    if (link.protocol === 'http:') signals.push({ id: 'http', title: 'The link uses an unencrypted connection',
      detail: 'HTTP does not protect information in transit. Do not enter account or identity details on this connection.',
      evidence: 'http://', weight: 2, source: 'Link' });
    if (shorteners.some(d => matchesDomain(link.hostname, d))) signals.push({ id: 'shortener', title: 'A shortened link hides the final destination',
      detail: 'This checker does not follow redirects. Get the destination through an independently verified source.',
      evidence: link.hostname, weight: 2, source: 'Link' });
    if (link.hostname.includes('xn--')) signals.push({ id: 'unicode', title: 'The domain uses internationalised characters',
      detail: 'These domains can be legitimate, but some look like familiar names. Compare the exact domain with an independently trusted source.',
      evidence: link.hostname, weight: 2, source: 'Link' });
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(link.hostname) || link.hostname.startsWith('[') || link.hostname === 'localhost') signals.push({ id: 'ip', title: 'The destination is an IP address or local host',
      detail: 'A numeric or local address does not establish the identity of the organisation being claimed.',
      evidence: link.hostname, weight: 2, source: 'Link' });
    if (expectedDomain && !matchesDomain(link.hostname, expectedDomain)) signals.push({ id: 'domain-mismatch', title: 'The destination differs from the domain you expect',
      detail: 'The hostname is outside the expected domain you supplied. Confirm the correct address independently.',
      evidence: link.hostname + ' ≠ ' + expectedDomain, weight: 4, source: 'Link' });
    if (!expectedDomain) {
      for (const [brand, domains] of Object.entries(brands)) {
        if (link.hostname.includes(brand) && !domains.some(d => matchesDomain(link.hostname, d))) {
          signals.push({ id: 'brand-domain', title: 'A familiar brand appears in an unconfirmed domain',
            detail: 'Having a brand name in a hostname does not make it an official website. Verify the destination independently.',
            evidence: link.hostname, weight: 3, source: 'Link' });
          break;
        }
      }
    }
    return signals;
  }
  function analyzeMessage(input) {
    const message = clean(input.message), rawLink = clean(input.url);
    if (!message && !rawLink) throw new Error('Paste a message or enter a link to start your check.');
    if (message.length > 12000 || rawLink.length > 2048) throw new Error('Use a message under 12,000 characters and a link under 2,048 characters.');
    const extracted = message.match(/https?:\/\/[^\s<>"']+/gi) || [];
    const linkTexts = [...new Set([rawLink, ...extracted.map(s => s.replace(/[.,;!?)\]]+$/, ''))].filter(Boolean))].slice(0, 5);
    const links = linkTexts.map(parseLink);
    const expectedDomain = clean(input.expected) ? parseLink(input.expected).hostname.replace(/^www\./, '') : '';
    const signals = requestSignals(message);
    links.forEach((link, index) => linkSignals(link, expectedDomain).forEach(signal => {
      signals.push({ ...signal, id: signal.id + '-' + index });
    }));
    const score = signals.reduce((sum, signal) => sum + signal.weight, 0);
    const risk = level(score, signals);
    return { type: 'message', title: 'Message & link check', risk, label: labels[risk], signals,
      domains: [...new Set(links.map(l => l.hostname))], expectedDomain,
      checks: ['Sensitive requests', 'Pressure & payment cues', 'Link structure', 'Domain comparison'],
      note: 'This is a pattern check, not a verified threat verdict. Missing warning signs do not establish safety. Links are not opened, and redirects are not followed.',
      scenario: 'message', timestamp: new Date().toISOString() };
  }
  function distance(a, b) {
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let prev = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const next = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = next;
      }
    }
    return row[b.length];
  }
  function similarity(a, b) {
    const x = normalize(a), y = normalize(b);
    if (!x || !y) return 0;
    return 1 - distance(x, y) / Math.max(x.length, y.length);
  }
  function analyzeProfiles(input) {
    const a = input.trusted || {}, b = input.suspect || {};
    const nameA = normalize(a.name), nameB = normalize(b.name);
    const handleA = normalize(a.handle).replace(/^@/, ''), handleB = normalize(b.handle).replace(/^@/, '');
    if (!nameA || !nameB || !handleA || !handleB) throw new Error('Enter a display name and username for both profiles.');
    for (const profile of [a, b]) {
      if (Object.values(profile).some(v => String(v).length > 2500)) throw new Error('Keep each profile field under 2,500 characters.');
      if (clean(profile.url)) parseLink(profile.url);
      if (clean(profile.email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(profile.email))) throw new Error('Check the format of the contact email, or leave it blank.');
    }
    const signals = [];
    const sameName = similarity(nameA, nameB) >= 0.82;
    if (sameName && handleA !== handleB) {
      const close = similarity(handleA, handleB) >= 0.7;
      signals.push({ id: 'handle', title: close ? 'Similar name with a lookalike username' : 'Similar name with a different username',
        detail: 'A changed username can be a clue when an account claims to be the same person. Different people can share a name; confirm through a trusted channel.',
        evidence: '@' + handleA + ' / @' + handleB, weight: close ? 2 : 1, source: 'Profile' });
    }
    if (handleA !== handleB && clean(a.bio).length >= 15 && clean(b.bio).length >= 15 && similarity(a.bio, b.bio) >= 0.8) {
      signals.push({ id: 'bio', title: 'The supplied biographies are very similar',
        detail: 'Public biographies can be copied. Similar text supports a closer look but does not establish who owns either profile.',
        evidence: 'Similar wording in the two supplied biographies', weight: 1, source: 'Profile' });
    }
    if (sameName && clean(a.email) && clean(b.email) && normalize(a.email) !== normalize(b.email)) {
      signals.push({ id: 'contact', title: 'The contact email differs',
        detail: 'The two supplied contact addresses do not match. An alternative address can be legitimate; verify it before sharing information.',
        evidence: 'Different supplied contact emails', weight: 2, source: 'Profile' });
    }
    signals.push(...requestSignals(clean(input.message)));
    const score = signals.reduce((sum, s) => sum + s.weight, 0);
    const risk = level(score, signals);
    return { type: 'profile', title: 'Profile comparison', risk, label: labels[risk], signals, domains: [],
      checks: ['Display names', 'Username similarity', 'Public bio wording', 'Contact consistency'],
      note: 'This compares only the details you supplied. It does not retrieve profiles, verify account ownership, or establish impersonation. Matching details do not prove authenticity.',
      scenario: 'impersonation', timestamp: new Date().toISOString() };
  }
  function savedSummary(result) {
    return { id: 'scan-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7), type: result.type,
      title: result.title, risk: result.risk, label: result.label,
      signals: result.signals.map(({ id, title, detail, weight, source }) => ({ id, title, detail, weight, source })),
      domains: result.domains || [], checks: result.checks || [], note: result.note,
      scenario: result.scenario, timestamp: result.timestamp, savedAt: new Date().toISOString() };
  }
  return { parseLink, matchesDomain, analyzeMessage, analyzeProfiles, savedSummary, labels };
});
