
"use strict";

/*
 * KFCValues — original political values test
 *
 * Answer values:
 * Strongly disagree = -2
 * Disagree          = -1
 * Neutral / unsure  =  0
 * Agree             = +1
 * Strongly agree    = +2
 *
 * Each question has one axis and a polarity (+1 or -1).
 * Contribution = answer value * question polarity.
 *
 * Axis score = average contribution for answered questions on that axis.
 *
 * Ideology similarity =
 * 100 * (1 - mean absolute distance / 4)
 *
 * Scores describe similarity to these illustrative profiles,
 * not an objective or scientific classification.
 */

const ANSWER_OPTIONS = [
  { label: "Strongly disagree", value: -2 },
  { label: "Disagree", value: -1 },
  { label: "Neutral / unsure", value: 0 },
  { label: "Agree", value: 1 },
  { label: "Strongly agree", value: 2 }
];

const AXES = {
  economy: {
    name: "Economic organization",
    low: "Public ownership and redistribution",
    high: "Markets and private ownership",
    description: "Economic planning, ownership, redistribution, and market coordination."
  },
  authority: {
    name: "Government authority",
    low: "Decentralized power",
    high: "Centralized authority",
    description: "How political power should be distributed between central institutions and local communities."
  },
  liberty: {
    name: "Individual liberty",
    low: "Collective restrictions",
    high: "Personal autonomy",
    description: "The balance between individual choice, collective rules, and public safety."
  },
  culture: {
    name: "Social and cultural change",
    low: "Preserve established traditions",
    high: "Support social change",
    description: "How society should approach cultural continuity and changing social norms."
  },
  nation: {
    name: "International outlook",
    low: "National sovereignty",
    high: "International cooperation",
    description: "The balance between national independence and international institutions."
  }
};

const IDEOLOGIES = [
  {
    id: "social-democracy",
    name: "Social Democracy",
    description: "Supports a market economy combined with extensive public services, social protections, and efforts to reduce economic inequality.",
    profile: { economy: -1, authority: 0, liberty: 1, culture: 1, nation: 1 }
  },
  {
    id: "liberalism",
    name: "Liberalism",
    description: "Emphasizes individual rights, constitutional government, civil liberties, and political pluralism. Economic views vary across liberal traditions.",
    profile: { economy: 1, authority: -1, liberty: 2, culture: 1, nation: 1 }
  },
  {
    id: "libertarianism",
    name: "Libertarianism",
    description: "Prioritizes individual freedom, voluntary exchange, private property in many versions, and limits on coercive government power.",
    profile: { economy: 2, authority: -2, liberty: 2, culture: 0, nation: 0 }
  },
  {
    id: "democratic-socialism",
    name: "Democratic Socialism",
    description: "Seeks democratic control over important economic institutions and greater economic equality through democratic political processes.",
    profile: { economy: -2, authority: -1, liberty: 1, culture: 1, nation: 0 }
  },
  {
    id: "conservatism",
    name: "Conservatism",
    description: "Often emphasizes continuity, established institutions, social traditions, and gradual rather than rapid change. Economic and state-power views vary.",
    profile: { economy: 1, authority: 1, liberty: 0, culture: -2, nation: -1 }
  },
  {
    id: "communitarianism",
    name: "Communitarianism",
    description: "Emphasizes shared responsibilities, community relationships, social cohesion, and the role of common values in public life.",
    profile: { economy: -1, authority: 1, liberty: -1, culture: -1, nation: 0 }
  },
  {
    id: "green-politics",
    name: "Green Politics",
    description: "Prioritizes ecological sustainability, environmental protection, long-term collective welfare, and often participatory forms of democracy.",
    profile: { economy: -1, authority: -1, liberty: 1, culture: 1, nation: 2 }
  },
  {
    id: "national-conservatism",
    name: "National Conservatism",
    description: "Emphasizes national sovereignty, cultural continuity, and national institutions. Economic positions differ between its variants.",
    profile: { economy: 0, authority: 2, liberty: -1, culture: -2, nation: -2 }
  }
];

