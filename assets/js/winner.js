/**
 * Winner checking logic for Tic-Tac-Toe
 */

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner(blocks) {
    for (let combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (blocks[a] && blocks[a] === blocks[b] && blocks[a] === blocks[c]) {
            return {
                winner: blocks[a],
                combo: combo
            };
        }
    }

    if (blocks.every(cell => cell !== '' && cell !== null && cell !== undefined)) {
        return {
            winner: 'Draw',
            combo: null
        };
    }

    return null; // Game still running
}
