// holds current user || empty if no user is connected
window.currentUser = {};

// game data
window.levels = {

    tables: [
        [
            ['9', '6', '2', '7', '8', '5', '3', '4', '1'],
            ['8', '4', '5', '9', '3', '1', '6', '7', '2'],
            ['3', '7', '1', '4', '6', '2', '8', '9', '5'],
            ['5', '8', '6', '3', '7', '4', '1', '2', '9'],
            ['1', '2', '9', '8', '5', '6', '7', '3', '4'],
            ['7', '3', '4', '1', '2', '9', '5', '8', '6'],
            ['6', '9', '3', '2', '1', '8', '4', '5', '7'],
            ['2', '5', '7', '6', '4', '3', '9', '1', '8'],
            ['4', '1', '8', '5', '9', '7', '2', '6', '3']
        ],
        [
            ['1', '5', '4', '2', '3', '9', '6', '8', '7'],
            ['8', '3', '2', '5', '7', '6', '1', '4', '9'],
            ['9', '7', '6', '4', '8', '1', '2', '5', '3'],
            ['4', '2', '3', '8', '6', '5', '7', '9', '1'],
            ['7', '9', '5', '3', '1', '4', '8', '2', '6'],
            ['6', '1', '8', '7', '9', '2', '5', '3', '4'],
            ['3', '6', '7', '9', '5', '8', '4', '1', '2'],
            ['5', '4', '1', '6', '2', '3', '9', '7', '8'],
            ['2', '8', '9', '1', '4', '7', '3', '6', '5']
        ],
        [
            ['6', '3', '8', '7', '2', '9', '1', '4', '5'],
            ['5', '7', '1', '4', '8', '3', '6', '9', '2'],
            ['4', '9', '2', '1', '6', '5', '3', '7', '8'],
            ['2', '5', '3', '9', '1', '7', '8', '6', '4'],
            ['8', '1', '6', '3', '4', '2', '9', '5', '7'],
            ['7', '4', '9', '6', '5', '8', '2', '1', '3'],
            ['9', '2', '4', '5', '3', '1', '7', '8', '6'],
            ['3', '6', '7', '8', '9', '4', '5', '2', '1'],
            ['1', '8', '5', '2', '7', '6', '4', '3', '9']
        ],
        [
            ['1', '5', '4', '2', '3', '9', '6', '8', '7'],
            ['8', '3', '2', '5', '7', '6', '1', '4', '9'],
            ['9', '7', '6', '4', '8', '1', '2', '5', '3'],
            ['4', '2', '3', '8', '6', '5', '7', '9', '1'],
            ['7', '9', '5', '3', '1', '4', '8', '2', '6'],
            ['6', '1', '8', '7', '9', '2', '5', '3', '4'],
            ['3', '6', '7', '9', '5', '8', '4', '1', '2'],
            ['5', '4', '1', '6', '2', '3', '9', '7', '8'],
            ['2', '8', '9', '1', '4', '7', '3', '6', '5']
        ]
    ],
    levels: {
        1: 60,
        2: 40,
        3: 20
    }
};

window.currentLevel = null;
window.currentTable = null;

function getUsers() {
    if (localStorage.getItem('users') === null) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    return JSON.parse(localStorage.users);
}

function register() {
    var username = document.getElementById('registerUsername');
    var password = document.getElementById('registerPassword');
    var confirmPassword = document.getElementById('registerConfirmPassword');

    username.classList.remove('is-invalid');
    username.nextElementSibling.innerHTML = "";

    password.classList.remove('is-invalid');
    password.nextElementSibling.innerHTML = "";

    confirmPassword.classList.remove('is-invalid');
    confirmPassword.nextElementSibling.innerHTML = "";

    if (username.value.length === 0) {
        username.classList.add('is-invalid');
        username.nextElementSibling.innerHTML = "Username is required.";
        return false;
    }

    var users = getUsers();

    var exists = users.filter(function (item) {
        return item.username === username.value;
    });

    if (exists.length > 0) {
        username.classList.add('is-invalid');
        username.nextElementSibling.innerHTML = "Username taken.";
        return false;
    }

    if (password.value.length < 6) {
        password.classList.add('is-invalid');
        password.nextElementSibling.innerHTML = "Must be at least 6 characters.";
        return false;
    }


    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('is-invalid');
        confirmPassword.nextElementSibling.innerHTML = "Passwords do not match.";
        return false;
    }

    var registeredUser = {
        username: username.value,
        password: password.value
    };

    users.push(registeredUser);

    localStorage.users = JSON.stringify(users);

    window.currentUser = registeredUser;

    goToLevel();
}