const QUESTIONS = [
  // Root: answers choose one of four branches.
  {
    id: "Q01",
    axis: "authority",
    polarity: 1,
    category: "Political structure",
    text: "A strong central government is generally necessary to solve a country's biggest problems.",
    nextByAnswer: ["Q02", "Q05", "Q08", "Q11", "Q11"]
  },

  // Branch A: decentralized decision-making.
  {
    id: "Q02", axis: "authority", polarity: -1,
    category: "Political structure",
    text: "Local communities should have substantial power to make decisions for themselves.",
    next: "Q03"
  },
  {
    id: "Q03", axis: "liberty", polarity: 1,
    category: "Civil liberties",
    text: "Adults should generally be free to make personal choices that do not harm others.",
    next: "Q04"
  },
  {
    id: "Q04", axis: "economy", polarity: 1,
    category: "Economic policy",
    text: "Private businesses usually coordinate production better than government agencies do.",
    next: "Q14"
  },

  // Branch B: mixed or conditional preferences.
  {
    id: "Q05", axis: "economy", polarity: -1,
    category: "Economic policy",
    text: "Essential services should remain accessible even when providing them is not profitable.",
    next: "Q06"
  },
  {
    id: "Q06", axis: "culture", polarity: 1,
    category: "Social change",
    text: "Public policy should adapt when long-standing social norms exclude or disadvantage people.",
    next: "Q07"
  },
  {
    id: "Q07", axis: "nation", polarity: 1,
    category: "International relations",
    text: "Countries should cooperate internationally when doing so helps address shared problems.",
    next: "Q14"
  },

  // Branch C: uncertainty or a preference for balance.
  {
    id: "Q08", axis: "authority", polarity: 1,
    category: "Political structure",
    text: "During major emergencies, national leaders should have wider powers to coordinate a response.",
    next: "Q09"
  },
  {
    id: "Q09", axis: "economy", polarity: -1,
    category: "Economic policy",
    text: "Reducing severe economic inequality is an important responsibility of government.",
    next: "Q10"
  },
  {
    id: "Q10", axis: "liberty", polarity: 1,
    category: "Civil liberties",
    text: "Peaceful expression should generally be protected even when it is deeply unpopular.",
    next: "Q14"
  },

  // Branch D: centralized coordination.
  {
    id: "Q11", axis: "authority", polarity: 1,
    category: "Political structure",
    text: "National standards can be more effective than having every region set its own rules.",
    next: "Q12"
  },
  {
    id: "Q12", axis: "culture", polarity: -1,
    category: "Social change",
    text: "Public institutions should preserve important cultural traditions across generations.",
    next: "Q13"
  },
  {
    id: "Q13", axis: "nation", polarity: -1,
    category: "International relations",
    text: "A country's elected government should retain the final say over its domestic policies.",
    next: "Q14"
  },

  // Shared questions: all branches converge here.
  {
    id: "Q14", axis: "economy", polarity: -1,
    category: "Economic policy",
    text: "Large differences in wealth should be reduced through taxation and public programs.",
    next: "Q15"
  },
  {
    id: "Q15", axis: "economy", polarity: 1,
    category: "Economic policy",
    text: "Competition between private businesses generally benefits consumers and innovation.",
    next: "Q16"
  },
  {
    id: "Q16", axis: "authority", polarity: -1,
    category: "Political structure",
    text: "Important decisions should be made as close to the affected communities as practical.",
    next: "Q17"
  },
  {
    id: "Q17", axis: "authority", polarity: 1,
    category: "Political structure",
    text: "A country needs strong public institutions to enforce common rules consistently.",
    next: "Q18"
  },
  {
    id: "Q18", axis: "liberty", polarity: 1,
    category: "Civil liberties",
    text: "The government should avoid restricting private behavior between consenting adults.",
    next: "Q19"
  },
  {
    id: "Q19", axis: "liberty", polarity: -1,
    category: "Public responsibility",
    text: "Government should sometimes restrict individual choices to protect the wider community.",
    next: "Q20"
  },
  {
    id: "Q20", axis: "culture", polarity: 1,
    category: "Social change",
    text: "Society should be open to revising traditions when people no longer find them appropriate.",
    next: "Q21"
  },
  {
    id: "Q21", axis: "culture", polarity: -1,
    category: "Social change",
    text: "Maintaining inherited customs is an important public goal, even as society changes.",
    next: "Q22"
  },
  {
    id: "Q22", axis: "nation", polarity: 1,
    category: "International relations",
    text: "International agreements are worthwhile when countries can jointly solve problems they cannot solve alone.",
    next: "Q23"
  },
  {
    id: "Q23", axis: "nation", polarity: -1,
    category: "International relations",
    text: "A country should avoid international commitments that substantially limit its independent policy choices.",
    next: "Q24"
  },
  {
    id: "Q24", axis: "economy", polarity: -1,
    category: "Public services",
    text: "Universal access to healthcare and education should take priority over keeping taxes low.",
    next: "Q25"
  },
  {
    id: "Q25", axis: "liberty", polarity: 1,
    category: "Civil liberties",
    text: "People should be able to criticize their government openly without fear of punishment for peaceful dissent."
  }
];

