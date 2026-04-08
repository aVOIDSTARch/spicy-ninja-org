'use strict';

// ─── Audio Engine ─────────────────────────────────────────────────────────────

var AudioEngine = (function () {
  var ctx = null;

  function init() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') { ctx.resume(); }
    return ctx;
  }

  // duration in seconds, time = offset from now in seconds
  function playNote(freq, time, duration, gain) {
    var c = init();
    var osc = c.createOscillator();
    var env = c.createGain();
    osc.connect(env);
    env.connect(c.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    var t = c.currentTime + time;
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(gain || 0.18, t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.08);
  }

  // notes: array of {freq, time, dur}
  function playSequence(notes, gain) {
    notes.forEach(function (n) {
      playNote(n.freq, n.time, n.dur, gain);
    });
  }

  return { playNote: playNote, playSequence: playSequence };
}());

// ─── Note Frequencies (equal temperament, A4 = 440 Hz) ───────────────────────

var F = {
  C3:  130.81, Cs3: 138.59, D3:  146.83, Eb3: 155.56, E3:  164.81,
  F3:  174.61, Fs3: 184.99, G3:  196.00, Gs3: 207.65, Ab3: 207.65,
  A3:  220.00, Bb3: 233.08, B3:  246.94,
  C4:  261.63, Cs4: 277.18, D4:  293.66, Eb4: 311.13, E4:  329.63,
  F4:  349.23, Fs4: 369.99, G4:  392.00, Gs4: 415.30, Ab4: 415.30,
  A4:  440.00, Bb4: 466.16, B4:  493.88,
  C5:  523.25, Cs5: 554.37, D5:  587.33, Eb5: 622.25, E5:  659.25,
  F5:  698.46, Fs5: 739.99, G5:  783.99, Gs5: 830.61, A5:  880.00
};

// ─── Motif Data ───────────────────────────────────────────────────────────────
// All note objects use {freq, time, dur} consistently.
// B-A-C-H: Bb3 - A3 - C4 - B3

var BACH_ORIGINAL = [
  { freq: F.Bb3, time: 0.00, dur: 0.50 },
  { freq: F.A3,  time: 0.58, dur: 0.50 },
  { freq: F.C4,  time: 1.16, dur: 0.50 },
  { freq: F.B3,  time: 1.74, dur: 0.85 }
];

// Inversion: each interval flipped. Bb stays as anchor.
// Bb -> B (up half) -> Bb -> A becomes Bb -> A (down half) -> Bb -> B
// Melodically: Bb3 B3 Gs3 A3
var BACH_INVERSION = [
  { freq: F.Bb3, time: 0.00, dur: 0.50 },
  { freq: F.B3,  time: 0.58, dur: 0.50 },
  { freq: F.Gs3, time: 1.16, dur: 0.50 },
  { freq: F.A3,  time: 1.74, dur: 0.85 }
];

// Retrograde: original pitches in reverse order
var BACH_RETROGRADE = [
  { freq: F.B3,  time: 0.00, dur: 0.50 },
  { freq: F.C4,  time: 0.58, dur: 0.50 },
  { freq: F.A3,  time: 1.16, dur: 0.50 },
  { freq: F.Bb3, time: 1.74, dur: 0.85 }
];

// Retrograde Inversion: inversion reversed
var BACH_RI = [
  { freq: F.A3,  time: 0.00, dur: 0.50 },
  { freq: F.Gs3, time: 0.58, dur: 0.50 },
  { freq: F.B3,  time: 1.16, dur: 0.50 },
  { freq: F.Bb3, time: 1.74, dur: 0.85 }
];

// Fugue subject (C minor flavour)
var FUGUE_SUBJECT = [
  { freq: F.C4,  time: 0.00, dur: 0.28 },
  { freq: F.B3,  time: 0.30, dur: 0.14 },
  { freq: F.C4,  time: 0.46, dur: 0.14 },
  { freq: F.D4,  time: 0.62, dur: 0.28 },
  { freq: F.Eb4, time: 0.92, dur: 0.28 },
  { freq: F.D4,  time: 1.22, dur: 0.14 },
  { freq: F.C4,  time: 1.38, dur: 0.14 },
  { freq: F.B3,  time: 1.54, dur: 0.55 }
];