function login() {
    var username = document.getElementById("idName");
    var password = document.getElementById("idpassw");

    var users = getUsers();

    var exists = users.filter(function (item) {
        return item.username === username.value;
    });

    if (
        exists.length === 1 &&
        exists[0].password === password.value
    ) {
        window.currentUser = exists[0];
        return true;
    }

    return false;
}

function insert() {
    var username = document.getElementById("idName");
    var password = document.getElementById("idpassw");

    username.classList.remove('is-invalid');
    username.nextElementSibling.innerHTML = "";

    password.classList.remove('is-invalid');
    password.nextElementSibling.innerHTML = "";

    if (login()) {
        goToLevel();
    } else {

        username.classList.add('is-invalid');
        username.nextElementSibling.innerHTML = "The credentials are incorrect.";

        password.classList.add('is-invalid');
        password.nextElementSibling.innerHTML = "The credentials are incorrect.";
    }

}

function goToLevel() {
    // hide login & game
    document.getElementById('login').style.display = 'none';
    document.getElementById('game').style.display = 'none';

    // set username
    document.getElementById('level_username').innerText = window.currentUser.username;

    // show level
    document.getElementById('level').style.display = 'block';
}

function goToGame() {
    // Hide level & login
    document.getElementById('login').style.display = 'none';
    document.getElementById('level').style.display = 'none';

    // show game
    document.getElementById('game').style.display = 'block';
}

function rollDice() {

    return (Math.floor(Math.random() * 81) + 1);

}

