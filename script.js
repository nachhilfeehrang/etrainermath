function getRandomInt(min, max) {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x || 1;
}

function clearFeedback(element) {
  element.textContent = '';
  element.classList.remove('success', 'error');
}

function setFeedback(element, message, type) {
  element.textContent = message;
  element.classList.remove('success', 'error');
  if (type === 'success') {
    element.classList.add('success');
  } else if (type === 'error') {
    element.classList.add('error');
  }
}

function updateScoreDisplay(scoreElement, state) {
  if (state.attempts === 0) {
    scoreElement.textContent = 'Noch keine Versuche.';
  } else {
    scoreElement.textContent = `Richtige Lösungen: ${state.correct} von ${state.attempts}`;
  }
}

function initTrainer() {
  const extendTaskEl = document.getElementById('extend-task');
  const extendFactorEl = document.getElementById('extend-factor');
  const extendNumInput = document.getElementById('extend-numerator');
  const extendDenInput = document.getElementById('extend-denominator');
  const extendFeedback = document.getElementById('extend-feedback');
  const extendScore = document.getElementById('extend-score');
  const extendCheckBtn = document.getElementById('extend-check');
  const extendNewBtn = document.getElementById('extend-new');

  const reduceTaskEl = document.getElementById('reduce-task');
  const reduceNumInput = document.getElementById('reduce-numerator');
  const reduceDenInput = document.getElementById('reduce-denominator');
  const reduceFeedback = document.getElementById('reduce-feedback');
  const reduceScore = document.getElementById('reduce-score');
  const reduceCheckBtn = document.getElementById('reduce-check');
  const reduceNewBtn = document.getElementById('reduce-new');

  const timesTaskEl = document.getElementById('times-task');
  const timesAnswerInput = document.getElementById('times-answer');
  const timesFeedback = document.getElementById('times-feedback');
  const timesScore = document.getElementById('times-score');
  const timesCheckBtn = document.getElementById('times-check');
  const timesNewBtn = document.getElementById('times-new');

  if (
    !extendTaskEl ||
    !extendNumInput ||
    !extendDenInput ||
    !extendFeedback ||
    !extendScore ||
    !extendCheckBtn ||
    !extendNewBtn ||
    !reduceTaskEl ||
    !reduceNumInput ||
    !reduceDenInput ||
    !reduceFeedback ||
    !reduceScore ||
    !reduceCheckBtn ||
    !reduceNewBtn ||
    !timesTaskEl ||
    !timesAnswerInput ||
    !timesFeedback ||
    !timesScore ||
    !timesCheckBtn ||
    !timesNewBtn
  ) {
    return;
  }

  const state = {
    extend: { current: null, attempts: 0, correct: 0 },
    reduce: { current: null, attempts: 0, correct: 0 },
    times: { current: null, attempts: 0, correct: 0 },
  };

  function generateExtendTask() {
    const numerator = getRandomInt(1, 12);
    const denominator = getRandomInt(2, 12);
    const factor = getRandomInt(2, 9);
    return { numerator, denominator, factor };
  }

  function renderExtendTask() {
    state.extend.current = generateExtendTask();
    const { numerator, denominator, factor } = state.extend.current;
    extendTaskEl.textContent = `Erweitere ${numerator}/${denominator} um Faktor ${factor}`;
    if (extendFactorEl) {
      extendFactorEl.textContent = `Faktor: ${factor}`;
    }
    extendNumInput.value = '';
    extendDenInput.value = '';
    clearFeedback(extendFeedback);
    extendNumInput.focus();
  }

  function checkExtendAnswer() {
    if (!state.extend.current) return;
    const userNum = Number.parseInt(extendNumInput.value, 10);
    const userDen = Number.parseInt(extendDenInput.value, 10);

    if (!Number.isInteger(userNum) || !Number.isInteger(userDen)) {
      setFeedback(
        extendFeedback,
        'Bitte gib ganze Zahlen für Zähler und Nenner ein.',
        'error'
      );
      return;
    }

    if (userDen === 0) {
      setFeedback(extendFeedback, 'Der Nenner darf nicht 0 sein.', 'error');
      return;
    }

    state.extend.attempts += 1;

    const { numerator, denominator, factor } = state.extend.current;
    const expectedNum = numerator * factor;
    const expectedDen = denominator * factor;

    if (userNum === expectedNum && userDen === expectedDen) {
      state.extend.correct += 1;
      setFeedback(extendFeedback, 'Super! Der Bruch wurde richtig erweitert.', 'success');
    } else {
      setFeedback(
        extendFeedback,
        `Fast! Richtig wäre ${expectedNum}/${expectedDen}. Versuche es noch einmal.`,
        'error'
      );
    }

    updateScoreDisplay(extendScore, state.extend);
  }

  function generateReduceTask() {
    let baseNumerator = getRandomInt(1, 12);
    let baseDenominator = getRandomInt(2, 12);
    const baseGcd = gcd(baseNumerator, baseDenominator);
    baseNumerator /= baseGcd;
    baseDenominator /= baseGcd;
    const factor = getRandomInt(2, 9);

    return {
      numerator: baseNumerator * factor,
      denominator: baseDenominator * factor,
      simplifiedNumerator: baseNumerator,
      simplifiedDenominator: baseDenominator,
    };
  }

  function renderReduceTask() {
    state.reduce.current = generateReduceTask();
    const { numerator, denominator } = state.reduce.current;
    reduceTaskEl.textContent = `Kürze ${numerator}/${denominator}`;
    reduceNumInput.value = '';
    reduceDenInput.value = '';
    clearFeedback(reduceFeedback);
    reduceNumInput.focus();
  }

  function checkReduceAnswer() {
    if (!state.reduce.current) return;
    const userNum = Number.parseInt(reduceNumInput.value, 10);
    const userDen = Number.parseInt(reduceDenInput.value, 10);

    if (!Number.isInteger(userNum) || !Number.isInteger(userDen)) {
      setFeedback(
        reduceFeedback,
        'Bitte gib ganze Zahlen für Zähler und Nenner ein.',
        'error'
      );
      return;
    }

    if (userDen === 0) {
      setFeedback(reduceFeedback, 'Der Nenner darf nicht 0 sein.', 'error');
      return;
    }

    state.reduce.attempts += 1;

    const { numerator, denominator, simplifiedNumerator, simplifiedDenominator } =
      state.reduce.current;

    const isEquivalent = userNum * denominator === userDen * numerator;
    const userGcd = gcd(userNum, userDen);

    if (!isEquivalent) {
      setFeedback(
        reduceFeedback,
        `Das ist nicht der gleiche Bruch. Überprüfe deine Rechnung noch einmal.`,
        'error'
      );
    } else if (userGcd !== 1) {
      setFeedback(
        reduceFeedback,
        'Dein Ergebnis lässt sich noch weiter kürzen. Kürze vollständig.',
        'error'
      );
    } else if (
      userNum === simplifiedNumerator &&
      userDen === simplifiedDenominator
    ) {
      state.reduce.correct += 1;
      setFeedback(reduceFeedback, 'Sehr gut! Der Bruch ist vollständig gekürzt.', 'success');
    } else {
      state.reduce.correct += 1;
      setFeedback(
        reduceFeedback,
        `Richtig! ${simplifiedNumerator}/${simplifiedDenominator} ist vollständig gekürzt.`,
        'success'
      );
    }

    updateScoreDisplay(reduceScore, state.reduce);
  }

  function generateTimesTask() {
    const a = getRandomInt(6, 20);
    const b = getRandomInt(6, 20);
    return { a, b };
  }

  function renderTimesTask() {
    state.times.current = generateTimesTask();
    const { a, b } = state.times.current;
    timesTaskEl.textContent = `${a} × ${b} = ?`;
    timesAnswerInput.value = '';
    clearFeedback(timesFeedback);
    timesAnswerInput.focus();
  }

  function checkTimesAnswer() {
    if (!state.times.current) return;
    const userAnswer = Number.parseInt(timesAnswerInput.value, 10);

    if (!Number.isInteger(userAnswer)) {
      setFeedback(timesFeedback, 'Bitte gib eine ganze Zahl als Ergebnis ein.', 'error');
      return;
    }

    state.times.attempts += 1;
    const { a, b } = state.times.current;
    const expected = a * b;

    if (userAnswer === expected) {
      state.times.correct += 1;
      setFeedback(timesFeedback, 'Klasse! Das Ergebnis stimmt.', 'success');
    } else {
      setFeedback(timesFeedback, `Nicht ganz. Richtig ist ${expected}.`, 'error');
    }

    updateScoreDisplay(timesScore, state.times);
  }

  extendCheckBtn.addEventListener('click', checkExtendAnswer);
  extendNewBtn.addEventListener('click', renderExtendTask);
  extendNumInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkExtendAnswer();
    }
  });
  extendDenInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkExtendAnswer();
    }
  });

  reduceCheckBtn.addEventListener('click', checkReduceAnswer);
  reduceNewBtn.addEventListener('click', renderReduceTask);
  reduceNumInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkReduceAnswer();
    }
  });
  reduceDenInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkReduceAnswer();
    }
  });

  timesCheckBtn.addEventListener('click', checkTimesAnswer);
  timesNewBtn.addEventListener('click', renderTimesTask);
  timesAnswerInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkTimesAnswer();
    }
  });

  renderExtendTask();
  renderReduceTask();
  renderTimesTask();
  updateScoreDisplay(extendScore, state.extend);
  updateScoreDisplay(reduceScore, state.reduce);
  updateScoreDisplay(timesScore, state.times);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTrainer);
} else {
  initTrainer();
}