// Answer: subject transposed up a perfect fifth (multiply freq by 3/2)
var FUGUE_ANSWER = FUGUE_SUBJECT.map(function (n) {
  return { freq: n.freq * 1.5, time: n.time + 2.3, dur: n.dur };
});

// Countersubject: descending scalar run against the answer
var COUNTERSUBJECT = [
  { freq: F.G4,  time: 2.30, dur: 0.14 },
  { freq: F.Fs4, time: 2.46, dur: 0.14 },
  { freq: F.F4,  time: 2.62, dur: 0.14 },
  { freq: F.E4,  time: 2.78, dur: 0.14 },
  { freq: F.D4,  time: 2.94, dur: 0.14 },
  { freq: F.C4,  time: 3.10, dur: 0.14 },
  { freq: F.B3,  time: 3.26, dur: 0.14 },
  { freq: F.A3,  time: 3.42, dur: 0.28 }
];

// Augmentation: double all durations and spacing
var FUGUE_AUGMENTED = FUGUE_SUBJECT.map(function (n) {
  return { freq: n.freq, time: n.time * 2, dur: n.dur * 2 };
});

// Stretto: second entry overlaps first (starts 1.2s in instead of waiting)
var FUGUE_STRETTO_2 = FUGUE_SUBJECT.map(function (n) {
  return { freq: n.freq * 1.5, time: n.time + 1.2, dur: n.dur };
});

// ─── Number Alphabet ──────────────────────────────────────────────────────────

function initNumberAlphabet() {
  var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  var letterValues = {};
  alphabet.forEach(function (l, i) { letterValues[l] = i + 1; });

  var examples = [
    { name: 'BACH',   value: 14 },
    { name: 'JSBACH', value: 41 },
    { name: 'CREDO',  value: 43 },
    { name: 'INRI',   value: 50 },
    { name: 'GOD',    value: 26 }
  ];

  // Build alphabet grid
  var grid = document.getElementById('alphabetGrid');
  alphabet.forEach(function (l) {
    var cell = document.createElement('div');
    cell.className = 'alpha-cell';
    cell.dataset.letter = l;

    var letterSpan = document.createElement('span');
    letterSpan.className = 'alpha-letter';
    letterSpan.textContent = l;

    var numSpan = document.createElement('span');
    numSpan.className = 'alpha-num';
    numSpan.textContent = letterValues[l];

    cell.appendChild(letterSpan);
    cell.appendChild(numSpan);
    grid.appendChild(cell);
  });

  // Build example chips
  var exRow = document.getElementById('examplesRow');
  examples.forEach(function (ex) {
    var chip = document.createElement('div');
    chip.className = 'example-chip';

    var nameSpan = document.createElement('span');
    nameSpan.className = 'ex-name';
    nameSpan.textContent = ex.name;

    var valSpan = document.createElement('span');
    valSpan.className = 'ex-val';
    valSpan.textContent = ex.value;

    chip.appendChild(nameSpan);
    chip.appendChild(valSpan);

    chip.addEventListener('click', function () {
      var inp = document.getElementById('gematriaInput');
      inp.value = ex.name;
      updateCalc(ex.name);
    });
    exRow.appendChild(chip);
  });

  function updateCalc(raw) {
    var letters = raw.toUpperCase().replace(/[^A-Z]/g, '').split('');
    var total = letters.reduce(function (s, l) { return s + (letterValues[l] || 0); }, 0);

    // Highlight cells
    document.querySelectorAll('.alpha-cell').forEach(function (cell) {
      cell.classList.toggle('active', letters.indexOf(cell.dataset.letter) !== -1);
    });

    var result = document.getElementById('calcResult');
    if (letters.length === 0) { result.innerHTML = ''; return; }

    var breakdown = document.createElement('div');
    breakdown.className = 'letter-breakdown';

    letters.forEach(function (l) {
      var chip = document.createElement('span');
      chip.className = 'letter-chip';
      chip.textContent = l;
      var sub = document.createElement('sub');
      sub.textContent = letterValues[l] || '?';
      chip.appendChild(sub);
      breakdown.appendChild(chip);
    });

    var eq = document.createElement('span');
    eq.className = 'equals';
    eq.textContent = '= ';
    var strong = document.createElement('strong');
    strong.textContent = total;
    eq.appendChild(strong);
    breakdown.appendChild(eq);

    result.innerHTML = '';
    result.appendChild(breakdown);
  }

  var inp = document.getElementById('gematriaInput');
  inp.addEventListener('input', function () { updateCalc(inp.value); });
  updateCalc(inp.value);

  document.getElementById('playBachMotif').addEventListener('click', function () {
    AudioEngine.playSequence(BACH_ORIGINAL);
  });
}

