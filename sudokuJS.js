window.currentUser = {};

window.levels = {
  tables: [
    [
      ["9", "6", "2", "7", "8", "5", "3", "4", "1"],
      ["8", "4", "5", "9", "3", "1", "6", "7", "2"],
      ["3", "7", "1", "4", "6", "2", "8", "9", "5"],
      ["5", "8", "6", "3", "7", "4", "1", "2", "9"],
      ["1", "2", "9", "8", "5", "6", "7", "3", "4"],
      ["7", "3", "4", "1", "2", "9", "5", "8", "6"],
      ["6", "9", "3", "2", "1", "8", "4", "5", "7"],
      ["2", "5", "7", "6", "4", "3", "9", "1", "8"],
      ["4", "1", "8", "5", "9", "7", "2", "6", "3"],
    ],
    [
      ["1", "5", "4", "2", "3", "9", "6", "8", "7"],
      ["8", "3", "2", "5", "7", "6", "1", "4", "9"],
      ["9", "7", "6", "4", "8", "1", "2", "5", "3"],
      ["4", "2", "3", "8", "6", "5", "7", "9", "1"],
      ["7", "9", "5", "3", "1", "4", "8", "2", "6"],
      ["6", "1", "8", "7", "9", "2", "5", "3", "4"],
      ["3", "6", "7", "9", "5", "8", "4", "1", "2"],
      ["5", "4", "1", "6", "2", "3", "9", "7", "8"],
      ["2", "8", "9", "1", "4", "7", "3", "6", "5"],
    ],
    [
      ["6", "3", "8", "7", "2", "9", "1", "4", "5"],
      ["5", "7", "1", "4", "8", "3", "6", "9", "2"],
      ["4", "9", "2", "1", "6", "5", "3", "7", "8"],
      ["2", "5", "3", "9", "1", "7", "8", "6", "4"],
      ["8", "1", "6", "3", "4", "2", "9", "5", "7"],
      ["7", "4", "9", "6", "5", "8", "2", "1", "3"],
      ["9", "2", "4", "5", "3", "1", "7", "8", "6"],
      ["3", "6", "7", "8", "9", "4", "5", "2", "1"],
      ["1", "8", "5", "2", "7", "6", "4", "3", "9"],
    ],
    [
      ["9", "6", "2", "7", "8", "5", "3", "4", "1"],
      ["8", "4", "5", "9", "3", "1", "6", "7", "2"],
      ["3", "7", "1", "4", "6", "2", "8", "9", "5"],
      ["5", "8", "6", "3", "7", "4", "1", "2", "9"],
      ["1", "2", "9", "8", "5", "6", "7", "3", "4"],
      ["7", "3", "4", "1", "2", "9", "5", "8", "6"],
      ["6", "9", "3", "2", "1", "8", "4", "5", "7"],
      ["2", "5", "7", "6", "4", "3", "9", "1", "8"],
      ["4", "1", "8", "5", "9", "7", "2", "6", "3"],
    ],
  ],
  levels: {
    1: 60,
    2: 40,
    3: 20,
  },
  difficultyNames: {
    1: "Easy Flow",
    2: "Balanced Mode",
    3: "Expert Pressure",
  },
};

window.gameState = {
  difficultyKey: null,
  shownCount: null,
  table: null,
  hiddenCells: [],
  selectedInput: null,
  seconds: 0,
  timerId: null,
  completed: false,
};

window.statusTimer = null;

function getUsers() {
  if (localStorage.getItem("users") === null) {
    localStorage.setItem("users", JSON.stringify([]));
  }

  return JSON.parse(localStorage.users);
}

function setView(viewId) {
  ["login", "level", "game"].forEach(function (id) {
    var element = document.getElementById(id);
    element.style.display = id === viewId ? "flex" : "none";
  });
}

function showStatus(message, tone) {
  var banner = document.getElementById("statusBanner");
  banner.textContent = message;
  banner.className = "status-banner is-visible status-" + (tone || "info");

  clearTimeout(window.statusTimer);
  window.statusTimer = setTimeout(function () {
    banner.className = "status-banner";
  }, 2800);
}

