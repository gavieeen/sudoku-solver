// empty 9x9 sudoku board
let board = Array.from({ length: 9 }, () => Array(9).fill(""));
const ROWS = 9;
const COLS = 9;
let in_box = new Array(ROWS).fill(false).map(() => new Array(COLS).fill(false));
let in_row = new Array(ROWS).fill(false).map(() => new Array(COLS).fill(false));
let in_col = new Array(ROWS).fill(false).map(() => new Array(COLS).fill(false));

function getDelay() {
    return parseInt(document.getElementById('delay').value, 10) || 10;
}

function fillBoard() {
    const cells = document.querySelectorAll('.cell input');

    cells.forEach((cell, index) => {
        const r = Math.floor(index / ROWS);
        const c = index % COLS;

        // Update board and cell value
        let value = (cell.value === '') ? '.' : cell.value;
        board[r][c] = cell.value = value;

        // Update in_box, in_row, in_col
        if (value !== '.') {
            let i = parseInt(value) - 1; // 0-indexing
            let box_r = Math.floor(r / 3) * 3 + Math.floor(c / 3);

            if (in_box[box_r][i] ||
                in_row[r][i] || in_col[c][i]) {
                alert('Invalid board!');
                cell.style.backgroundColor = 'red';
                setTimeout(() => {
                    cell.style.removeProperty('background-color');
                }, 1000);
                return false;
            }

            in_box[box_r][i] = in_row[r][i] = in_col[c][i] = true;
        }
    });

    return true
}

// return promise to update cells with delay
function updateCells() {
    return new Promise(resolve => {
        const cells = document.querySelectorAll('.cell input');
        let delay = getDelay();

        cells.forEach((cell, index) => {
            const r = Math.floor(index / ROWS);
            const c = index % COLS;

            setTimeout(() => {
                cell.value = board[r][c] === '.' ? '' : board[r][c];
                resolve();
            }, delay);

            delay += 10; // Increase delay for the next cell update
        });
    });
}

async function solveSudoku() {
    if (!await backtrack(0)) alert('No solution exists!');
}

async function backtrack(position) {
    if (position === ROWS * COLS) return true;

    let r = Math.floor(position / ROWS);
    let c = position % COLS;

    if (board[r][c] !== '.') return await backtrack(position + 1);

    for (let i = 0; i < 9; i++) {
        let box_r = Math.floor(r / 3) * 3 + Math.floor(c / 3);

        if (in_box[box_r][i] || in_row[r][i] || in_col[c][i]) continue;

        in_box[box_r][i] = in_row[r][i] = in_col[c][i] = true;
        board[r][c] = (i + 1).toString();
        await updateCells();

        if (await backtrack(position + 1)) return true;

        in_box[box_r][i] = in_row[r][i] = in_col[c][i] = false;
        board[r][c] = '.';
        await updateCells();
    }
    return false;
}

const reset = document.getElementById('reset')
const solve = document.getElementById('solve')


reset.onclick = function () {
    const cells = document.querySelectorAll('.cell input');
    // Reset in_box, in_row, in_col arrays
    in_box = new Array(ROWS).fill(false).map(() => new Array(COLS).fill(false));
    in_row = new Array(ROWS).fill(false).map(() => new Array(COLS).fill(false));
    in_col = new Array(ROWS).fill(false).map(() => new Array(COLS).fill(false));

    // reset the board on screen
    cells.forEach((cell, index) => {
        const r = Math.floor(index / ROWS);
        const c = index % COLS;
        board[r][c] = ""; // Reset board value
        cell.classList.add('fade-out'); // Apply fade-out class
        cell.style.removeProperty('background-color'); // Remove background color
        setTimeout(() => {
            cell.value = ''; // Clear cell content after fade-out
            cell.classList.remove('fade-out'); // Remove fade-out class
        }, 500);
    });
};

solve.onclick = function () {

    if (fillBoard()) {
        solveSudoku();
    }
};