// ─── Fugue ────────────────────────────────────────────────────────────────────

function initFugue() {
  var trackIds = ['vt0', 'vt1', 'vt2', 'vt3'];

  function clearTracks() {
    trackIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.innerHTML = ''; }
    });
  }

  function addBlock(trackId, cssType, leftPct, widthPct, label) {
    var track = document.getElementById(trackId);
    if (!track) { return; }
    var div = document.createElement('div');
    div.className = 'note-block block-' + cssType;
    div.style.left = leftPct + '%';
    div.style.width = widthPct + '%';
    div.textContent = label;
    track.appendChild(div);
  }

  var phases = [
    {
      id:    'subject',
      label: 'Subject',
      desc:  "The opening statement — the fugue's DNA",
      render: function () {
        clearTracks();
        addBlock('vt3', 'subject', 0, 60, 'Subject');
      },
      audio: function () { AudioEngine.playSequence(FUGUE_SUBJECT); }
    },
    {
      id:    'answer',
      label: 'Answer',
      desc:  'Subject repeated at the fifth (tonal answer)',
      render: function () {
        clearTracks();
        addBlock('vt2', 'answer', 30, 55, 'Answer (P5 up)');
      },
      audio: function () { AudioEngine.playSequence(FUGUE_ANSWER); }
    },
    {
      id:    'both',
      label: 'Subject + Answer',
      desc:  'Both voices with countersubject — polyphony begins',
      render: function () {
        clearTracks();
        addBlock('vt3', 'subject',  0,  60, 'Subject');
        addBlock('vt2', 'answer',  30,  55, 'Answer');
        addBlock('vt1', 'counter', 28,  50, 'Countersubject');
      },
      audio: function () {
        var combined = FUGUE_SUBJECT.concat(FUGUE_ANSWER).concat(COUNTERSUBJECT);
        AudioEngine.playSequence(combined);
      }
    },
    {
      id:    'stretto',
      label: 'Stretto',
      desc:  'Subject overlaps itself — compression, urgency',
      render: function () {
        clearTracks();
        addBlock('vt3', 'subject',  0,  60, 'Entry 1');
        addBlock('vt2', 'answer',  18,  60, 'Entry 2 (overlaps)');
      },
      audio: function () {
        var combined = FUGUE_SUBJECT.concat(FUGUE_STRETTO_2);
        AudioEngine.playSequence(combined);
      }
    },
    {
      id:    'augment',
      label: 'Augmentation',
      desc:  'Same subject, double note lengths — gravity',
      render: function () {
        clearTracks();
        addBlock('vt0', 'augment', 0, 82, 'Subject x2 (augmented)');
      },
      audio: function () { AudioEngine.playSequence(FUGUE_AUGMENTED); }
    }
  ];

  var container = document.getElementById('phaseButtons');

  phases.forEach(function (phase) {
    var btn = document.createElement('button');
    btn.className = 'phase-btn';

    var labelSpan = document.createElement('span');
    labelSpan.className = 'phase-label';
    labelSpan.textContent = '\u25B6 ' + phase.label;

    var descSpan = document.createElement('span');
    descSpan.className = 'phase-desc';
    descSpan.textContent = phase.desc;

    btn.appendChild(labelSpan);
    btn.appendChild(descSpan);

    btn.addEventListener('click', function () {
      document.querySelectorAll('.phase-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      phase.render();
      phase.audio();
    });

    container.appendChild(btn);
  });
}

// ─── Counterpoint ─────────────────────────────────────────────────────────────

