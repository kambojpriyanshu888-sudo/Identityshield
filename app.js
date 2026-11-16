(() => {
  'use strict';
  const E = window.IdentityEngine;
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paths = {
    shield: '<path d="M12 3 3.5 6.5V12c0 5 4 8 8.5 10 4.5-2 8.5-5 8.5-10V6.5L12 3Z"/><path d="m8 12 3 3 5-6"/>',
    scan: '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3M7 8h10M7 12h10M7 16h6"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a5 5 0 0 1 10 0v3m3-16a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5v1"/>',
    clipboard: '<rect x="5" y="5" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="5" rx="1.5"/><path d="m9 15 2 2 4-5"/>',
    history: '<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7m2-4v6l4 2"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2M12 17h.01"/>',
    'arrow-right': '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    external: '<path d="M14 3h7v7m0-7L10 14m0-9H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    warning: '<path d="m10.3 3.8-8 14a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
    link: '<path d="m10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 12a4 4 0 0 0 6 0l5-5a4 4 0 0 0-6-6l-1 1" transform="translate(1 0) scale(.91)"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
    save: '<path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
    file: '<path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h6"/>',
    key: '<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-5-5 3-3m-1 5 3-3"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    fingerprint: '<path d="M8 21c-2-3-3-6-3-9a7 7 0 0 1 14 0m-2 9c-2-3-3-6-3-9a2 2 0 0 0-4 0c0 4 1 7 3 10M2 13v-1a10 10 0 0 1 20 0v4m-7-1c0 3 2 6 3 7M7 12a5 5 0 0 1 10 0v3"/>',
    refresh: '<path d="M20 7a9 9 0 0 0-15-1L2 9m0-6v6h6m-4 8a9 9 0 0 0 15 1l3-3m0 6v-6h-6"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
  };
  const icon = (name, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.shield}</svg>`;
  const hydrateIcons = () => document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  let storageAvailable = true;
  const safeRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (_) { storageAvailable = false; return fallback; } };
  const history = safeRead('identityshield.history.v1', []);
  const state = {
    route: 'scanner', tab: 'message', form: { message: '', url: '', expected: '' }, result: null,
    profiles: { trusted: { name: '', handle: '', bio: '', url: '', email: '' }, suspect: { name: '', handle: '', bio: '', url: '', email: '' }, message: '' },
    profileResult: null, activeResult: null, scenario: 'message', checked: {}, note: '', filter: 'all',
    history: Array.isArray(history) ? history.filter(r => r && ['message', 'profile'].includes(r.type) && ['low', 'medium', 'high'].includes(r.risk) && Array.isArray(r.signals)).slice(0, 50) : []
  };
  const routes = { scanner: 'Message scanner', compare: 'Profile comparison', response: 'Response plan', history: 'Saved checks' };
  const scenarios = {
    message: { name: 'Suspicious message', icon: 'mail', description: 'You received something that does not feel right.', steps: [
      ['Pause before you act', 'Do not use the supplied link, open an attachment, or reply with sensitive information.'],
      ['Verify through a trusted channel', 'Contact the person or organisation using a number or website you already know, rather than details in the message.'],
      ['Preserve what you received', 'Keep the original message, sender identifier, URL, screenshots and date.'],
      ['Report the suspicious account or message', 'Use the platform’s own reporting tools. You can also use the official Report Suspect facility below.'],
      ['Review your account protection', 'Use unique passwords and enable multifactor authentication or a passkey where supported.']
    ] },
    impersonation: { name: 'Possible impersonation', icon: 'users', description: 'Another account may be presenting itself as you.', steps: [
      ['Capture the account details', 'Record the public profile URL, username, screenshots of the claims and when you noticed them.'],
      ['Check your own account access', 'Open the official app or website independently and review your sign-in activity and recovery details.'],
      ['Report impersonation on the platform', 'Use the platform’s reporting process. Describe the observed facts and include the relevant evidence.'],
      ['Let your contacts know', 'Use an established channel to warn contacts about the suspected account. Ask them to verify unexpected requests.'],
      ['Keep a record of your reports', 'Save report references, responses and any further activity. Use the official reporting options if appropriate.']
    ] },
    compromised: { name: 'Account details shared', icon: 'key', description: 'You disclosed a password, code or recovery information.', steps: [
      ['Open the official service independently', 'Use your saved app or a known official address. Do not return through the suspicious message.'],
      ['Change affected passwords', 'Set a new, unique password. Change it on other accounts if you reused the exposed password.'],
      ['Review sessions and recovery settings', 'Use the official security settings to end unfamiliar sessions and check recovery email addresses and phone numbers.'],
      ['Strengthen sign-in protection', 'Enable multifactor authentication or a passkey where supported. Do not approve unexpected sign-in requests.'],
      ['Preserve evidence and report the incident', 'Record the message and any unauthorised activity. Contact the service’s official support or recovery channel.']
    ] },
    money: { name: 'Money was involved', icon: 'warning', description: 'You made a payment or noticed an unauthorised transaction.', steps: [
      ['Contact your bank or payment provider promptly', 'Use the official app or a verified number to report the transaction and ask about securing your account.'],
      ['Keep transaction evidence', 'Save transaction IDs, receipts, dates, recipient details and the messages connected to the payment.'],
      ['Report through the official cybercrime portal', 'Use the National Cyber Crime Reporting Portal. Keep the acknowledgement or reference number.'],
      ['Secure any accounts you exposed', 'Change affected passwords through official services, review active sessions and enable multifactor authentication.'],
      ['Monitor for further activity', 'Review transactions and security notifications. Be cautious of anyone requesting another payment to recover your money.']
    ] }
  };
  const date = value => { try { return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date(value)); } catch (_) { return 'Saved check'; } };
  const heroArt = `<div class="hero-art" aria-hidden="true"><svg viewBox="0 0 370 250" fill="none"><defs><linearGradient id="shield-front" x1="138" y1="53" x2="248" y2="201" gradientUnits="userSpaceOnUse"><stop stop-color="#a89aff"/><stop offset=".48" stop-color="#7760ed"/><stop offset="1" stop-color="#4c3fc0"/></linearGradient><linearGradient id="shield-inner" x1="160" y1="70" x2="229" y2="180"><stop stop-color="#e8e2ff"/><stop offset="1" stop-color="#a49af3"/></linearGradient><filter id="shadow"><feGaussianBlur stdDeviation="12"/></filter></defs><ellipse cx="196" cy="218" rx="88" ry="9" fill="#7865db" opacity=".15" filter="url(#shadow)"/><circle cx="193" cy="124" r="107" stroke="#dcd6f6" stroke-dasharray="3 7"/><circle cx="193" cy="124" r="79" stroke="#e2ddf5"/><path d="M97 57c46-28 143-8 173 42s-3 91-64 102S76 181 80 139" stroke="#d2c9f3" stroke-width="1.5"/><path d="m191 38 70 27v55c0 45-28 71-70 93-42-22-70-48-70-93V65l70-27Z" fill="#5641b9" transform="translate(7 2)"/><path d="m191 35 70 27v55c0 45-28 71-70 93-42-22-70-48-70-93V62l70-27Z" fill="url(#shield-front)" stroke="#b5a5ff" stroke-width="1.5"/><path d="m191 58 52 20v40c0 32-19 54-52 73-33-19-52-41-52-73V78l52-20Z" fill="url(#shield-inner)" fill-opacity=".24" stroke="#c4b7ff" stroke-width="1.5"/><path d="m164 120 19 19 36-43" stroke="white" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="91" cy="73" r="7" fill="#b5a5f4"/><circle cx="279" cy="174" r="5" fill="#73cdb4"/><path d="M302 76v12m-6-6h12M112 203v9m-4.5-4.5h9" stroke="#c6b9f1" stroke-width="2" stroke-linecap="round"/></svg><div class="art-label art-label-one">${icon('lock', 14)} Private by design</div><div class="art-label art-label-two"><span></span>Clarity before you click</div></div>`;
  function heading(kicker, title, sub, action = '') {
    return `<div class="page-heading"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${sub}</p></div>${action}</div>`;
  }
  function scannerPage() {
    return `<section class="hero"><div class="hero-copy"><span class="hero-kicker"><span></span>YOUR IDENTITY IS WORTH A SECOND LOOK</span><h1>Pause. Check.<br><span>Stay you.</span></h1><p>A calmer way to spot suspicious messages and links.<br class="desktop-break"> Understand the signals before you take the next step.</p><div class="hero-steps"><span><b>01</b> Check the details</span><i></i><span><b>02</b> Understand the risk</span><i></i><span><b>03</b> Take control</span></div></div>${heroArt}</section>
      <div class="section-line"><div><h2>Your safety workspace</h2><p>One small check can make a big difference.</p></div><span class="quiet-badge">${icon('lock', 13)} No messages uploaded</span></div>
      <div class="workbench"><section class="card input-card"><div class="card-heading"><span class="feature-icon purple">${icon('scan', 21)}</span><div><h2>What looks suspicious?</h2><p>Let’s take a closer look together.</p></div></div>
      <div class="input-tabs" role="tablist" aria-label="Check type"><button role="tab" aria-selected="${state.tab === 'message'}" data-action="tab-message" class="${state.tab === 'message' ? 'selected' : ''}">${icon('mail', 16)} Message & link</button><button role="tab" aria-selected="${state.tab === 'link'}" data-action="tab-link" class="${state.tab === 'link' ? 'selected' : ''}">${icon('link', 16)} Link only</button></div>
      <form id="scan-form" novalidate><div class="form-body">${state.tab === 'message' ? `<div class="label-line"><label for="message-input">Message to check</label><span id="message-counter">${state.form.message.length.toLocaleString()} / 12,000</span></div><textarea id="message-input" name="message" class="message-textarea" maxlength="12000" placeholder="Paste a message, email or social DM that feels a little off…">${esc(state.form.message)}</textarea><div class="field-hint">Remove personal numbers and secrets before pasting.</div>` : `<div class="link-mode-note">${icon('globe', 20)}<p>Check the address before you visit.<span>We inspect the link text and never open the website.</span></p></div>`}
      <div class="${state.tab === 'message' ? 'two-fields' : 'stacked-fields'}"><div class="field"><label for="url-input">Link to check <span>${state.tab === 'message' ? '(optional)' : ''}</span></label><div class="input-wrap">${icon('link', 16)}<input id="url-input" name="url" type="text" maxlength="2048" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://example.com" value="${esc(state.form.url)}" aria-describedby="link-hint"></div></div><div class="field"><label for="expected-input">Expected domain <span>(optional)</span></label><div class="input-wrap">${icon('globe', 16)}<input id="expected-input" name="expected" maxlength="300" type="text" autocomplete="off" spellcheck="false" placeholder="e.g. linkedin.com" value="${esc(state.form.expected)}"></div></div></div><div class="field-hint" id="link-hint">${state.tab === 'message' ? 'Links in the message are checked automatically, up to five.' : 'Enter the official domain you expect for a direct comparison.'}</div>
      <div class="examples"><span>TRY AN EXAMPLE</span><div><button type="button" data-action="example-internship">Fake internship ${icon('arrow-right', 12)}</button><button type="button" data-action="example-otp">Urgent OTP ${icon('arrow-right', 12)}</button><button type="button" data-action="example-normal">Everyday message ${icon('arrow-right', 12)}</button></div></div>
      <p class="form-error" id="scan-error" role="alert" hidden></p><button type="submit" class="button primary full" id="scan-button">${icon('scan', 18)} Check for warning signs ${icon('arrow-right', 17)}</button><div class="under-button">${icon('lock', 12)} Private on your device <span>·</span> Transparent pattern checks</div></div></form></section>
      <section class="card result-card" id="scan-output" aria-live="polite">${state.result ? assessment(state.result, 'scanner') : emptyResult()}</section></div>
      <section class="tips-grid" aria-label="Everyday safety tips"><article class="tip-card"><span class="tip-icon mint">${icon('users', 20)}</span><div><h3>Check who’s asking</h3><p>A familiar name isn’t proof. Verify unexpected requests through a channel you trust.</p></div></article><article class="tip-card"><span class="tip-icon peach">${icon('key', 20)}</span><div><h3>Keep your secrets, yours</h3><p>Pause when a message asks you to share a password, PIN or one-time code.</p></div></article><article class="tip-card"><span class="tip-icon lavender">${icon('link', 20)}</span><div><h3>Read beyond the logo</h3><p>A convincing page can use a misleading address. Look at the actual domain.</p></div></article></section>`;
  }
  function emptyResult() {
    return `<div class="result-top"><h2>Your check, explained</h2><span class="neutral-status"><span></span>Ready when you are</span></div><div class="empty-result"><div class="empty-orbit"><span class="orbit-dot"></span><span class="empty-shield">${icon('shield', 47)}</span><span class="tiny-bubble">${icon('search', 17)}</span></div><h3>A little clarity goes<br>a long way.</h3><p>Add a message or link to see the<br>warning signs and your next steps.</p><div class="empty-checks"><span>${icon('check', 14)} Sender & identity clues</span><span>${icon('check', 14)} Sensitive information requests</span><span>${icon('check', 14)} Link & domain patterns</span></div></div><div class="result-bottom-note">${icon('info', 16)} Clear reasons. No unexplained safety scores.</div>`;
  }
  function assessment(result, source, saved = false) {
    const severityIcon = result.risk === 'low' ? 'search' : 'warning';
    const description = result.risk === 'high' ? 'Pause and verify independently before acting.' : result.risk === 'medium' ? 'A few details deserve a closer look.' : 'This check did not find the patterns it looks for.';
    return `<div class="result-top"><h2 id="result-heading" tabindex="-1">Your check, explained</h2><span class="completed-status">${icon('check', 12)} Check complete</span></div><div class="assessment-body"><div class="risk-summary ${esc(result.risk)}"><span class="risk-icon">${icon(severityIcon, 25)}</span><div><span class="risk-eyebrow">PATTERN-BASED ASSESSMENT</span><h3>${esc(result.label)}</h3><p>${description}</p></div></div><div class="signal-count"><span>${result.signals.length === 0 ? 'No matching warning patterns' : result.signals.length + ' warning ' + (result.signals.length === 1 ? 'signal' : 'signals') + ' found'}</span><span class="risk-meter ${esc(result.risk)}" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>
      ${result.domains?.length ? `<div class="domain-summary"><span>ACTUAL ${result.domains.length > 1 ? 'DESTINATIONS' : 'DESTINATION'}</span>${result.domains.map(d => `<code>${esc(d)}</code>`).join('')}<p>Read this hostname rather than the name shown in the message.</p></div>` : ''}
      <div class="signals">${result.signals.map((signal, i) => `<details class="signal" ${i < 3 ? 'open' : ''}><summary><span class="signal-dot ${signal.weight >= 4 ? 'strong' : ''}"></span><strong>${esc(signal.title)}</strong><span class="signal-chevron">${icon('chevron', 14)}</span></summary><div class="signal-detail"><p>${esc(signal.detail)}</p>${signal.evidence ? `<div class="evidence"><span>${esc(signal.source || 'Observed text')}</span><q>${esc(signal.evidence)}</q></div>` : ''}</div></details>`).join('')}</div>
      ${result.signals.length === 0 ? `<div class="no-signals"><span>${icon('info', 19)}</span><p>Missing warning signs do not establish safety. Verify unusual requests independently, especially before sharing identity or account information.</p></div>` : ''}
      <div class="checked-patterns"><span>CHECKED</span><div>${(result.checks || []).map(check => `<span>${icon('check', 12)} ${esc(check)}</span>`).join('')}</div></div>
      <div class="assessment-actions"><button class="button ${saved ? 'primary' : 'secondary'}" data-action="${saved ? 'export-saved' : 'save-result'}" data-source="${source}" ${saved ? `data-id="${esc(result.id)}"` : ''}>${icon(saved ? 'download' : result._saved ? 'check' : 'save', 16)} ${saved ? 'Download summary' : result._saved ? 'Summary saved' : 'Save summary'}</button>${!saved ? `<button class="icon-button bordered" data-action="export-result" data-source="${source}" aria-label="Download this check">${icon('download', 17)}</button>` : ''}<button class="button primary" data-action="response-from-result" data-source="${source}" ${saved ? `data-id="${esc(result.id)}"` : ''}>Next steps ${icon('arrow-right', 16)}</button></div><p class="assessment-limit">${esc(result.note)}</p></div>`;
  }
  function profileFields(kind, title, subtitle, badge) {
    const p = state.profiles[kind];
    return `<section class="card profile-card"><div class="profile-card-top"><span class="profile-avatar ${kind}">${icon(kind === 'trusted' ? 'users' : 'search', 24)}</span><div><h2>${title}</h2><p>${subtitle}</p></div><span class="profile-kind">${badge}</span></div><div class="two-fields"><div class="field"><label for="${kind}-name">Display name <span class="required-mark">*</span></label><input id="${kind}-name" name="${kind}.name" maxlength="150" placeholder="e.g. Aanya Rao" value="${esc(p.name)}" autocomplete="off"></div><div class="field"><label for="${kind}-handle">Username <span class="required-mark">*</span></label><input id="${kind}-handle" name="${kind}.handle" maxlength="150" placeholder="@username" value="${esc(p.handle)}" autocomplete="off" spellcheck="false"></div></div><div class="field"><label for="${kind}-bio">Public bio <span>(optional)</span></label><textarea id="${kind}-bio" name="${kind}.bio" maxlength="2500" rows="3" placeholder="Paste the public profile description…">${esc(p.bio)}</textarea></div><div class="field"><label for="${kind}-url">Profile link <span>(optional)</span></label><input id="${kind}-url" name="${kind}.url" maxlength="2048" placeholder="https://platform.com/username" inputmode="url" spellcheck="false" value="${esc(p.url)}" autocomplete="off"></div><div class="field"><label for="${kind}-email">Public contact email <span>(optional)</span></label><input id="${kind}-email" name="${kind}.email" maxlength="200" type="email" placeholder="name@example.com" value="${esc(p.email)}" autocomplete="off"></div></section>`;
  }
  function comparePage() {
    return `${heading('LOOK BEYOND THE PROFILE PICTURE', 'Same name. Same person?', 'Compare the details you trust with a profile you want to check.', `<button class="button secondary" data-action="example-profile">${icon('spark', 16)} Try a comparison</button>`)}<div class="info-banner">${icon('info', 18)}<p>Profile details can be copied. This tool highlights similarities and inconsistencies in what you supply; it cannot verify who owns an account.</p></div><form id="compare-form" novalidate><div class="profile-grid">${profileFields('trusted', 'The profile you trust', 'Use details you independently know.', 'REFERENCE')}${profileFields('suspect', 'The profile to check', 'Enter the details you want to compare.', 'TO CHECK')}</div><section class="card compare-context"><div class="field"><label for="profile-message">What did the account ask you to do? <span>(optional)</span></label><textarea id="profile-message" name="profile-message" maxlength="12000" rows="3" placeholder="Paste any suspicious request. Remove personal numbers and secrets first.">${esc(state.profiles.message)}</textarea></div><div class="compare-bottom"><span>${icon('lock', 14)} No profile data is fetched or uploaded.</span><button class="button primary" type="submit">${icon('users', 18)} Compare the details ${icon('arrow-right', 16)}</button></div><p class="form-error" id="compare-error" role="alert" hidden></p></section></form><section class="card comparison-result" id="compare-output" aria-live="polite">${state.profileResult ? assessment(state.profileResult, 'profile') : `<div class="comparison-empty"><span class="feature-icon purple">${icon('fingerprint', 25)}</span><div><h3>Identity is more than a matching name.</h3><p>Add the two profiles to see which details deserve a second look.</p></div><span class="quiet-badge">${icon('lock', 13)} Browser-local comparison</span></div>`}</section>`;
  }
  function responsePage() {
    const scenario = scenarios[state.scenario], checked = state.checked[state.scenario] || [];
    const complete = checked.filter(Boolean).length;
    return `${heading('TURN UNCERTAINTY INTO A NEXT STEP', 'You have a way forward.', 'Choose what happened. Work through a clear, practical response.', `<button class="button secondary" data-action="export-plan">${icon('download', 16)} Download plan</button>`)}${state.activeResult ? `<div class="result-context">${icon("file", 16)}<p>Your latest <strong>${state.activeResult.type === "profile" ? "profile comparison" : "message check"}</strong> will be included in the incident summary.</p><button class="text-link" data-action="remove-context">Remove</button></div>` : ""}<div class="scenario-picker" role="group" aria-label="What happened?">${Object.entries(scenarios).map(([key, item]) => `<button class="scenario-button ${state.scenario === key ? 'active' : ''}" data-action="scenario" data-scenario="${key}" aria-pressed="${state.scenario === key}">${icon(item.icon, 20)}<span>${item.name}</span>${state.scenario === key ? icon('check', 16) : ''}</button>`).join('')}</div><div class="response-grid"><section class="card checklist-card"><div class="checklist-heading"><div><span class="eyebrow">YOUR RESPONSE CHECKLIST</span><h2>${scenario.name}</h2><p>${scenario.description}</p></div><span class="progress-ring" style="--progress:${complete * 20}%"><b>${complete}/${scenario.steps.length}</b></span></div><div class="progress-track" role="progressbar" aria-label="Response steps completed" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${complete}"><span style="width:${complete * 20}%"></span></div><div class="checklist">${scenario.steps.map((step, i) => `<label class="checklist-item ${checked[i] ? 'done' : ''}"><input type="checkbox" data-step="${i}" ${checked[i] ? 'checked' : ''}><span class="custom-check">${icon('check', 14)}</span><span class="step-copy"><strong>${i + 1}. ${step[0]}</strong><span>${step[1]}</span></span></label>`).join('')}</div><div class="checklist-footer"><span>${icon('info', 15)} Checks mark your progress; actions are yours to complete.</span><button class="text-link" data-action="reset-plan">Reset</button></div></section><aside class="response-aside"><section class="card official-card"><div class="official-icon">${icon('globe', 23)}</div><span class="eyebrow">OFFICIAL CHANNELS · INDIA</span><h2>Make your report<br>in the right place.</h2><p>Keep the facts, dates and evidence together. Use official reporting channels.</p><a class="official-link" href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer"><span>National Cyber Crime<br>Reporting Portal<small>cybercrime.gov.in</small></span>${icon('external', 17)}</a><a class="official-link" href="https://cybercrime.gov.in/webform/cyber_suspect.aspx" target="_blank" rel="noopener noreferrer"><span>Report a suspect identifier<small>Suspicious links, numbers or profiles</small></span>${icon('external', 17)}</a><div class="official-footnote">IdentityShield does not submit reports on your behalf.</div></section><section class="card evidence-card"><span class="feature-icon mint">${icon('file', 20)}</span><h3>Keep the details together.</h3><p>Add notes for your downloadable incident summary. They stay in this session.</p><label class="sr-only" for="incident-note">Incident notes</label><textarea id="incident-note" name="incident-note" maxlength="6000" rows="4" placeholder="What happened, when, and which evidence you have…">${esc(state.note)}</textarea><button class="button secondary full" data-action="export-incident">${icon('download', 16)} Download incident summary</button></section></aside></div><div class="guidance-sources">Guidance informed by <a href="https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/phishing" target="_blank" rel="noopener noreferrer">NIST phishing guidance ${icon('external', 11)}</a> and <a href="https://cybercrime.gov.in/webform/FAQ.aspx" target="_blank" rel="noopener noreferrer">India’s cybercrime portal ${icon('external', 11)}</a>. Use each service’s official recovery process for account-specific help.</div>`;
  }
  function historyPage() {
    const list = state.history.filter(r => state.filter === 'all' || r.type === state.filter);
    return `${heading('YOUR CHECKS, AT YOUR PACE', 'A little perspective, saved.', 'Only summaries you choose to save appear here. Original messages are not stored.', state.history.length ? `<button class="button secondary danger-text" data-action="clear-history">${icon('trash', 16)} Clear saved checks</button>` : '')}<div class="history-toolbar"><div class="filter-tabs" role="group" aria-label="Filter saved checks">${[['all', 'All checks'], ['message', 'Messages & links'], ['profile', 'Profiles']].map(([type, label]) => `<button class="${state.filter === type ? 'active' : ''}" data-action="history-filter" data-filter="${type}" aria-pressed="${state.filter === type}">${label}</button>`).join('')}</div><span>${list.length} saved ${list.length === 1 ? 'check' : 'checks'}</span></div>${list.length ? `<div class="history-list">${list.map(r => `<article class="card history-item"><span class="feature-icon ${r.type === 'profile' ? 'mint' : 'purple'}">${icon(r.type === 'profile' ? 'users' : 'scan', 22)}</span><div class="history-item-main"><h2>${esc(r.title)}</h2><p>${esc(date(r.savedAt || r.timestamp))} <span>·</span> ${r.signals.length} warning ${r.signals.length === 1 ? 'signal' : 'signals'}</p></div><span class="risk-chip ${esc(r.risk)}">${icon(r.risk === 'low' ? 'search' : 'warning', 13)} ${esc(r.label)}</span><button class="button secondary small" data-action="view-saved" data-id="${esc(r.id)}">View check ${icon('arrow-right', 14)}</button><button class="icon-button" data-action="delete-saved" data-id="${esc(r.id)}" aria-label="Delete saved ${esc(r.title)}">${icon('trash', 16)}</button></article>`).join('')}</div>` : `<section class="card history-empty"><div class="empty-orbit"><span class="empty-shield">${icon('save', 43)}</span><span class="tiny-bubble">${icon('check', 15)}</span></div><h2>${state.history.length ? 'No checks in this view.' : 'Your next bit of clarity starts here.'}</h2><p>${state.history.length ? 'Choose another filter to see your saved summaries.' : 'Run a check and choose “Save summary” to keep the useful parts.<br>Your original message stays out of your saved history.'}</p><a class="button primary" href="#scanner">${icon('scan', 17)} Check a message ${icon('arrow-right', 16)}</a></section>`}<div class="history-privacy">${icon('lock', 17)}<p>Saved in this browser, on this device. Clearing browser data removes these summaries. ${storageAvailable ? '' : 'Storage is currently unavailable, so saved checks will last only for this session.'}</p></div>`;
  }
  function render() {
    state.route = Object.hasOwn(routes, location.hash.slice(1)) ? location.hash.slice(1) : 'scanner';
    $('#breadcrumb-current').textContent = routes[state.route];
    document.title = `${routes[state.route]} — IdentityShield`;
    document.querySelectorAll('[data-route]').forEach(el => { const active = el.dataset.route === state.route; el.classList.toggle('active', active); if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current'); });
    $('#main-content').innerHTML = ({ scanner: scannerPage, compare: comparePage, response: responsePage, history: historyPage })[state.route]();
    $('#history-count').textContent = state.history.length;
    hydrateIcons();
    closeMenu();
  }
  function toast(message) {
    const el = $('#toast'); el.innerHTML = icon('check', 17) + '<span>' + esc(message) + '</span>'; el.classList.add('visible');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 3400);
  }
  let modalFocus;
  function openModal(html) {
    modalFocus = document.activeElement;
    $('#modal-content').innerHTML = `<button class="modal-close icon-button" data-action="close-modal" aria-label="Close dialog">${icon('close', 20)}</button>${html}`;
    if (!$('#modal').open) $('#modal').showModal();
  }
  function closeModal() { $('#modal').close(); }
  function howModal() {
    openModal(`<span class="feature-icon purple">${icon('fingerprint', 26)}</span><span class="eyebrow modal-eyebrow">A CLEARER WAY TO CHECK</span><h2 id="modal-title">Your identity deserves<br>more than a guess.</h2><p class="modal-intro">IdentityShield helps you notice warning patterns, understand the reasons, and choose a practical next step.</p><div class="how-item"><span>01</span><div><h3>Transparent checks</h3><p>Rules look for sensitive requests, urgency, payment cues, link structure and mismatched domains. Profile checks compare supplied text. This version does not use an AI model, a live threat database, facial recognition or account verification.</p></div></div><div class="how-item"><span>02</span><div><h3>Your messages stay here</h3><p>Analysis runs in this browser. Links are never opened. Only when you choose “Save summary” are findings saved in this browser’s storage; original messages and profile inputs are excluded.</p></div></div><div class="how-item"><span>03</span><div><h3>Signals, with limits</h3><p>Legitimate requests may trigger warnings and harmful messages may be missed. A matching name or a clean-looking link does not establish authenticity. Verify independently before sharing information.</p></div></div><div class="modal-bottom"><span>${icon('lock', 15)} No analysis API calls. No hidden safety scores.</span><button class="button primary" data-action="close-modal">Got it ${icon('check', 16)}</button></div>`);
  }
  function reportText(result, includePlan = false, incident = false) {
    const lines = ['IDENTITYSHIELD', incident ? 'Personal incident summary' : includePlan ? 'Personal response plan' : 'Check summary', 'Generated: ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', timeZoneName: 'short' }), '', 'Assessment uses local pattern rules. It is not identity verification or a confirmed finding of fraud.', ''];
    if (result) {
      lines.push('CHECK: ' + result.title, 'Assessment: ' + result.label, 'Check time: ' + date(result.timestamp));
      if (result.domains?.length) lines.push('Observed hostnames: ' + result.domains.join(', '));
      lines.push('', 'OBSERVED SIGNALS');
      if (!result.signals.length) lines.push('No matching warning patterns found. This does not establish safety.');
      result.signals.forEach((s, i) => { lines.push(`${i + 1}. ${s.title}`, s.detail); if (s.evidence) lines.push('Supplied evidence: ' + s.evidence); lines.push(''); });
      lines.push(result.note, '');
    }
    if (includePlan) {
      const scenario = scenarios[state.scenario];
      lines.push('SELECTED SITUATION: ' + scenario.name, '', 'RESPONSE CHECKLIST');
      scenario.steps.forEach((step, i) => lines.push(`[${(state.checked[state.scenario] || [])[i] ? 'x' : ' '}] ${step[0]}`, step[1], ''));
      lines.push('Checklist status is marked by the user; IdentityShield does not perform these actions.', '');
    }
    if (incident) lines.push('USER NOTES (unverified)', state.note.trim() || 'No notes supplied.', '');
    lines.push('OFFICIAL RESOURCES', 'National Cyber Crime Reporting Portal: https://cybercrime.gov.in/', 'Report Suspect: https://cybercrime.gov.in/webform/cyber_suspect.aspx', 'NIST phishing guidance: https://www.nist.gov/itl/smallbusinesscyber/guidance-topic/phishing', '', 'IdentityShield does not submit complaints or contact anyone on your behalf.');
    return lines.join('\n');
  }
  function download(text, kind) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' }), url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'IdentityShield_' + kind + '_' + new Date().toISOString().slice(0, 10) + '.txt'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Your ' + kind.replace(/_/g, ' ') + ' has been downloaded.');
  }
  function persistHistory() {
    try { localStorage.setItem('identityshield.history.v1', JSON.stringify(state.history)); }
    catch (_) { storageAvailable = false; toast('Browser storage is unavailable. Summary kept for this session.'); }
    $('#history-count').textContent = state.history.length;
  }
  const currentResult = source => source === 'profile' ? state.profileResult : state.result;
  function setExample(type) {
    state.tab = 'message'; state.result = null;
    const examples = {
      internship: { message: 'Hi! I am a recruiter from LinkedIn. You have been selected for a paid internship. Upload your Aadhaar and pay a refundable registration fee of ₹499 within 30 minutes to confirm your place. Apply at https://linkedin-careers.example/verify', url: '', expected: 'linkedin.com' },
      otp: { message: 'URGENT: Your account will be suspended. Please share your OTP immediately to stop this. Verify at https://account-security.example/login', url: '', expected: '' },
      normal: { message: 'Hi Aanya, our study group is meeting at the library at 4 pm tomorrow. Bring your notes if you can. See you there!', url: '', expected: '' }
    };
    state.form = examples[type]; render(); toast('Fictional example loaded. Run the check to see its signals.'); $('#message-input')?.focus({ preventScroll: true });
  }
  function clearProfileResult() {
    if (!state.profileResult) return;
    state.profileResult = null;
    $('#compare-output').innerHTML = `<div class="comparison-empty"><span class="feature-icon purple">${icon('fingerprint', 25)}</span><div><h3>Details changed. Let’s take another look.</h3><p>Compare the updated profiles to get a new assessment.</p></div></div>`;
  }
  function closeMenu() { document.body.classList.remove('nav-open'); $('#menu-button').setAttribute('aria-expanded', 'false'); }
  document.addEventListener('input', event => {
    const el = event.target;
    if (['message', 'url', 'expected'].includes(el.name)) {
      state.form[el.name] = el.value;
      if (state.result) { state.result = null; $('#scan-output').innerHTML = emptyResult(); }
      if (el.name === 'message' && $('#message-counter')) $('#message-counter').textContent = el.value.length.toLocaleString() + ' / 12,000';
    } else if (/^(trusted|suspect)\./.test(el.name)) {
      const [kind, field] = el.name.split('.'); state.profiles[kind][field] = el.value;
      clearProfileResult();
    } else if (el.name === 'profile-message') { state.profiles.message = el.value; clearProfileResult(); }
    else if (el.name === 'incident-note') state.note = el.value;
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-step]')) {
      if (!state.checked[state.scenario]) state.checked[state.scenario] = [];
      const step = Number(event.target.dataset.step), wasChecked = event.target.checked;
      state.checked[state.scenario][step] = wasChecked;
      render();
      document.querySelector(`[data-step="${step}"]`)?.focus({ preventScroll: true });
      if (state.checked[state.scenario].filter(Boolean).length === 5) toast('All five steps marked complete. Keep your report references.');
    }
  });
  document.addEventListener('submit', event => {
    if (event.target.id === 'scan-form') {
      event.preventDefault();
      const button = $('#scan-button'); button.disabled = true; button.innerHTML = '<span class="spinner"></span> Checking patterns…';
      requestAnimationFrame(() => {
        try {
          state.result = E.analyzeMessage({ ...state.form, message: state.tab === 'link' ? '' : state.form.message }); state.activeResult = state.result;
          $('#scan-output').innerHTML = assessment(state.result, 'scanner'); $('#scan-error').hidden = true;
          $('#scan-output #result-heading').focus({ preventScroll: true });
          if (window.innerWidth < 900) $('#scan-output').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) { $('#scan-error').textContent = error.message; $('#scan-error').hidden = false; }
        finally { button.disabled = false; button.innerHTML = icon('scan', 18) + ' Check for warning signs ' + icon('arrow-right', 17); }
      });
    } else if (event.target.id === 'compare-form') {
      event.preventDefault();
      try {
        state.profileResult = E.analyzeProfiles(state.profiles); state.activeResult = state.profileResult;
        $('#compare-output').innerHTML = assessment(state.profileResult, 'profile'); $('#compare-error').hidden = true;
        $('#compare-output').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('#compare-output #result-heading').focus({ preventScroll: true });
      } catch (error) { $('#compare-error').textContent = error.message; $('#compare-error').hidden = false; }
    }
  });
  document.addEventListener('click', event => {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'how') howModal();
    else if (action === 'close-modal') closeModal();
    else if (action === 'tab-message' || action === 'tab-link') { state.tab = action === 'tab-link' ? 'link' : 'message'; state.result = null; render(); $(`[data-action="${action}"]`).focus({ preventScroll: true }); }
    else if (action.startsWith('example-') && action !== 'example-profile') setExample(action.replace('example-', ''));
    else if (action === 'example-profile') {
      state.profiles = { trusted: { name: 'Aanya Rao', handle: '@aanya.rao', bio: 'Data science student. Building things, learning every day. Hyderabad.', url: 'https://www.linkedin.com/in/aanya-rao-demo', email: 'aanya@example.com' }, suspect: { name: 'Aanya Rao', handle: '@aanya.ra0', bio: 'Data science student. Building things, learning every day. Hyderabad.', url: 'https://www.linkedin.com/in/aanya-ra0-demo', email: 'aanya-new@example.net' }, message: 'Hi, I need your help. Please send money urgently to my new UPI account. I will pay you back immediately.' };
      state.profileResult = null; render(); toast('Fictional profiles loaded for comparison.');
    } else if (action === 'save-result') {
      const result = currentResult(btn.dataset.source);
      if (!result || result._saved) { toast('This summary is already saved.'); return; }
      const saved = E.savedSummary(result); state.history.unshift(saved); state.history = state.history.slice(0, 50); result._saved = saved.id; persistHistory();
      btn.innerHTML = icon('check', 16) + ' Summary saved'; toast(storageAvailable ? 'Summary saved on this browser. Original inputs are not saved.' : 'Summary kept in this session. Browser storage is unavailable.');
    } else if (action === 'export-result') { const result = currentResult(btn.dataset.source); if (result) download(reportText(result), 'check_summary'); }
    else if (action === 'response-from-result') {
      const result = btn.dataset.id ? state.history.find(r => r.id === btn.dataset.id) : currentResult(btn.dataset.source);
      if (!result) return; state.activeResult = result; state.scenario = result.type === 'profile' ? 'impersonation' : 'message'; if ($('#modal').open) closeModal(); location.hash = 'response';
    } else if (action === 'scenario') { state.scenario = btn.dataset.scenario; render(); document.querySelector(`[data-scenario="${state.scenario}"]`)?.focus({ preventScroll: true }); }
    else if (action === 'remove-context') { state.activeResult = null; render(); toast('Previous check removed from the incident summary.'); }
    else if (action === 'reset-plan') { state.checked[state.scenario] = []; render(); toast('Checklist progress reset for this situation.'); }
    else if (action === 'export-plan') download(reportText(null, true), 'response_plan');
    else if (action === 'export-incident') download(reportText(state.activeResult, true, true), 'incident_summary');
    else if (action === 'history-filter') { state.filter = btn.dataset.filter; render(); document.querySelector(`[data-filter="${state.filter}"]`)?.focus({ preventScroll: true }); }
    else if (action === 'view-saved') { const result = state.history.find(r => r.id === btn.dataset.id); if (result) openModal(`<h2 id="modal-title" class="saved-modal-title">Saved check</h2>${assessment(result, 'saved', true)}`); }
    else if (action === 'export-saved') { const result = state.history.find(r => r.id === btn.dataset.id); if (result) download(reportText(result), 'saved_summary'); }
    else if (action === 'delete-saved') {
      state.history = state.history.filter(r => r.id !== btn.dataset.id); [state.result, state.profileResult].forEach(r => { if (r?._saved === btn.dataset.id) delete r._saved; }); persistHistory(); render(); toast('Saved summary removed.');
    } else if (action === 'clear-history') openModal(`<span class="feature-icon peach">${icon('trash', 23)}</span><h2 id="modal-title">Clear your saved checks?</h2><p class="modal-intro">This removes all ${state.history.length} saved summaries from this browser. Download any summaries you want to keep first.</p><div class="modal-bottom"><button class="button secondary" data-action="close-modal">Keep checks</button><button class="button danger" data-action="confirm-clear">Clear saved checks</button></div>`);
    else if (action === 'confirm-clear') { state.history = []; [state.result, state.profileResult].forEach(r => { if (r) delete r._saved; }); persistHistory(); closeModal(); render(); toast('Saved checks cleared from this browser.'); }
  });
  $('#menu-button').addEventListener('click', () => { const open = document.body.classList.toggle('nav-open'); $('#menu-button').setAttribute('aria-expanded', String(open)); });
  $('#mobile-overlay').addEventListener('click', closeMenu);
  $('#modal').addEventListener('click', e => { if (e.target === $('#modal')) closeModal(); });
  $('#modal').addEventListener('close', () => modalFocus?.focus?.({ preventScroll: true }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('hashchange', () => { render(); window.scrollTo({ top: 0, behavior: 'instant' }); $('#main-content').focus({ preventScroll: true }); });
  render();
})();