function setFieldError(input, message) {
  input.classList.add("is-invalid");
  input.nextElementSibling.innerHTML = message;
}

function clearFieldError(input) {
  input.classList.remove("is-invalid");
  input.nextElementSibling.innerHTML = "";
}

function clearAuthErrors(inputs) {
  inputs.forEach(clearFieldError);
}

function showLoginTab() {
  if (window.jQuery && window.jQuery.fn && window.jQuery.fn.tab) {
    window.jQuery("#nav-login-tab").tab("show");
    return;
  }

  document.getElementById("nav-login-tab").classList.add("active");
  document.getElementById("nav-register-tab").classList.remove("active");
  document.getElementById("nav-login").classList.add("show", "active");
  document.getElementById("nav-register").classList.remove("show", "active");
}

function register() {
  var username = document.getElementById("registerUsername");
  var password = document.getElementById("registerPassword");
  var confirmPassword = document.getElementById("registerConfirmPassword");

  clearAuthErrors([username, password, confirmPassword]);

  if (username.value.trim().length === 0) {
    setFieldError(username, "Username is required.");
    return false;
  }

  var users = getUsers();
  var exists = users.filter(function (item) {
    return item.username === username.value.trim();
  });

  if (exists.length > 0) {
    setFieldError(username, "Username taken.");
    return false;
  }

  if (password.value.length < 6) {
    setFieldError(password, "Must be at least 6 characters.");
    return false;
  }

  if (password.value !== confirmPassword.value) {
    setFieldError(confirmPassword, "Passwords do not match.");
    return false;
  }

  var registeredUser = {
    username: username.value.trim(),
    password: password.value,
  };

  users.push(registeredUser);
  localStorage.users = JSON.stringify(users);

  document.getElementById("loginForm").reset();
  document.getElementById("registerForm").reset();
  document.getElementById("idName").value = registeredUser.username;
  showLoginTab();
  setView("login");
  showStatus("Account created. Please sign in to continue.", "success");
  return true;
}

function login() {
  var username = document.getElementById("idName").value.trim();
  var password = document.getElementById("idpassw").value;
  var users = getUsers();
  var exists = users.filter(function (item) {
    return item.username === username;
  });

  if (exists.length === 1 && exists[0].password === password) {
    window.currentUser = exists[0];
    return true;
  }

  return false;
}

function insert() {
  var username = document.getElementById("idName");
  var password = document.getElementById("idpassw");

  clearAuthErrors([username, password]);

  if (login()) {
    showStatus("Signed in. Choose a board.", "success");
    goToLevel();
  } else {
    setFieldError(username, "The credentials are incorrect.");
    setFieldError(password, "The credentials are incorrect.");
  }
}

function updateUserLabels() {
  var username = window.currentUser.username || "Guest";
  document.getElementById("level_username").innerText = username;
  document.getElementById("game_username").innerText = username;
}

function clearBoard() {
  var board = document.getElementById("sudokuBoard");
  board.innerHTML = "";

  var outcome = document.getElementById("gameOutcome");
  outcome.className = "game-outcome";
  outcome.textContent = "";
}

function stopTimer() {
  clearInterval(window.gameState.timerId);
  window.gameState.timerId = null;
}