function initCounterpoint() {
  var notes = [
    { name: 'C',  freq: F.C4, semi: 0  },
    { name: 'D',  freq: F.D4, semi: 2  },
    { name: 'E',  freq: F.E4, semi: 4  },
    { name: 'F',  freq: F.F4, semi: 5  },
    { name: 'G',  freq: F.G4, semi: 7  },
    { name: 'A',  freq: F.A4, semi: 9  },
    { name: 'B',  freq: F.B4, semi: 11 },
    { name: "C'", freq: F.C5, semi: 12 }
  ];

  var intervals = {
    0:  { name: 'Unison',       type: 'perfect',   desc: 'No independence — identical pitch' },
    1:  { name: 'Minor 2nd',    type: 'dissonant',  desc: 'Maximum tension, requires resolution' },
    2:  { name: 'Major 2nd',    type: 'dissonant',  desc: 'Active, forward-pulling' },
    3:  { name: 'Minor 3rd',    type: 'imperfect',  desc: 'Stable but colored — dark warmth' },
    4:  { name: 'Major 3rd',    type: 'imperfect',  desc: 'Stable and bright' },
    5:  { name: 'Perfect 4th',  type: 'perfect',    desc: 'Consonant in Baroque, context-dependent' },
    6:  { name: 'Tritone',      type: 'dissonant',  desc: 'Diabolus in musica — the most unstable interval' },
    7:  { name: 'Perfect 5th',  type: 'perfect',    desc: 'Open, stable, the harmonic foundation' },
    8:  { name: 'Minor 6th',    type: 'imperfect',  desc: 'Warm, slightly searching' },
    9:  { name: 'Major 6th',    type: 'imperfect',  desc: 'Open and pleasing' },
    10: { name: 'Minor 7th',    type: 'dissonant',  desc: 'Unstable, dominant pull' },
    11: { name: 'Major 7th',    type: 'dissonant',  desc: 'High tension, yearning resolution' },
    12: { name: 'Octave',       type: 'perfect',    desc: 'Complete consonance, same pitch class' }
  };

  var lowerIdx = 0;
  var upperIdx = 4; // C + G = perfect 5th

  function buildButtons(containerId, getIdx, setIdx) {
    var container = document.getElementById(containerId);
    notes.forEach(function (note, i) {
      var btn = document.createElement('button');
      btn.className = 'note-btn' + (i === getIdx() ? ' active' : '');
      btn.textContent = note.name;
      btn.addEventListener('click', function () {
        setIdx(i);
        container.querySelectorAll('.note-btn').forEach(function (b, j) {
          b.classList.toggle('active', j === i);
        });
        updateDisplay();
      });
      container.appendChild(btn);
    });
  }

  function updateDisplay() {
    var semis = Math.abs(notes[upperIdx].semi - notes[lowerIdx].semi);
    var iv = intervals[semis] || intervals[12];

    var badge = document.getElementById('intervalBadge');
    badge.className = 'interval-badge ' + iv.type;
    document.getElementById('intervalName').textContent = iv.name;
    document.getElementById('intervalSemitones').textContent = semis + ' semitone' + (semis !== 1 ? 's' : '');
    document.getElementById('intervalType').textContent = iv.type;
    document.getElementById('intervalDesc').textContent = iv.desc;
  }

  buildButtons('lowerVoice', function () { return lowerIdx; }, function (i) { lowerIdx = i; });
  buildButtons('upperVoice', function () { return upperIdx; }, function (i) { upperIdx = i; });
  updateDisplay();

  document.getElementById('playHarmonic').addEventListener('click', function () {
    AudioEngine.playSequence([
      { freq: notes[lowerIdx].freq, time: 0, dur: 1.5 },
      { freq: notes[upperIdx].freq, time: 0, dur: 1.5 }
    ], 0.14);
  });

  document.getElementById('playMelodic').addEventListener('click', function () {
    AudioEngine.playSequence([
      { freq: notes[lowerIdx].freq, time: 0.00, dur: 0.65 },
      { freq: notes[upperIdx].freq, time: 0.75, dur: 0.65 }
    ]);
  });

  var rules = [
    { rule: '1. No parallel perfect intervals',       detail: 'Two voices moving in the same direction to a P1, P5, or P8 destroys independence. The voices merge perceptually.' },
    { rule: '2. No direct (hidden) parallels',         detail: 'Even arriving at a perfect interval by similar motion in outer voices erodes voice independence.' },
    { rule: '3. Contrary motion preferred',            detail: 'Voices moving in opposite directions create maximum independence — the goal of polyphony.' },
    { rule: '4. Dissonance requires resolution',       detail: 'You cannot leap to a dissonance. Arrive stepwise and resolve to consonance.' },
    { rule: '5. No voice crossing',                    detail: 'The soprano should not go below the alto. Voices maintain their spatial register.' },
    { rule: '6. Begin and end on perfect consonances', detail: 'Structural pillars must be stable. Interior tension resolves to opening and closing stability.' }
  ];

  var rulesEl = document.getElementById('rulesList');
  rules.forEach(function (r) {
    var div = document.createElement('div');
    div.className = 'rule-row';

    var strong = document.createElement('strong');
    strong.textContent = r.rule;

    var span = document.createElement('span');
    span.textContent = r.detail;

    div.appendChild(strong);
    div.appendChild(span);
    rulesEl.appendChild(div);
  });
}