const AXIS_IDS = Object.keys(AXES);
const QUESTION_BY_ID = new Map(QUESTIONS.map(q => [q.id, q]));

const state = {
  path: [],
  currentIndex: 0,
  answers: {}
};

const $ = id => document.getElementById(id);

function showScreen(screenId) {
  ["home-screen", "quiz-screen", "results-screen", "error-screen"].forEach(id => {
    $(id).classList.toggle("hidden", id !== screenId);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function saveSession() {
  try {
    sessionStorage.setItem("kfcvalues-session", JSON.stringify(state));
  } catch (error) {
    // The test remains usable if browser storage is unavailable.
  }
}

function restoreSession() {
  try {
    const saved = sessionStorage.getItem("kfcvalues-session");
    if (!saved) return false;

    const parsed = JSON.parse(saved);
    if (
      !Array.isArray(parsed.path) ||
      !parsed.path.length ||
      !parsed.path.every(id => QUESTION_BY_ID.has(id)) ||
      !Number.isInteger(parsed.currentIndex) ||
      parsed.currentIndex < 0 ||
      parsed.currentIndex >= parsed.path.length ||
      !parsed.answers ||
      typeof parsed.answers !== "object"
    ) return false;

    state.path = parsed.path;
    state.currentIndex = parsed.currentIndex;
    state.answers = parsed.answers;
    return true;
  } catch (error) {
    return false;
  }
}

function startTest() {
  state.path = ["Q01"];
  state.currentIndex = 0;
  state.answers = {};
  saveSession();
  renderQuestion();
  showScreen("quiz-screen");
}

function currentQuestion() {
  return QUESTION_BY_ID.get(state.path[state.currentIndex]);
}

function renderQuestion() {
  const question = currentQuestion();
  if (!question) {
    showError("A question could not be found. Check the question IDs in app.js.");
    return;
  }

  const selected = state.answers[question.id];

$("question-counter").textContent =
    `QUESTION ${state.currentIndex + 1} / 16`;
  $("branch-label").textContent =
    state.currentIndex < 4 ? "BRANCHING PATH" : "SHARED QUESTIONS";
  $("question-category").textContent = question.category;
  $("question-title").textContent = question.text;
  $("question-hint").textContent =
    "Choose the answer that best reflects your view. There are no right or wrong answers.";

  const answered = Object.keys(state.answers).filter(id => state.path.includes(id)).length;
  $("answered-count").textContent = `${answered} answered`;

  const progress = Math.round((state.currentIndex / 16) * 100);
  $("progress-bar").style.width = `${progress}%`;
  $("progress-track").setAttribute("aria-valuenow", String(progress));

  $("back-button").disabled = state.currentIndex === 0;
  $("next-button").textContent =
    state.currentIndex === state.path.length - 1 && !question.next
      ? "See results →"
      : "Continue →";

  $("answer-error").classList.add("hidden");
  $("answer-list").replaceChildren();

  ANSWER_OPTIONS.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.setAttribute("aria-pressed", String(selected === index));

    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const label = document.createElement("span");
    label.textContent = option.label;

    button.append(letter, label);
    button.addEventListener("click", () => {
      state.answers[question.id] = index;
      saveSession();

      $("answer-list").querySelectorAll(".answer-option").forEach((item, i) => {
        item.setAttribute("aria-pressed", String(i === index));
      });

      $("answer-error").classList.add("hidden");
      const count = Object.keys(state.answers).filter(id => state.path.includes(id)).length;
      $("answered-count").textContent = `${count} answered`;
    });

    $("answer-list").append(button);
  });
}

function goBack() {
  if (state.currentIndex <= 0) return;
  state.currentIndex--;
  saveSession();
  renderQuestion();
  $("question-title").focus();
}

function goNext() {
  const question = currentQuestion();
  const answerIndex = state.answers[question.id];

  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex > 4) {
    $("answer-error").classList.remove("hidden");
    return;
  }

  const nextId = question.nextByAnswer
    ? question.nextByAnswer[answerIndex]
    : question.next;

  // Drop later answers and route history when an earlier answer changes.
  state.path = state.path.slice(0, state.currentIndex + 1);

  if (!nextId) {
    saveSession();
    showResults();
    return;
  }

  if (!QUESTION_BY_ID.has(nextId)) {
    showError(`The next question "${nextId}" does not exist.`);
    return;
  }

  state.path.push(nextId);
  state.currentIndex++;
  saveSession();
  renderQuestion();
  $("question-title").focus();
}