function formatTime(totalSeconds) {
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

function updateTimerLabel() {
  document.getElementById("timerLabel").innerText = formatTime(
    window.gameState.seconds,
  );
}

function startTimer() {
  stopTimer();
  window.gameState.seconds = 0;
  updateTimerLabel();
  window.gameState.timerId = setInterval(function () {
    window.gameState.seconds += 1;
    updateTimerLabel();
  }, 1000);
}

function goToLevel() {
  stopTimer();
  clearSelection();
  clearBoard();
  updateUserLabels();
  setView("level");
}

function goToGame() {
  updateUserLabels();
  setView("game");
}

function logout() {
  stopTimer();
  window.currentUser = {};
  window.gameState = {
    difficultyKey: null,
    shownCount: null,
    table: null,
    hiddenCells: [],
    selectedInput: null,
    seconds: 0,
    timerId: null,
    completed: false,
  };
  clearBoard();
  document.getElementById("loginForm").reset();
  document.getElementById("registerForm").reset();
  showStatus("Signed out.", "info");
  setView("login");
}

function shuffleArray(items) {
  var array = items.slice();
  for (var index = array.length - 1; index > 0; index--) {
    var swapIndex = Math.floor(Math.random() * (index + 1));
    var current = array[index];
    array[index] = array[swapIndex];
    array[swapIndex] = current;
  }
  return array;
}

function buildHiddenCells(shownCount) {
  var allIndexes = [];
  for (var index = 1; index <= 81; index++) {
    allIndexes.push(index);
  }

  return shuffleArray(allIndexes).slice(0, 81 - shownCount);
}

function getDifficultyName(levelKey) {
  return window.levels.difficultyNames[levelKey] || "Custom";
}

function getCellIndex(row, col) {
  return row * 9 + col + 1;
}

function clearSelection() {
  document.querySelectorAll("#sudokuBoard td").forEach(function (cell) {
    cell.classList.remove("is-selected");
    cell.classList.remove("is-related");
  });

  window.gameState.selectedInput = null;
  document.getElementById("activeCellLabel").innerText =
    "Select an empty cell to start.";
}

function selectInput(input) {
  if (!input) {
    return;
  }

  clearSelection();
  window.gameState.selectedInput = input;

  var selectedCell = input.parentElement;
  var row = selectedCell.dataset.row;
  var col = selectedCell.dataset.cell;
  var box = selectedCell.dataset.box;

  document.querySelectorAll("#sudokuBoard td").forEach(function (cell) {
    if (
      cell.dataset.row === row ||
      cell.dataset.cell === col ||
      cell.dataset.box === box
    ) {
      cell.classList.add("is-related");
    }
  });

  selectedCell.classList.add("is-selected");
  document.getElementById("activeCellLabel").innerText =
    "Row " + row + ", column " + col + ".";
}

function renderCellState(input) {
  var cell = input.parentElement;
  var answer = input.dataset.answer;
  var value = input.value;

  input.classList.remove("is-correct");
  input.classList.remove("is-incorrect");
  cell.classList.remove("has-correct");
  cell.classList.remove("has-error");

  if (!value) {
    return;
  }

  if (value === answer) {
    input.classList.add("is-correct");
    cell.classList.add("has-correct");
  } else {
    input.classList.add("is-incorrect");
    cell.classList.add("has-error");
  }
}

function updateBoardMetrics() {
  var editableInputs = Array.from(document.querySelectorAll(".cell-input"));
  var total = editableInputs.length;
  var filled = editableInputs.filter(function (input) {
    return input.value !== "";
  }).length;
  var mistakes = editableInputs.filter(function (input) {
    return input.value !== "" && input.value !== input.dataset.answer;
  }).length;
  var progress = total ? Math.round((filled / total) * 100) : 100;

  document.getElementById("progressValue").innerText = progress + "%";
  document.getElementById("progressBar").style.width = progress + "%";
  document.getElementById("mistakeCount").innerText = String(mistakes);

  if (mistakes > 0) {
    document.getElementById("boardStateLabel").innerText =
      mistakes +
      " cell" +
      (mistakes === 1 ? "" : "s") +
      " currently disagree with the solution.";
  } else if (filled === total) {
    document.getElementById("boardStateLabel").innerText =
      "Board filled. Run a solution check.";
  } else {
    document.getElementById("boardStateLabel").innerText =
      "Keep going. " +
      (total - filled) +
      " empty cell" +
      (total - filled === 1 ? "" : "s") +
      " left.";
  }
}

function sanitizeValue(value) {
  return value.replace(/[^1-9]/g, "").slice(0, 1);
}

function handleInputChange(event) {
  var input = event.target;
  input.value = sanitizeValue(input.value);
  renderCellState(input);
  updateBoardMetrics();
}

function moveSelection(rowOffset, colOffset) {
  if (!window.gameState.selectedInput) {
    return;
  }

  var cell = window.gameState.selectedInput.parentElement;
  var targetRow = parseInt(cell.dataset.row, 10) + rowOffset;
  var targetCol = parseInt(cell.dataset.cell, 10) + colOffset;
  var selector =
    '.cell-input[data-row="' + targetRow + '"][data-col="' + targetCol + '"]';
  var next = document.querySelector(selector);

  if (next) {
    next.focus();
    selectInput(next);
  }
}

function handleInputKeydown(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveSelection(-1, 0);
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    moveSelection(1, 0);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveSelection(0, -1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    moveSelection(0, 1);
  }

  if (event.key === "Backspace" || event.key === "Delete") {
    event.target.value = "";
    renderCellState(event.target);
    updateBoardMetrics();
  }
}

function createTable(tableData) {
  var board = document.getElementById("sudokuBoard");
  var table = document.createElement("table");
  var body = document.createElement("tbody");

  tableData.forEach(function (rowData, rowIndex) {
    var row = document.createElement("tr");

    rowData.forEach(function (cellData, colIndex) {
      var cell = document.createElement("td");
      var cellIndex = getCellIndex(rowIndex, colIndex);
      var boxIndex =
        Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3) + 1;
      var shouldHide = window.gameState.hiddenCells.indexOf(cellIndex) > -1;

      cell.dataset.row = String(rowIndex + 1);
      cell.dataset.cell = String(colIndex + 1);
      cell.dataset.box = String(boxIndex);
      cell.classList.add(shouldHide ? "is-editable" : "is-fixed");

      if (shouldHide) {
        var input = document.createElement("input");
        input.type = "text";
        input.inputMode = "numeric";
        input.autocomplete = "off";
        input.maxLength = 1;
        input.className = "cell-input";
        input.dataset.answer = cellData;
        input.dataset.row = String(rowIndex + 1);
        input.dataset.col = String(colIndex + 1);
        input.setAttribute(
          "aria-label",
          "Row " + (rowIndex + 1) + " column " + (colIndex + 1),
        );
        input.addEventListener("focus", function (event) {
          selectInput(event.target);
        });
        input.addEventListener("click", function (event) {
          selectInput(event.target);
        });
        input.addEventListener("input", handleInputChange);
        input.addEventListener("keydown", handleInputKeydown);
        cell.appendChild(input);
      } else {
        var fixedValue = document.createElement("span");
        fixedValue.className = "fixed-value";
        fixedValue.innerText = cellData;
        cell.appendChild(fixedValue);
      }

      row.appendChild(cell);
    });

    body.appendChild(row);
  });

  table.appendChild(body);
  board.appendChild(table);

  var firstInput = document.querySelector(".cell-input");
  if (firstInput) {
    firstInput.focus();
    selectInput(firstInput);
  }

  updateBoardMetrics();
}