// ─── Transformations ──────────────────────────────────────────────────────────

function initTransformations() {
  var transforms = [
    {
      id:     'original',
      label:  'Original (P)',
      color:  '#D4AF37',
      desc:   'The subject as stated',
      pitches: ['Bb', 'A', 'C', 'B'],
      notes:  BACH_ORIGINAL
    },
    {
      id:     'inversion',
      label:  'Inversion (I)',
      color:  '#8B5CF6',
      desc:   'Every interval flipped: ascending becomes descending by the same distance',
      pitches: ['Bb', 'B', 'G#', 'A'],
      notes:  BACH_INVERSION
    },
    {
      id:     'retrograde',
      label:  'Retrograde (R)',
      color:  '#ef4444',
      desc:   'The subject played backwards in pitch sequence',
      pitches: ['B', 'C', 'A', 'Bb'],
      notes:  BACH_RETROGRADE
    },
    {
      id:     'ri',
      label:  'Retrograde Inversion (RI)',
      color:  '#22C55E',
      desc:   'Inverted AND backwards simultaneously',
      pitches: ['A', 'G#', 'B', 'Bb'],
      notes:  BACH_RI
    }
  ];

  var grid = document.getElementById('transformGrid');

  function updateMotif(t) {
    var cells = document.getElementById('motifCells');
    cells.innerHTML = '';
    t.pitches.forEach(function (p, i) {
      var cell = document.createElement('div');
      cell.className = 'motif-cell';

      var pitch = document.createElement('div');
      pitch.className = 'motif-pitch';
      pitch.style.color = t.color;
      pitch.textContent = p;

      var pos = document.createElement('div');
      pos.className = 'motif-pos';
      pos.textContent = i + 1;

      cell.appendChild(pitch);
      cell.appendChild(pos);
      cells.appendChild(cell);
    });
    document.getElementById('motifCaption').textContent = t.label + ' — ' + t.desc;
  }

  transforms.forEach(function (t) {
    var card = document.createElement('button');
    card.className = 'transform-card' + (t.id === 'original' ? ' active' : '');

    var labelSpan = document.createElement('span');
    labelSpan.className = 'transform-label';
    labelSpan.style.color = t.color;
    labelSpan.textContent = t.label;

    var descSpan = document.createElement('span');
    descSpan.className = 'transform-desc';
    descSpan.textContent = t.desc;

    var playSpan = document.createElement('span');
    playSpan.className = 'play-indicator';
    playSpan.textContent = '\u25B6 play';

    card.appendChild(labelSpan);
    card.appendChild(descSpan);
    card.appendChild(playSpan);

    card.addEventListener('click', function () {
      document.querySelectorAll('.transform-card').forEach(function (c) {
        c.classList.remove('active');
      });
      card.classList.add('active');
      updateMotif(t);
      AudioEngine.playSequence(t.notes);
    });

    grid.appendChild(card);
  });

  // Initialise display with original
  updateMotif(transforms[0]);
}

// ─── Golden Ratio ─────────────────────────────────────────────────────────────

