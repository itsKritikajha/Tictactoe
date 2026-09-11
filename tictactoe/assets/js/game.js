/**
 * Game Engine for Tic-Tac-Toe (TwoPlayer and AIPlayer)
 */

class TwoPlayer {
    constructor() {
        this.cells = document.querySelectorAll('.cell');
        this.message = document.querySelector('.message p');
        this.resetBtn = document.getElementById('reset');
        this.mode = 'X'; // Current player symbol
        this.blocks = ['', '', '', '', '', '', '', '', ''];
        this.isGameOver = false;

        this.#addEventListeners();
    }

    #addEventListeners() {
        const cells = this.cells;
        const message = this.message;
        const reset = this.resetBtn;
        
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const index = Array.from(cells).indexOf(cell);
                this.makeMove(index, cell);
            });
        });

        if (reset) {
            reset.addEventListener('click', () => this.resetGame());
        }
    }

    makeMove(index, cell) {
        if (this.isGameOver || this.blocks[index] !== '') return;

        // Store current player symbol in blocks array
        this.blocks[index] = this.mode;

        // Put symbol inside cell and add class
        cell.innerHTML = `<span>${this.mode}</span>`;
        cell.classList.add(this.mode.toLowerCase());

        // Check for winner after move
        const result = checkWinner(this.blocks);

        if (result) {
            this.handleGameEnd(result);
        } else {
            // Switch player
            this.mode = this.mode === 'X' ? 'O' : 'X';
            if (this.message) {
                this.message.textContent = `Player ${this.mode}'s turn`;
            }
        }
    }

    handleGameEnd(result) {
        this.isGameOver = true;
        const { winner, combo } = result;

        if (winner === 'Draw') {
            if (this.message) this.message.textContent = "It's a Draw!";
        } else {
            if (this.message) this.message.textContent = `Player ${winner} Wins!`;
            if (combo) {
                combo.forEach(idx => {
                    if (this.cells[idx]) {
                        this.cells[idx].classList.add('winner-cell');
                    }
                });
            }
        }
        
        if (typeof showConfetti === 'function' && winner !== 'Draw') {
            showConfetti();
        }
    }

    resetGame() {
        this.blocks = ['', '', '', '', '', '', '', '', ''];
        this.mode = 'X';
        this.isGameOver = false;

        if (this.message) {
            this.message.textContent = "Player X's turn";
        }

        this.cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x', 'o', 'winner-cell');
        });
    }
}

class AIPlayer extends TwoPlayer {
    constructor(aiSymbol = 'O') {
        super();
        this.aiSymbol = aiSymbol;
        this.humanSymbol = aiSymbol === 'O' ? 'X' : 'O';
    }

    makeMove(index, cell) {
        if (this.isGameOver || this.blocks[index] !== '' || this.mode !== this.humanSymbol) return;

        // Human move
        super.makeMove(index, cell);

        // If game not over after human move, trigger AI move
        if (!this.isGameOver && this.mode === this.aiSymbol) {
            setTimeout(() => this.makeAIMove(), 400);
        }
    }

    makeAIMove() {
        if (this.isGameOver) return;

        const bestIndex = this.getBestMove();
        if (bestIndex !== -1 && this.cells[bestIndex]) {
            const cell = this.cells[bestIndex];
            super.makeMove(bestIndex, cell);
        }
    }

    getBestMove() {
        let bestScore = -Infinity;
        let move = -1;

        for (let i = 0; i < 9; i++) {
            if (this.blocks[i] === '') {
                this.blocks[i] = this.aiSymbol;
                let score = this.minimax(this.blocks, 0, false);
                this.blocks[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    minimax(board, depth, isMaximizing) {
        const result = checkWinner(board);
        if (result) {
            if (result.winner === this.aiSymbol) return 10 - depth;
            if (result.winner === this.humanSymbol) return depth - 10;
            if (result.winner === 'Draw') return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.aiSymbol;
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.humanSymbol;
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
}
