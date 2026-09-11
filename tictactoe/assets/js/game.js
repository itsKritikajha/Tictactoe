/**
 * Game Engine for Tic-Tac-Toe (TwoPlayer and AIPlayer)
 */

class TwoPlayer {
    constructor() {
        this.cells = document.querySelectorAll('.cell');
        this.message = document.querySelector('.message p');
        this.resetBtn = document.getElementById('reset');
        this.mode = 'x';
        this.blocks = ['', '', '', '', '', '', '', '', ''];
        this.isGameOver = false;

        this.#showTictactoe();
        this.#addEventListeners();
    }

    #hideTicTacToe() {
        let tictactoe = document.querySelector('.tictactoe');
        if (tictactoe) {
            tictactoe.style.display = 'none';
        }
    }

    #showTictactoe() {
        let tictactoe = document.querySelector('.tictactoe');
        if (tictactoe) {
            tictactoe.style.display = 'grid';
        }
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
            reset.addEventListener('click', () => {
                cells.forEach((cell, index) => {
                    cell.innerHTML = '';
                    cell.className = 'cell'; // Clears x, o, and winner-cell classes completely
                    this.blocks[index] = '';
                });

                this.mode = 'x';
                this.isGameOver = false;

                if (message) {
                    message.innerHTML = `Player ${this.mode.toUpperCase()}'s turn`;
                }

                if (typeof stopConfetti === 'function') {
                    stopConfetti();
                }

                this.#showTictactoe();
            });
        }
    }

    makeMove(index, cell) {
        if (this.isGameOver || this.blocks[index] !== '') return;

        // Store current player's symbol in blocks array
        this.blocks[index] = this.mode;

        // Put X/O inside cell and add class
        cell.innerHTML = `<span>${this.mode.toUpperCase()}</span>`;
        cell.classList.add(this.mode.toLowerCase());

        // Check for winner after move
        const result = typeof checkWinner === 'function' ? checkWinner(this.blocks) : null;

        if (result) {
            this.handleGameEnd(result);
        } else {
            // Switch current player
            this.mode = this.mode === 'x' ? 'o' : 'x';
            if (this.message) {
                this.message.innerHTML = `Player ${this.mode.toUpperCase()}'s turn`;
            }
        }
    }

    handleGameEnd(result) {
        this.isGameOver = true;
        const { winner, combo } = result;

        if (winner === 'Draw' || winner === 'draw') {
            if (this.message) this.message.innerHTML = "It's a Draw!";
        } else {
            if (this.message) this.message.innerHTML = `Player ${winner.toUpperCase()} Wins!`;
            if (combo) {
                combo.forEach(idx => {
                    if (this.cells[idx]) {
                        this.cells[idx].classList.add('winner-cell');
                    }
                });
            }
        }

        if (typeof showConfetti === 'function' && winner !== 'Draw' && winner !== 'draw') {
            showConfetti();
        }
    }
}

class AIPlayer extends TwoPlayer {
    constructor(aiSymbol = 'o') {
        super();
        this.aiSymbol = aiSymbol.toLowerCase();
        this.humanSymbol = this.aiSymbol === 'o' ? 'x' : 'o';
    }

    makeMove(index, cell) {
        if (this.isGameOver || this.blocks[index] !== '' || this.mode !== this.humanSymbol) return;

        super.makeMove(index, cell);

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
        const result = typeof checkWinner === 'function' ? checkWinner(board) : null;
        if (result) {
            const w = result.winner ? result.winner.toLowerCase() : '';
            if (w === this.aiSymbol) return 10 - depth;
            if (w === this.humanSymbol) return depth - 10;
            if (w === 'draw') return 0;
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