function level(levelKey, table, resetMode) {
  var random = Math.floor(Math.random() * window.levels.tables.length);
  var shownCount = window.levels.levels[levelKey];

  if (!shownCount) {
    return;
  }

  window.gameState.difficultyKey = levelKey;
  window.gameState.shownCount = shownCount;
  window.gameState.table = table || window.levels.tables[random];
  window.gameState.completed = false;

  if (resetMode !== "reset") {
    window.gameState.hiddenCells = buildHiddenCells(shownCount);
  }

  clearBoard();
  clearSelection();
  document.getElementById("difficultyLabel").innerText =
    getDifficultyName(levelKey);
  createTable(window.gameState.table);
  startTimer();
  goToGame();
  showStatus("New puzzle ready.", "info");
}

function checkUnit(values) {
  if (values.length !== 9) {
    return false;
  }

  var expected = "123456789";
  var actual = values.slice().sort().join("");
  return actual === expected;
}

function checkRow(mat) {
  return mat.every(checkUnit);
}

function checkCol(mat) {
  for (var col = 0; col < 9; col++) {
    var values = [];
    for (var row = 0; row < 9; row++) {
      values.push(mat[row][col]);
    }
    if (!checkUnit(values)) {
      return false;
    }
  }
  return true;
}

function checkSquare(mat) {
  for (var startRow = 0; startRow < 9; startRow += 3) {
    for (var startCol = 0; startCol < 9; startCol += 3) {
      var values = [];
      for (var row = startRow; row < startRow + 3; row++) {
        for (var col = startCol; col < startCol + 3; col++) {
          values.push(mat[row][col]);
        }
      }
      if (!checkUnit(values)) {
        return false;
      }
    }
  }
  return true;
}