function calculateAxisScores() {
  const totals = Object.fromEntries(AXIS_IDS.map(axis => [axis, 0]));
  const counts = Object.fromEntries(AXIS_IDS.map(axis => [axis, 0]));

  state.path.forEach(id => {
    const question = QUESTION_BY_ID.get(id);
    const answerIndex = state.answers[id];

    if (!question || !Number.isInteger(answerIndex)) return;

    const answerValue = ANSWER_OPTIONS[answerIndex].value;
    totals[question.axis] += answerValue * question.polarity;
    counts[question.axis]++;
  });

  return Object.fromEntries(AXIS_IDS.map(axis => [
    axis,
    counts[axis] ? totals[axis] / counts[axis] : 0
  ]));
}

function calculateIdeologyMatches(scores) {
  return IDEOLOGIES.map(ideology => {
    const distances = AXIS_IDS.map(axis =>
      Math.abs(scores[axis] - ideology.profile[axis])
    );

    const meanDistance =
      distances.reduce((sum, distance) => sum + distance, 0) / AXIS_IDS.length;

    const similarity = Math.max(
      0,
      Math.min(100, Math.round(100 * (1 - meanDistance / 4)))
    );

    const closestAxes = AXIS_IDS
      .map((axis, index) => ({
        axis,
        distance: distances[index]
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .map(item => AXES[item.axis].name);

    return {
      ...ideology,
      similarity,
      closestAxes
    };
  }).sort((a, b) => b.similarity - a.similarity);
}

function describePosition(axis, value) {
  if (value < -0.65) return axis.low;
  if (value > 0.65) return axis.high;
  return "A mixed or intermediate position";
}

function createMatchCard(match, index) {
  const article = document.createElement("article");
  article.className = "match-card";

  const top = document.createElement("div");
  top.className = "match-top";

  const info = document.createElement("div");
  const rank = document.createElement("div");
  rank.className = "match-rank";
  rank.textContent = index === 0 ? "CLOSEST PROFILE" : `MATCH ${index + 1}`;

  const title = document.createElement("h3");
  title.textContent = match.name;

  const description = document.createElement("p");
  description.textContent = match.description;

  const reason = document.createElement("p");
  reason.style.marginTop = "9px";
  reason.textContent = `Closest dimensions: ${match.closestAxes.join(" and ")}.`;

  info.append(rank, title, description, reason);

  const percent = document.createElement("div");
  percent.className = "match-percent";
  percent.textContent = `${match.similarity}%`;
  percent.setAttribute("aria-label", `${match.similarity}% profile similarity`);

  top.append(info, percent);

  const bar = document.createElement("div");
  bar.className = "match-bar";
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", "100");
  bar.setAttribute("aria-valuenow", String(match.similarity));
  bar.setAttribute("aria-label", `${match.name} similarity`);

  const fill = document.createElement("div");
  fill.className = "match-bar-fill";
  fill.style.width = `${match.similarity}%`;
  bar.append(fill);

  article.append(top, bar);
  return article;
}

function createDimensionCard(axisId, value) {
  const axis = AXES[axisId];
  const card = document.createElement("article");
  card.className = "dimension-card";

  const heading = document.createElement("div");
  heading.className = "dimension-heading";

  const name = document.createElement("span");
  name.textContent = axis.name;

  const result = document.createElement("span");
  result.textContent = `${value.toFixed(2)} / 2`;
  heading.append(name, result);

  const description = document.createElement("p");
  description.className = "dimension-description";
  description.textContent = `${describePosition(axis, value)}. ${axis.description}`;

  const labels = document.createElement("div");
  labels.className = "scale-labels";

  const low = document.createElement("span");
  low.textContent = axis.low;

  const high = document.createElement("span");
  high.textContent = axis.high;
  high.style.textAlign = "right";

  labels.append(low, high);

  const track = document.createElement("div");
  track.className = "axis-track";
  track.setAttribute("role", "img");
  track.setAttribute("aria-label", `${axis.name}: ${describePosition(axis, value)}`);

  const center = document.createElement("span");
  center.className = "axis-center";

  const marker = document.createElement("span");
  marker.className = "axis-marker";
  marker.style.left = `${((value + 2) / 4) * 100}%`;

  track.append(center, marker);
  card.append(heading, description, labels, track);
  return card;
}

function showResults() {
  const scores = calculateAxisScores();
  const matches = calculateIdeologyMatches(scores);

  $("match-list").replaceChildren(
    ...matches.slice(0, 3).map(createMatchCard)
  );

  $("dimension-list").replaceChildren(
    ...AXIS_IDS.map(axis => createDimensionCard(axis, scores[axis]))
  );

  $("scoring-explanation").textContent =
    `This run included ${state.path.length} questions. Each answer was assigned ` +
    `a value from -2 to +2. The question's polarity determines which direction ` +
    `its answer moves the relevant axis. Each dimension is the mean of its answered ` +
    `questions, so every axis stays on a scale from -2 to +2. Each ideology's ` +
    `similarity is 100 × (1 − the average absolute difference across the five axes ÷ 4), ` +
    `rounded to a whole percentage. This compares your profile with fixed example ` +
    `profiles; the percentages are not probabilities, percentiles, or the share of ` +
    `your beliefs that are correct. The highest similarity is simply the closest ` +
    `profile among the eight currently included.`;

  $("copy-status").textContent = "";
  state.answers = Object.fromEntries(
    Object.entries(state.answers).filter(([id]) => state.path.includes(id))
  );
  saveSession();
  showScreen("results-screen");
}

function copyResults() {
  const scores = calculateAxisScores();
  const matches = calculateIdeologyMatches(scores);

  const lines = [
    "KFCValues — Political Values Test",
    "",
    "Closest illustrative ideology profiles:",
    ...matches.slice(0, 3).map((match, i) =>
      `${i + 1}. ${match.name} — ${match.similarity}% similarity`
    ),
    "",
    "Political dimensions:",
    ...AXIS_IDS.map(axis =>
      `${AXES[axis].name}: ${scores[axis].toFixed(2)} / 2 — ${describePosition(AXES[axis], scores[axis])}`
    ),
    "",
    "These are comparisons against simplified example profiles, not scientific classifications."
  ];

  const text = lines.join("\n");

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => { $("copy-status").textContent = "Results copied."; })
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();

  try {
    const copied = document.execCommand("copy");
    $("copy-status").textContent = copied
      ? "Results copied."
      : "Copy was unavailable. You can select and copy the results manually.";
  } catch (error) {
    $("copy-status").textContent =
      "Copy was unavailable. You can select and copy the results manually.";
  }

  area.remove();
}

function showError(message) {
  $("error-message").textContent = message;
  showScreen("error-screen");
}

function init() {
  if (
    QUESTIONS.length !== 25 ||
    QUESTIONS.some(q => !q.id || !AXES[q.axis] || !Number.isFinite(q.polarity))
  ) {
    showError("The question data is incomplete. Check QUESTIONS and AXES in app.js.");
    return;
  }

  $("start-button").addEventListener("click", startTest);
  $("brand-link").addEventListener("click", event => {
    event.preventDefault();
    showScreen("home-screen");
  });
  $("back-button").addEventListener("click", goBack);
  $("next-button").addEventListener("click", goNext);
  $("retake-button").addEventListener("click", startTest);
  $("copy-button").addEventListener("click", copyResults);
  $("reload-button").addEventListener("click", () => window.location.reload());

  // Validate that every referenced next question exists.
  for (const question of QUESTIONS) {
    const destinations = question.nextByAnswer || (question.next ? [question.next] : []);
    if (destinations.some(id => !QUESTION_BY_ID.has(id))) {
      showError(`A branch from ${question.id} points to a missing question.`);
      return;
    }
  }

  if (restoreSession()) {
    renderQuestion();
    showScreen("quiz-screen");
  } else {
    showScreen("home-screen");
  }
}

document.addEventListener("DOMContentLoaded", init);