function createTable(tableData, numbersShown, reset) {

    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    table.className = 'table table-bordered';


    if (reset !== 'reset') {

        var hidden = [];
        for (var n = 1; n <= (81 - numbersShown); n++) { //insert to hidden array random number that not appears more than once

            do {
                var diceRoll = rollDice();

            } while (hidden.indexOf(diceRoll) > -1);

            hidden.push(diceRoll);

        }

        window.h = hidden;
    }

    tableData.forEach(function (rowData, rowKey) {
        var row = document.createElement('tr');
        row.dataset.row = rowKey + 1;

        rowData.forEach(function (cellData, cellKey) {
            var cell = document.createElement('td');
            cell.dataset.cell = cellKey + 1;

            var current = (parseInt(row.dataset.row) * parseInt(cell.dataset.cell));

            var shouldHide = window.h.indexOf(current) > -1;

            if (shouldHide) {
                var input = document.createElement('INPUT');
                input.type = 'text';
                input.pattern = '\d'; // allow numeric input only
                cell.appendChild(input);
            } else {
                cell.innerText = cellData;
            }
            row.appendChild(cell);

        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    document.getElementById('sudokuBoard').appendChild(table);
}

function level(numLevel, table, reset) {
    // Random number between 0 and max available tables
    var random = Math.floor(Math.random() * window.levels.tables.length);

    window.currentLevel = window.levels.levels[numLevel];
    window.currentTable = table || window.levels.tables[random];

    createTable(window.currentTable, window.currentLevel, reset);

    goToGame();
}

function checkRow(mat, arr_checkNumber) {
    var count = 0;
    var isOk = true;

    for (var row = 0; row < mat.length; row++) {
        for (var i = 0; i < arr_checkNumber.length; i++) {
            for (var col = 0; col < mat.length; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {
                    isOk = false;
                }

            }
            count = 0;
        }
    }

    return isOk;

}

function checkCol(mat, arr_checkNumber) {
    var count = 0;
    var isOk = true;

    for (var col = 0; col < mat.length; col++) {
        for (var i = 0; i < arr_checkNumber.length; i++) {
            for (var row = 0; row < mat.length; row++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {
                    isOk = false;
                }

            }
            count = 0;
        }
    }

    return isOk;

}

function checkSquare(mat, arr_checkNumber) {

    var count = 0;
    var col = 0;
    var row = 0;

    for (var i = 0; i < arr_checkNumber.length; i++) {
        for (row = 0; row < 3; row++) {
            for (col = 0; col < 3; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    count = 0;
    col = 0;
    row = 0;

    for (i = 0; i < arr_checkNumber.length; i++) {
        for (row = 3; row < 6; row++) {
            for (col = 0; col < 3; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    count = 0;
    col = 0;
    row = 0;

    for (i = 0; i < arr_checkNumber.length; i++) {
        for (row = 6; row < 9; row++) {
            for (col = 0; col < 3; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    count = 0;
    col = 0;
    row = 0;

    for (i = 0; i < arr_checkNumber.length; i++) {
        for (row = 0; row < 3; row++) {
            for (col = 3; col < 6; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    count = 0;
    col = 0;
    row = 0;

    for (i = 0; i < arr_checkNumber.length; i++) {
        for (row = 3; row < 6; row++) {
            for (col = 3; col < 6; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    count = 0;
    col = 0;
    row = 0;

    for (i = 0; i < arr_checkNumber.length; i++) {
        for (row = 6; row < 9; row++) {
            for (col = 3; col < 6; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    count = 0;
    col = 0;
    row = 0;

    for (i = 0; i < arr_checkNumber.length; i++) {
        for (row = 0; row < 3; row++) {
            for (col = 6; col < 9; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    count = 0;
    col = 0;
    row = 0;

    for (i = 0; i < arr_checkNumber.length; i++) {
        for (row = 3; row < 6; row++) {
            for (col = 6; col < 9; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    count = 0;
    col = 0;
    row = 0;

    for (i = 0; i < arr_checkNumber.length; i++) {
        for (row = 6; row < 9; row++) {
            for (col = 6; col < 9; col++) {
                if (mat[row][col] === arr_checkNumber[i]) {
                    count++;
                }

                if (count > 1) {

                    return false;
                }
            }

        }
        count = 0;
    }

    return true;

}

function checkIfEmpty(mat) {

    for (var row = 0; row < mat.length; row++) {
        for (var col = 0; col < mat.length; col++) {
            if (mat[row][col] === null) {
                return false;
            }

        }
    }
    return true;
}

function tableToArray() {
    var testArray = [
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];


    document.querySelectorAll('#sudokuBoard td').forEach(function (item, key) {
        var row = parseInt(item.parentElement.dataset.row) - 1;
        var cell = parseInt(item.dataset.cell) - 1;
        var value = parseInt(item.children.length ? item.children[0].value : item.innerText);
        testArray[row][cell] = value || null;
    });

    return testArray;
}

function checkTable(mat) {
    var arr_checkNumber = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    if (!checkRow(mat, arr_checkNumber)) {
        console.log("not ok");
        return false;
    }

    if (!checkCol(mat, arr_checkNumber)) {
        console.log("not ok");
        return false;
    }

    if (!checkSquare(mat, arr_checkNumber)) {
        console.log("not ok");
        return false;
    }

    if (!checkIfEmpty(mat)) {
        console.log("not ok");
        return false;
    }

    console.log("ok");
    return true;

}

function finish() {

    if (checkTable(tableToArray())) {
        alert('You Win! ☺');
    } else {
        alert('You Lose! please try again ...');
    }

    var div = document.getElementById('sudokuBoard');
    var tableE = div.querySelector('table');
    div.removeChild(tableE);
    goToLevel();
}

function reset() {
    var div = document.getElementById('sudokuBoard');
    var tableE = div.querySelector('table');
    div.removeChild(tableE);

    level(window.currentLevel, window.currentTable, 'reset');
}

// show login
document.getElementById('login').style.display = 'block';