function checkIfEmpty(mat) {
  return mat.every(function (row) {
    return row.every(function (value) {
      return value !== null;
    });
  });
}

function tableToArray() {
  var matrix = [[], [], [], [], [], [], [], [], []];

  document.querySelectorAll("#sudokuBoard td").forEach(function (cell) {
    var row = parseInt(cell.dataset.row, 10) - 1;
    var col = parseInt(cell.dataset.cell, 10) - 1;
    var input = cell.querySelector("input");
    var value = input
      ? parseInt(input.value, 10)
      : parseInt(cell.innerText, 10);
    matrix[row][col] = Number.isNaN(value) ? null : value;
  });

  return matrix;
}

function checkTable(mat) {
  return (
    checkIfEmpty(mat) && checkRow(mat) && checkCol(mat) && checkSquare(mat)
  );
}

function showOutcome(message, tone) {
  var outcome = document.getElementById("gameOutcome");
  outcome.className = "game-outcome is-visible outcome-" + tone;
  outcome.textContent = message;
}

function lockBoard() {
  document.querySelectorAll(".cell-input").forEach(function (input) {
    input.disabled = true;
  });
}

function revealSolution() {
  var editableInputs = document.querySelectorAll(".cell-input");

  if (!window.gameState.table || editableInputs.length === 0) {
    return;
  }

  editableInputs.forEach(function (input) {
    input.value = input.dataset.answer;
    renderCellState(input);
  });

  stopTimer();
  lockBoard();
  window.gameState.completed = true;
  updateBoardMetrics();
  clearSelection();

  showOutcome(
    "Solution revealed for " +
      getDifficultyName(window.gameState.difficultyKey) +
      ". Start a new puzzle whenever you are ready.",
    "info",
  );
  showStatus("Solution revealed.", "info");
}

function finish() {
  var board = tableToArray();

  if (checkTable(board)) {
    window.gameState.completed = true;
    stopTimer();
    lockBoard();
    showOutcome(
      "Solved cleanly in " +
        formatTime(window.gameState.seconds) +
        ". Pick another difficulty or start a fresh puzzle.",
      "success",
    );
    showStatus("Puzzle solved.", "success");
  } else {
    var mistakes = document.querySelectorAll(".cell-input.is-incorrect").length;
    showOutcome(
      mistakes > 0
        ? "There are still incorrect cells on the board. Fix the highlighted entries and try again."
        : "The board is not complete yet. Fill the remaining empty cells and check again.",
      "error",
    );
    showStatus("Solution check failed.", "error");
  }
}

function reset() {
  if (!window.gameState.difficultyKey || !window.gameState.table) {
    return;
  }

  level(window.gameState.difficultyKey, window.gameState.table, "reset");
  showStatus("Puzzle reset to its original empty cells.", "info");
}

function newPuzzle() {
  if (!window.gameState.difficultyKey) {
    return;
  }

  level(window.gameState.difficultyKey);
}

function applyKeypadValue(value) {
  var input = window.gameState.selectedInput;
  if (!input || input.disabled) {
    showStatus("Select an empty cell first.", "info");
    return;
  }

  input.value = value === "clear" ? "" : value;
  renderCellState(input);
  updateBoardMetrics();
  input.focus();
}

function setupKeypad() {
  document.getElementById("keypad").addEventListener("click", function (event) {
    var button = event.target.closest("button[data-value]");
    if (!button) {
      return;
    }

    applyKeypadValue(button.dataset.value);
  });
}

function setupForms() {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      insert();
    });

  document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      register();
    });
}

function initialize() {
  setupForms();
  setupKeypad();
  updateTimerLabel();
  setView("login");
}

initialize();