function initGoldenRatio() {
  var fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
  var fibContainer = document.getElementById('fibCells');

  fibs.forEach(function (n, i) {
    var cell = document.createElement('div');
    cell.className = 'fib-cell';

    var numSpan = document.createElement('span');
    numSpan.className = 'fib-num';
    numSpan.textContent = n;
    cell.appendChild(numSpan);

    if (i > 0) {
      var ratioSpan = document.createElement('span');
      ratioSpan.className = 'fib-ratio';
      ratioSpan.textContent = (n / fibs[i - 1]).toFixed(3);
      cell.appendChild(ratioSpan);
    }

    fibContainer.appendChild(cell);
  });

  var works = [
    {
      title:  'Well-Tempered Clavier, Book I — Prelude No. 1 in C (BWV 846)',
      total:  35,
      phiBar: 21,
      note:   '21 bars in, a held pedal point appears and the harmonic rhythm shifts. 21/35 = 0.600, close to 1/phi = 0.618.'
    },
    {
      title:  'Art of Fugue — Contrapunctus I (BWV 1080)',
      total:  78,
      phiBar: 48,
      note:   'Central harmonic climax and textural shift around bar 48. 48/78 = 0.615, approximately 1/phi.'
    },
    {
      title:  'St. Matthew Passion — structural division',
      total:  78,
      phiBar: 29,
      note:   'The aria Erbarme Dich — the emotional apex of the first half — falls near its golden section.'
    }
  ];

  var worksEl = document.getElementById('workProportions');
  works.forEach(function (w) {
    var pct = ((w.phiBar / w.total) * 100).toFixed(1);

    var wrapper = document.createElement('div');
    wrapper.className = 'work-proportion';

    var title = document.createElement('div');
    title.className = 'work-title';
    title.textContent = w.title;

    var bar = document.createElement('div');
    bar.className = 'proportion-bar';

    var fill = document.createElement('div');
    fill.className = 'proportion-fill';
    fill.style.width = pct + '%';
    var fillLabel = document.createElement('span');
    fillLabel.className = 'bar-label';
    fillLabel.textContent = 'bar ' + w.phiBar;
    fill.appendChild(fillLabel);

    var remaining = document.createElement('div');
    remaining.className = 'proportion-remaining';
    var remLabel = document.createElement('span');
    remLabel.className = 'bar-label';
    remLabel.textContent = '/ ' + w.total;
    remaining.appendChild(remLabel);

    bar.appendChild(fill);
    bar.appendChild(remaining);

    var note = document.createElement('p');
    note.className = 'proportion-note';
    note.textContent = w.note;

    wrapper.appendChild(title);
    wrapper.appendChild(bar);
    wrapper.appendChild(note);
    worksEl.appendChild(wrapper);
  });
}

// ─── Analysis Exercises ───────────────────────────────────────────────────────

