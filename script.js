/* ================================================================
   SharkRank AI — script.js
   Self-contained: shark SVG renderer, Ludo wheel, bubbles,
   marquee, scoring engine, report renderer, confetti
   Works as a fully static GitHub Pages deploy — no backend needed.
   ================================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. SHARK SVG  (eye on head, tail on left)
  ───────────────────────────────────────── */
  function sharkSVG(main, dark, px) {
    px = px || 40;
    var h = Math.round(px * 0.62);
    // viewBox 200×124: tail at left, nose+eye+smile at right
    return '<svg viewBox="0 0 200 124" width="' + px + '" height="' + h + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      /* tail top */
      '<path d="M40,60 C22,44 8,32 2,12 C26,20 42,34 52,50 Z" fill="' + dark + '"/>' +
      /* tail bottom */
      '<path d="M40,64 C22,80 8,92 2,112 C26,104 42,90 52,74 Z" fill="' + dark + '"/>' +
      /* pectoral fin */
      '<path d="M92,80 C86,96 76,108 60,114 C70,96 80,84 88,76 Z" fill="' + dark + '"/>' +
      /* body */
      '<path d="M44,62 C46,30 86,10 132,10 C158,10 178,24 194,54 C197,59 197,65 194,70 C178,100 158,114 132,114 C86,114 46,94 44,62 Z" fill="' + main + '"/>' +
      /* belly */
      '<path d="M56,70 C64,90 86,102 114,104 C94,94 74,80 64,64 Z" fill="rgba(255,255,255,0.28)"/>' +
      /* dorsal fin */
      '<path d="M106,31 C108,8 126,-4 140,-5 C132,12 122,22 114,31 Z" fill="' + dark + '" transform="translate(0,14)"/>' +
      /* gills */
      '<g stroke="' + dark + '" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.65">' +
      '<path d="M148,38 C146,47 146,55 148,64"/>' +
      '<path d="M158,36 C156,46 156,56 158,66"/>' +
      '</g>' +
      /* EYE — near the snout (right side), NOT the tail */
      '<circle cx="172" cy="38" r="9.5" fill="white"/>' +
      '<circle cx="175" cy="38" r="5.2" fill="#0F172A"/>' +
      '<circle cx="177" cy="35" r="1.7" fill="white"/>' +
      /* smile */
      '<path d="M180,57 Q188,65 196,58" stroke="#0F172A" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '</svg>';
  }

  function paintSharkIcons(root) {
    var els = (root || document).querySelectorAll('.shark-ico');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var main = el.dataset.color || '#06B6D4';
      var dark = el.dataset.dark  || '#0891B2';
      var size = parseInt(el.dataset.size, 10) || 40;
      el.innerHTML = sharkSVG(main, dark, size);
    }
  }

  /* ─────────────────────────────────────────
     2. BUBBLES
  ───────────────────────────────────────── */
  function addBubbles(id, n) {
    var host = document.getElementById(id);
    if (!host) return;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < n; i++) {
      var s = 8 + Math.random() * 32;
      var b = document.createElement('span');
      b.className = 'bubble';
      b.style.cssText =
        'left:' + (Math.random() * 100) + '%;' +
        'bottom:-' + s + 'px;' +
        'width:' + s + 'px;height:' + s + 'px;' +
        'animation-delay:' + (Math.random() * 10) + 's;' +
        'animation-duration:' + (10 + Math.random() * 12) + 's;';
      frag.appendChild(b);
    }
    host.appendChild(frag);
  }

  /* ─────────────────────────────────────────
     3. MARQUEE
  ───────────────────────────────────────── */
  function buildMarquee() {
    var host = document.getElementById('marqueeInner');
    if (!host) return;
    var items = [
      { text: 'PITCH.',                    color: '#06B6D4' },
      { text: '✦',                         color: '#CBD5E1' },
      { text: 'GET INSIGHTS.',             color: '#FB7185' },
      { text: '✦',                         color: '#CBD5E1' },
      { text: 'CREATE WITH CONFIDENCE.',  color: '#F59E0B' },
      { text: '✦',                         color: '#CBD5E1' },
      { text: 'KNOW BEFORE YOU CREATE.',  color: '#D946EF' },
      { text: '✦',                         color: '#CBD5E1' },
    ];
    function buildRow() {
      var sp = document.createElement('span');
      items.forEach(function(it) {
        var w = document.createElement('span');
        w.style.color = it.color;
        w.textContent = it.text;
        sp.appendChild(w);
      });
      return sp;
    }
    host.appendChild(buildRow());
    host.appendChild(buildRow()); // duplicate for seamless loop
  }

  /* ─────────────────────────────────────────
     4. LUDO WHEEL
  ───────────────────────────────────────── */
  var QUADS = [
    { pos: 'q-tl', name: 'Growth Shark',    sharkMain: '#fff', sharkDark: '#dcfce7' },
    { pos: 'q-tr', name: 'Audience Shark',  sharkMain: '#fff', sharkDark: '#fecdd3' },
    { pos: 'q-br', name: 'Marketing Shark', sharkMain: '#fff', sharkDark: '#fed7aa' },
    { pos: 'q-bl', name: 'Money Shark',     sharkMain: '#fff', sharkDark: '#fef08a' }
  ];

  function buildQuadsHTML(sharkSize) {
    sharkSize = sharkSize || 46;
    return QUADS.map(function(q) {
      return '<div class="ludo-q ' + q.pos + '">' +
        '<div class="q-inner">' +
          '<div class="wiggle"><span class="shark-ico" data-color="' + q.sharkMain + '" data-dark="' + q.sharkDark + '" data-size="' + sharkSize + '"></span></div>' +
          '<div class="q-label">' + q.name + '</div>' +
        '</div></div>';
    }).join('');
  }

  function buildCenterHTML(state) {
    if (state.mode === 'loading') {
      return '<div class="wc-dots"><span></span><span></span><span></span><span></span></div>' +
             '<div class="wc-deliberating">Deliberating…</div>';
    }
    if (state.mode === 'result') {
      return '<div class="wc-label">SharkRank</div>' +
             '<div class="wc-score" data-score>' + (state.score || 0) + '</div>' +
             '<div class="wc-of">/ 100</div>' +
             (state.verdict ? '<div class="wc-verdict">' + state.verdict + '</div>' : '');
    }
    // placeholder
    return '<div class="wc-label">SharkRank</div><div class="wc-score">--</div><div class="wc-of">/ 100</div>';
  }

  function buildOrbitHTML() {
    var colors = ['#06B6D4','#FB7185','#FBBF24','#A855F7'];
    var darks  = ['#a5f3fc','#fecdd3','#fef08a','#e9d5ff'];
    var html = '<div class="orbit-layer">';
    [0, 90, 180, 270].forEach(function(deg, i) {
      var dur = (10 + i * 2) + 's';
      html +=
        '<div class="orbit-item" style="transform:rotate(' + deg + 'deg) translateY(-12rem);transform-origin:0 0;animation:spin ' + dur + ' linear infinite">' +
          '<div class="wiggle" style="transform:rotate(' + (-deg) + 'deg)">' +
            '<span class="shark-ico" data-color="' + colors[i] + '" data-dark="' + darks[i] + '" data-size="26"></span>' +
          '</div>' +
        '</div>';
    });
    return html + '</div>';
  }

  function renderWheel(hostId, state, opts) {
    var host = document.getElementById(hostId);
    if (!host) return;
    opts = opts || {};
    var small = opts.small ? ' sm' : '';
    var qs = opts.small ? 36 : 46;

    var html = '<div class="wheel-wrap">';
    if (opts.halo) {
      html += '<div class="wheel-halo" style="width:calc(100% + 5rem);height:calc(100% + 5rem);top:-2.5rem;left:-2.5rem;"></div>';
    }
    html +=
      '<div class="ludo-wheel' + small + '">' +
        buildQuadsHTML(qs) +
        '<div class="wheel-center">' + buildCenterHTML(state) + '</div>' +
      '</div>';
    if (opts.orbit) html += buildOrbitHTML();
    html += '</div>';

    host.innerHTML = html;
    paintSharkIcons(host);
  }

  function animScore(hostId, target, ms) {
    var host = document.getElementById(hostId);
    if (!host) return;
    var el = host.querySelector('[data-score]');
    if (!el) return;
    var t0 = performance.now();
    function step(now) {
      var t = Math.min(1, (now - t0) / ms);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ─────────────────────────────────────────
     5. SEEDED RNG (deterministic per pitch)
  ───────────────────────────────────────── */
  function mkRng(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function() {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function sample(rng, arr, n) {
    var pool = arr.slice(), out = [];
    for (var i = 0; i < n && pool.length; i++) {
      var j = Math.floor(rng() * pool.length);
      out.push(pool.splice(j, 1)[0]);
    }
    return out;
  }

  /* ─────────────────────────────────────────
     6. SCORING ENGINE
  ───────────────────────────────────────── */
  function analyse(pitch) {
    var idea = (pitch.content_idea || '').toLowerCase();
    var hooks = ['myth','secret','never','mistake','truth','hack','challenge','series','vs',
                 'before','after','why','how','reveal','worst','best','stop','only'];
    var hookCount = hooks.reduce(function(n, w) { return n + (idea.indexOf(w) > -1 ? 1 : 0); }, 0);
    var hasSeries = /series|episode|part\s*\d|daily|weekly|every/.test(idea);
    var hasNum    = /\d/.test(idea);
    var platBonus = { YouTube:6, Instagram:7, TikTok:9, Podcast:2, Blog:0, LinkedIn:1, 'Twitter / X':5 }[pitch.platform] || 3;
    var fmtBonus  = { 'Short-form video':6, Reel:7, Carousel:3, Live:4, Vlog:2, Tutorial:4,
                      Podcast:2, Article:0, 'Long-form video':3 }[pitch.content_format] || 2;
    var nicheLen  = clamp((pitch.niche            || '').split(/\s+/).filter(Boolean).length * 3, 0, 15);
    var audLen    = clamp((pitch.target_audience  || '').split(/\s+/).filter(Boolean).length * 3, 0, 15);
    var ideaLen   = clamp(Math.round(idea.split(/\s+/).filter(Boolean).length / 3), 0, 15);
    return { hookCount:hookCount, hasSeries:hasSeries, hasNum:hasNum,
             platBonus:platBonus, fmtBonus:fmtBonus, nicheLen:nicheLen, audLen:audLen, ideaLen:ideaLen };
  }

  function scoreShark(key, sig, rng) {
    var base = 46 + Math.round(rng() * 14);
    var bonus = Math.round((rng() - 0.5) * 10);
    if (key === 'growth')    base += sig.hookCount * 4 + sig.platBonus + sig.fmtBonus + (sig.hasSeries ? 7 : 0) + sig.ideaLen;
    if (key === 'audience')  base += sig.nicheLen + sig.audLen + sig.ideaLen;
    if (key === 'marketing') base += sig.hookCount * 3 + sig.fmtBonus + (sig.hasNum ? 5 : 0) + sig.ideaLen;
    if (key === 'money')     base += sig.platBonus + (sig.hasSeries ? 8 : 0) + Math.round(sig.nicheLen / 2);
    return clamp(base + bonus, 28, 98);
  }

  var VERDICTS = ['Viral Goldmine','Strong Contender','Promising','Needs Sharpening','Pass'];
  function verdictOf(s) {
    if (s >= 84) return VERDICTS[0];
    if (s >= 70) return VERDICTS[1];
    if (s >= 55) return VERDICTS[2];
    if (s >= 40) return VERDICTS[3];
    return VERDICTS[4];
  }

  function buildSharkVerdict(key, name, pitch, sig, rng) {
    var sc = scoreShark(key, sig, rng);
    var idea = pitch.content_idea.length > 60 ? pitch.content_idea.slice(0,60)+'…' : pitch.content_idea;
    var niche = pitch.niche || 'your niche';
    var aud   = pitch.target_audience || 'your audience';
    var plat  = pitch.platform;
    var fmt   = (pitch.content_format || '').toLowerCase();

    var BANK = {
      growth: {
        headlines: [
          'Strong scroll-stopping potential on ' + plat + ' — the hook is there.',
          'Scalable concept. Series-first framing is the key move here.',
          'Solid bones, but the first 3 seconds need a sharper pull.',
          'The premise has real legs — map out 5 episodes before filming ep 1.'
        ],
        insights: [
          '"' + idea + '" has a clear, repeatable format — that is gold for the ' + plat + ' algorithm.',
          (fmt.charAt(0).toUpperCase() + fmt.slice(1)) + ' content in this style earns strong early watch-time on ' + plat + '.',
          sig.hookCount ? 'You already have hook vocabulary — front-load it even harder.' : 'There is no obvious hook yet — the idea reads as a description, not a pull.',
          sig.hasSeries ? 'Series framing is the right call — it compounds episode over episode.' : 'Turn this into a numbered series so each piece compounds the last.',
          'Avoid starting with context — start with the payoff statement.'
        ],
        recs: [
          'Write 3 title options and pick the one a stranger clicks cold.',
          'Open with the punchiest claim, then explain.',
          'Plan episodes 1-5 before filming anything.',
          'Add a 2-second pattern interrupt at the very start.'
        ]
      },
      audience: {
        headlines: [
          niche + ' has real, hungry demand right now.',
          'Audience-fit is strong. The persona just needs sharper naming.',
          'Engagement potential is high if the hook delivers on the promise.',
          'This will resonate deeply with ' + aud + ' — trust that and get specific.'
        ],
        insights: [
          'Your target (' + aud + ') responds to specific, concrete promises, not general advice.',
          '"' + niche + '" is a defensible space — distinct enough to own, large enough to grow.',
          sig.audLen > 6 ? 'You described this audience with real precision — rare and valuable.' : 'The audience description is a bit broad — a sharper persona boosts relatability.',
          'Comment-bait built in (a take people agree or disagree with) will lift saves and shares.'
        ],
        recs: [
          'Name the exact persona in the first line of your hook.',
          'End with a question only ' + aud + ' would have an opinion on.',
          'Reference a shared pain point of ' + aud + ' within 5 seconds.',
          'Study top 3 comments on similar ' + niche + ' content before filming.'
        ]
      },
      marketing: {
        headlines: [
          'Title and thumbnail strategy will make or break this one.',
          'Marketing angle is brand-collab ready with the right framing.',
          'Great positioning for ' + plat + ' — fits its native style.',
          'Needs a punchier title — the idea is stronger than the pitch.'
        ],
        insights: [
          sig.hasNum ? 'A specific number in the title/thumbnail will meaningfully lift CTR.' : 'Adding a number (count, time, or stat) to the title will boost click-through.',
          'On ' + plat + ', the first frame matters more than the caption — design around the core promise.',
          fmt.indexOf('video') > -1 ? 'Keep the thumbnail to one clear emotion and one clear promise.' : 'Lead line = one promise only. Stacking two ideas kills click-through.',
          'This format has natural brand-collab potential once a few episodes prove the concept.'
        ],
        recs: [
          'Make the thumbnail/cover answer "what do I get?" in under 1 second.',
          'Try a contrarian framing if the niche allows — it travels further.',
          'Repurpose the strongest line as a short-form teaser on other platforms.',
          'A/B test 2 thumbnail ideas before committing.'
        ]
      },
      money: {
        headlines: [
          'Clear monetization path once the audience is warm.',
          'Affiliate and sponsor angles are realistic here — plan early.',
          'Revenue potential is solid. This niche has healthy CPMs.',
          'The money follows the series — one-offs are hard to sell to sponsors.'
        ],
        insights: [
          'Consistent ' + niche + ' content naturally attracts relevant affiliate offers.',
          sig.hasSeries ? 'A series is exactly what sponsors look for — repeat placements, not one-offs.' : 'A series format unlocks sponsor economics that a single post never will.',
          plat === 'YouTube' || plat === 'Podcast' ? 'Long-form platforms have stronger mid-roll/sponsor economics.' : plat + ' favours native-feeling integrations over hard pitches.',
          'A simple digital product (template, checklist) fits this niche well at 5k+ followers.'
        ],
        recs: [
          'Pick one affiliate or sponsor category to mention naturally once you have 5+ episodes.',
          'Track which moments get saved — that is where sponsor reads belong.',
          'Build an email list from episode 1, not episode 10.',
          'Price a small digital product around the core promise once trust is built.'
        ]
      }
    };

    var b = BANK[key];
    var headline = pick(rng, b.headlines);
    var insights = sample(rng, b.insights, 3);
    var recs     = sample(rng, b.recs, 3);

    return { shark: name, score: sc, headline: headline, insights: insights, recommendations: recs };
  }

  function generateReport(pitch) {
    var seed = JSON.stringify(pitch) + '|' + Date.now();
    var rng  = mkRng(seed);
    var sig  = analyse(pitch);

    var sharks = [
      buildSharkVerdict('growth',    'Growth Shark',    pitch, sig, rng),
      buildSharkVerdict('audience',  'Audience Shark',  pitch, sig, rng),
      buildSharkVerdict('marketing', 'Marketing Shark', pitch, sig, rng),
      buildSharkVerdict('money',     'Money Shark',     pitch, sig, rng)
    ];
    var overall = Math.round(sharks.reduce(function(s,x){return s+x.score;},0) / 4);
    var verdict = verdictOf(overall);

    var niche = pitch.niche || 'this niche';
    var aud   = pitch.target_audience || 'this audience';
    var plat  = pitch.platform;

    var growthBank = [
      'If you nail the first 3 seconds, this concept has real legs on ' + plat + ' — expect a steady climb across 3–5 episodes rather than one big spike.',
      'This grows best as a series. One episode tests the waters; episodes 3–5 are where the algorithm starts pushing.',
      'Growth depends more on the hook than the topic here — the topic is strong, the opening line needs to match it.',
      'The format signals are right for ' + plat + '. Execute the first 3 consistently and you will start seeing compounding reach.'
    ];
    var audBank = [
      'Your target (' + aud + ') responds well to ' + niche + ' content when the value is upfront, not buried in a long intro.',
      aud + ' tends to save and revisit this kind of content rather than just watching once — design for re-watch value.',
      'Expect strong comment activity if the content takes a clear, slightly opinionated stance.',
      'This audience is underserved in ' + niche + ' — specificity is your moat against larger creators.'
    ];
    var moneyBank = [
      'Affiliate and sponsorship angles are realistic once this crosses early growth thresholds in ' + niche + '.',
      'Sponsor fit improves significantly once this becomes a recognizable series rather than a single post.',
      'A small digital product tied to ' + niche + ' is a natural next step once the audience trusts the format.',
      'RPM in this niche is healthy on ' + plat + ' — stay consistent for 90 days and ad revenue alone is viable.'
    ];
    var anglesBank = [
      'Lead with a bold, slightly contrarian claim instead of a neutral setup.',
      'Open with a 3-second pattern interrupt before introducing the topic.',
      'Frame as a numbered series ("Part 1 of 5") instead of a one-off.',
      'Use a real before/after or comparison to make the value visible immediately.',
      'Borrow a format your audience already loves and apply it to this idea.',
      'Add a "do not do this" angle — negative framing outperforms positive in most niches.'
    ];
    var improvBank = [
      'Tighten the hook — say the payoff in the first line, not the third.',
      'Add a clear, specific payoff within the first 8 seconds.',
      'Put a concrete number or stat in the title and thumbnail.',
      'Plan episodes 1–5 before filming the first one.',
      'Cut anything that does not directly serve ' + aud + '.',
      'End with one clear call-to-action — not three.'
    ];

    return {
      pitch: pitch,
      overall_score: overall,
      verdict_tag: verdict,
      growth_forecast: pick(rng, growthBank),
      audience_insights: pick(rng, audBank),
      monetization_opportunities: pick(rng, moneyBank),
      stronger_angles: sample(rng, anglesBank, 3),
      improvement_suggestions: sample(rng, improvBank, 4),
      sharks: sharks
    };
  }

  /* ─────────────────────────────────────────
     7. REPORT RENDERER
  ───────────────────────────────────────── */
  var SHARK_META = {
    'Growth Shark':    { color:'#84CC16', dark:'#65A30D', bg:'linear-gradient(160deg,#ECFCCB,#ECFDF5)', icon:'i-trending' },
    'Audience Shark':  { color:'#FB7185', dark:'#E11D48', bg:'linear-gradient(160deg,#FFE4E6,#FDF2F8)', icon:'i-users' },
    'Marketing Shark': { color:'#F97316', dark:'#C2410C', bg:'linear-gradient(160deg,#FFEDD5,#FFFBEB)', icon:'i-megaphone' },
    'Money Shark':     { color:'#FBBF24', dark:'#D97706', bg:'linear-gradient(160deg,#FEF3C7,#FEFCE8)', icon:'i-coins' }
  };
  var VERDICT_GRAD = {
    'Viral Goldmine':   'linear-gradient(135deg,#FDE047,#FDBA74,#F472B6)',
    'Strong Contender': 'linear-gradient(135deg,#67E8F9,#60A5FA)',
    'Promising':        'linear-gradient(135deg,#6EE7B7,#22D3EE)',
    'Needs Sharpening': 'linear-gradient(135deg,#FDBA74,#FB7185)',
    'Pass':             'linear-gradient(135deg,#CBD5E1,#64748B)'
  };

  function renderReport(report) {
    var body = document.getElementById('reportBody');
    if (!body) return;

    var grad = VERDICT_GRAD[report.verdict_tag] || VERDICT_GRAD['Promising'];

    var srcCards = report.sharks.map(function(s) {
      var m = SHARK_META[s.shark] || SHARK_META['Growth Shark'];
      return (
        '<div class="src-card" style="background:' + m.bg + '">' +
          '<div class="src-top">' +
            '<div class="src-left">' +
              '<div class="src-chip" style="background:' + m.color + '"><svg class="icn"><use href="#' + m.icon + '"/></svg></div>' +
              '<div class="src-name">' + s.shark + '</div>' +
            '</div>' +
            '<div class="src-score">' + s.score + '<span>/100</span></div>' +
          '</div>' +
          '<div class="src-headline">' + s.headline + '</div>' +
          '<ul class="src-insights">' + s.insights.slice(0,3).map(function(i){ return '<li>• ' + i + '</li>'; }).join('') + '</ul>' +
        '</div>'
      );
    }).join('');

    body.innerHTML =
      '<div class="report-wheel-col">' +
        '<div id="reportWheel"></div>' +
        '<button class="reset-btn" id="resetBtn">Pitch Another Idea <svg class="icn"><use href="#i-arrow-right"/></svg></button>' +
      '</div>' +
      '<div class="report-stack">' +
        '<div class="verdict-card" style="background:' + grad + '">' +
          '<div class="vc-label">Verdict</div>' +
          '<div class="vc-tag">' + report.verdict_tag + '</div>' +
          '<p><strong>Growth Forecast:</strong> ' + report.growth_forecast + '</p>' +
        '</div>' +
        infoCard('#FB7185','i-users','Audience Insights', '<p>' + report.audience_insights + '</p>') +
        infoCard('#FBBF24','i-coins','Monetization Opportunities', '<p>' + report.monetization_opportunities + '</p>') +
        '<div class="two-col">' +
          listCard('#06B6D4','i-sparkles','Stronger Angles', report.stronger_angles) +
          listCard('#A855F7','i-target','Improvement Plan', report.improvement_suggestions) +
        '</div>' +
        '<div class="shark-results">' + srcCards + '</div>' +
      '</div>';

    renderWheel('reportWheel', { mode:'result', score:0, verdict:report.verdict_tag }, { small:true });
    paintSharkIcons(body);
    animScore('reportWheel', report.overall_score, 1300);

    document.getElementById('resetBtn').addEventListener('click', function() {
      document.getElementById('reportSection').hidden = true;
      renderWheel('dashWheel', { mode:'placeholder' });
      document.getElementById('wheelHint').textContent = 'Your SharkRank score will appear here once the panel decides.';
      document.getElementById('pitch').scrollIntoView({ behavior:'smooth' });
    });
  }

  function infoCard(color, icon, title, content) {
    return '<div class="info-card lift">' +
      '<div class="ic-head"><div class="chip" style="--bg:' + color + '"><svg class="icn"><use href="#' + icon + '"/></svg></div><h4>' + title + '</h4></div>' +
      content + '</div>';
  }
  function listCard(color, icon, title, items) {
    var lis = (items||[]).map(function(it){ return '<li><span class="li-arrow">›</span><span>' + it + '</span></li>'; }).join('');
    return infoCard(color, icon, title, '<ul>' + lis + '</ul>');
  }

  /* ─────────────────────────────────────────
     8. CONFETTI
  ───────────────────────────────────────── */
  function confetti() {
    var cols = ['#06B6D4','#FB7185','#FBBF24','#84CC16','#A855F7','#F97316'];
    for (var i = 0; i < 65; i++) {
      var el = document.createElement('div');
      el.className = 'confetti';
      var sz = 6 + Math.random() * 7;
      el.style.cssText =
        'left:'   + (Math.random()*100) + 'vw;' +
        'width:'  + sz + 'px;height:' + (sz*.4) + 'px;' +
        'background:' + cols[Math.floor(Math.random()*cols.length)] + ';' +
        'animation-duration:' + (2.2 + Math.random()*1.6) + 's;' +
        'animation-delay:'    + (Math.random()*.4) + 's;';
      document.body.appendChild(el);
      setTimeout((function(e){ return function(){ e.remove(); }; })(el), 5000);
    }
  }

  /* ─────────────────────────────────────────
     9. FORM
  ───────────────────────────────────────── */
  function initForm() {
    var form  = document.getElementById('pitchForm');
    var errEl = document.getElementById('formErr');
    var btn   = document.getElementById('pitchSubmitBtn');
    var lbl   = document.getElementById('submitLabel');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var idea = document.getElementById('ideaInput').value.trim();
      if (idea.length < 10) {
        errEl.textContent = 'Tell the Sharks a bit more about your idea (at least 10 characters).';
        errEl.hidden = false; return;
      }
      errEl.hidden = true;

      var pitch = {
        content_idea:     idea,
        platform:         document.getElementById('platformSel').value,
        content_format:   document.getElementById('formatSel').value,
        niche:            document.getElementById('nicheInput').value.trim(),
        target_audience:  document.getElementById('audienceInput').value.trim()
      };

      btn.disabled = true;
      lbl.innerHTML = 'Sharks deliberating… <svg class="icn"><use href="#i-hourglass"/></svg>';
      renderWheel('dashWheel', { mode:'loading' });
      document.getElementById('wheelHint').textContent = 'The sharks are circling… Growth · Audience · Marketing · Money';

      setTimeout(function() {
        var report = generateReport(pitch);

        renderWheel('dashWheel', { mode:'result', score:report.overall_score, verdict:report.verdict_tag });
        document.getElementById('wheelHint').textContent = 'Verdict locked in. Scroll down for the full report ↓';

        btn.disabled = false;
        lbl.innerHTML = 'Face the Sharks <svg class="icn"><use href="#i-zap"/></svg>';

        var sec = document.getElementById('reportSection');
        sec.hidden = false;
        renderReport(report);
        confetti();

        setTimeout(function() {
          document.getElementById('reportAnchor').scrollIntoView({ behavior:'smooth', block:'start' });
        }, 200);
      }, 1800);
    });
  }

  /* ─────────────────────────────────────────
     10. NAV
  ───────────────────────────────────────── */
  function initNav() {
    var burger = document.getElementById('navBurger');
    var nav    = document.getElementById('mainNav');
    if (burger && nav) {
      burger.addEventListener('click', function() { nav.classList.toggle('open'); });
      nav.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() { nav.classList.remove('open'); });
      });
    }
    function goToPitch() { document.getElementById('pitch').scrollIntoView({ behavior:'smooth' }); }
    var nc = document.getElementById('navPitchBtn');
    var hc = document.getElementById('heroPitchBtn');
    if (nc) nc.addEventListener('click', goToPitch);
    if (hc) hc.addEventListener('click', goToPitch);
  }

  /* ─────────────────────────────────────────
     11. BOOT
  ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    // Paint all static shark icons
    paintSharkIcons();

    // Bubbles
    addBubbles('heroBubbles', 16);
    addBubbles('howBubbles', 9);
    addBubbles('teamBubbles', 9);

    // Marquee
    buildMarquee();

    // Nav
    initNav();

    // Form
    initForm();

    // Hero wheel (showing a demo 87 score + orbit)
    renderWheel('heroWheel', { mode:'result', score:87, verdict:'Viral Goldmine' }, { halo:true, orbit:true });

    // Dashboard placeholder wheel
    renderWheel('dashWheel', { mode:'placeholder' });

    // Footer year
    var fy = document.getElementById('footerYear');
    if (fy) fy.textContent = '© ' + new Date().getFullYear() + ' SharkRank AI';
  });

})();