function initAnalysis() {
  var exercises = [
    {
      title:      'WTC Book I, Prelude No. 1 in C Major (BWV 846)',
      difficulty: 'Entry',
      skills:     ['harmonic rhythm', 'texture', 'golden ratio'],
      task:       '(1) Count the total bars. (2) Identify the bar where a held bass note appears and the texture changes significantly. Calculate whether this falls near total x 0.618. (3) Map the harmonic sequence — how many distinct chords? Notice the ratio of stable to unstable harmonies.',
      hear:       'Pure harmonic voice leading without melody. Bach is revealing the skeleton.',
      concepts:   ['golden-ratio', 'counterpoint'],
      link:       'https://www.youtube.com/results?search_query=Bach+WTC+Prelude+1+C+Major'
    },
    {
      title:      'Invention No. 1 in C Major (BWV 772)',
      difficulty: 'Entry',
      skills:     ['imitation', 'subject/answer', 'sequence'],
      task:       '(1) Identify the opening 4-note subject. (2) When does the second voice enter and at what interval below the first? (3) Find three instances where the subject appears in inversion. (4) Locate the sequence — a pattern that repeats at a different pitch level each time.',
      hear:       'Two voices in constant dialogue. Neither is melody, neither is accompaniment. They are equals.',
      concepts:   ['fugue', 'transformations'],
      link:       'https://www.youtube.com/results?search_query=Bach+Invention+1+C+Major'
    },
    {
      title:      'Fugue in C Minor, WTC Book I (BWV 847)',
      difficulty: 'Intermediate',
      skills:     ['fugue subject', 'answer at P5', 'stretto', 'episode'],
      task:       '(1) Identify the fugue subject (first 4 bars of voice 1). Write it in pitch names. (2) Count all full subject entries in the piece. (3) Identify an episode — a passage where the subject is absent and sequences develop. (4) Find the stretto: where do two entries overlap? How many beats?',
      hear:       'The architecture from the Fugue section made audible. You are reading the blueprint now.',
      concepts:   ['fugue', 'transformations'],
      link:       'https://www.youtube.com/results?search_query=Bach+WTC+Fugue+C+minor+BWV+847'
    },
    {
      title:      'Crab Canon from Musical Offering (BWV 1079)',
      difficulty: 'Advanced',
      skills:     ['palindrome', 'retrograde identity', 'group structure'],
      task:       '(1) Listen once forward. (2) This piece plays identically backwards — verify: note where and how the midpoint arrives. (3) Identify the subject in both voices simultaneously. (4) Map whether the lower voice at bar N is the retrograde of the upper voice at bar (total minus N).',
      hear:       'A piece that inhabits time in both directions simultaneously. The mathematical object made sonic.',
      concepts:   ['transformations'],
      link:       'https://www.youtube.com/results?search_query=Bach+Musical+Offering+Crab+Canon'
    }
  ];

  var container = document.getElementById('exercisesList');

  exercises.forEach(function (ex) {
    var card = document.createElement('div');
    card.className = 'exercise-card';

    // Header button
    var header = document.createElement('button');
    header.className = 'exercise-header';

    var meta = document.createElement('div');
    meta.className = 'ex-meta';

    var badge = document.createElement('span');
    badge.className = 'difficulty-badge ' + ex.difficulty.toLowerCase();
    badge.textContent = ex.difficulty;

    var titleSpan = document.createElement('span');
    titleSpan.className = 'ex-title';
    titleSpan.textContent = ex.title;

    meta.appendChild(badge);
    meta.appendChild(titleSpan);

    var arrow = document.createElement('span');
    arrow.className = 'ex-arrow';
    arrow.textContent = '\u25BC';

    header.appendChild(meta);
    header.appendChild(arrow);

    // Body
    var body = document.createElement('div');
    body.className = 'exercise-body';
    body.style.display = 'none';

    // Skills
    var skillsDiv = document.createElement('div');
    skillsDiv.className = 'ex-skills';
    ex.skills.forEach(function (s) {
      var tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = s;
      skillsDiv.appendChild(tag);
    });
    body.appendChild(skillsDiv);

    // Task section
    function addSection(labelText, contentText) {
      var section = document.createElement('div');
      section.className = 'ex-section';
      var strong = document.createElement('strong');
      strong.textContent = labelText;
      var p = document.createElement('p');
      p.textContent = contentText;
      section.appendChild(strong);
      section.appendChild(p);
      body.appendChild(section);
    }

    addSection('Your task', ex.task);
    addSection('What to listen for first', ex.hear);

    // Concepts
    var conceptSection = document.createElement('div');
    conceptSection.className = 'ex-section';
    var conceptLabel = document.createElement('strong');
    conceptLabel.textContent = 'Concepts exercised';
    var conceptTags = document.createElement('div');
    conceptTags.className = 'concept-tags';
    ex.concepts.forEach(function (c) {
      var tag = document.createElement('span');
      tag.className = 'concept-tag';
      tag.textContent = c;
      conceptTags.appendChild(tag);
    });
    conceptSection.appendChild(conceptLabel);
    conceptSection.appendChild(conceptTags);
    body.appendChild(conceptSection);

    // YouTube link
    var link = document.createElement('a');
    link.className = 'find-link';
    link.href = ex.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = '\u2192 Find on YouTube';
    body.appendChild(link);

    card.appendChild(header);
    card.appendChild(body);

    // Toggle
    header.addEventListener('click', function () {
      var isOpen = body.style.display !== 'none';
      body.style.display = isOpen ? 'none' : 'block';
      arrow.textContent = isOpen ? '\u25BC' : '\u25B2';
      card.classList.toggle('open', !isOpen);
    });

    container.appendChild(card);
  });
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function initNav() {
  var navItems = document.querySelectorAll('.nav-item');
  var sections  = document.querySelectorAll('section[id]');

  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var target = document.getElementById(item.dataset.target);
      if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  document.querySelectorAll('.module-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var target = document.getElementById(chip.dataset.target);
      if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navItems.forEach(function (item) {
          item.classList.toggle('active', item.dataset.target === id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(function (s) { observer.observe(s); });
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  initNav();
  initNumberAlphabet();
  initFugue();
  initCounterpoint();
  initTransformations();
  initGoldenRatio();
  initAnalysis();
});
