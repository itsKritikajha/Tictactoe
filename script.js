// Tic Tac Toe - Modern Game Logic

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loaderOverlay = document.getElementById('loaderOverlay');
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('statusText');
    const statusBanner = document.getElementById('statusBanner');
    const scoreXEl = document.getElementById('scoreX');
    const scoreOEl = document.getElementById('scoreO');
    const scoreTiesEl = document.getElementById('scoreTies');
    const cardX = document.getElementById('cardX');
    const cardO = document.getElementById('cardO');
    const restartBtn = document.getElementById('restartBtn');
    const resetScoreBtn = document.getElementById('resetScoreBtn');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const strikeLine = document.getElementById('strikeLine');
    const linePath = document.getElementById('linePath');
    const resultModal = document.getElementById('resultModal');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const playAgainBtn = document.getElementById('playAgainBtn');

    // Game Variables
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let gameMode = 'pvp'; // 'pvp', 'ai-easy', 'ai-hard'
    let isSoundMuted = false;
    let scores = { X: 0, O: 0, ties: 0 };

    // Winning Combinations
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- Web Audio Synthesizer for SFX ---
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(type) {
        if (isSoundMuted || !audioCtx) return;
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'move-x') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'move-o') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'win') {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const noteOsc = audioCtx.createOscillator();
                const noteGain = audioCtx.createGain();
                noteOsc.connect(noteGain);
                noteOsc.connect(audioCtx.destination);
                noteOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
                noteGain.gain.setValueAtTime(0.2, now + idx * 0.1);
                noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.2);
                noteOsc.start(now + idx * 0.1);
                noteOsc.stop(now + idx * 0.1 + 0.2);
            });
        } else if (type === 'draw') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.3);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    }

    // --- Loader Overlay Fade ---
    setTimeout(() => {
        if (loaderOverlay) {
            loaderOverlay.classList.add('fade-out');
        }
    }, 800);

    // --- Local Storage for Scores ---
    function loadSavedScores() {
        const saved = localStorage.getItem('ttt_scores');
        if (saved) {
            try {
                scores = JSON.parse(saved);
                updateScoreDisplay();
            } catch (e) {
                console.error("Could not load scores", e);
            }
        }
    }

    function saveScores() {
        localStorage.setItem('ttt_scores', JSON.stringify(scores));
        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        scoreXEl.textContent = scores.X;
        scoreOEl.textContent = scores.O;
        scoreTiesEl.textContent = scores.ties;
    }

    // --- Turn Highlight ---
    function updateTurnUI() {
        if (currentPlayer === 'X') {
            cardX.classList.add('active-turn');
            cardO.classList.remove('active-turn');
            statusText.textContent = gameMode.startsWith('ai') ? "Your Turn (X)" : "Player X's Turn";
        } else {
            cardO.classList.add('active-turn');
            cardX.classList.remove('active-turn');
            statusText.textContent = gameMode.startsWith('ai') ? "AI Thinking (O)..." : "Player O's Turn";
        }
    }

    // --- Handle Cell Click ---
    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (board[index] !== '' || !isGameActive) return;

        makeMove(index, currentPlayer);

        if (isGameActive && gameMode.startsWith('ai') && currentPlayer === 'O') {
            setTimeout(makeAIMove, 400);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        const cell = cells[index];
        cell.classList.add('taken', player.toLowerCase());
        
        const icon = document.createElement('i');
        if (player === 'X') {
            icon.className = 'fa-solid fa-xmark';
            playSound('move-x');
        } else {
            icon.className = 'fa-regular fa-circle';
            playSound('move-o');
        }
        cell.appendChild(icon);

        checkResult();
    }

    // --- Check Winner / Draw ---
    function checkResult() {
        let roundWon = false;
        let winningCombo = null;

        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                winningCombo = winConditions[i];
                break;
            }
        }

        if (roundWon) {
            handleWin(winningCombo);
            return;
        }

        if (!board.includes('')) {
            handleDraw();
            return;
        }

        // Switch turn
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnUI();
    }

    function handleWin(combo) {
        isGameActive = false;
        scores[currentPlayer]++;
        saveScores();

        // Highlight cells
        combo.forEach(idx => {
            cells[idx].classList.add('win-highlight');
        });

        // Draw strike line
        drawStrikeLine(combo);

        playSound('win');

        setTimeout(() => {
            showModal(
                '<i class="fa-solid fa-trophy"></i>',
                `${currentPlayer === 'X' ? 'Player X' : (gameMode.startsWith('ai') ? 'AI' : 'Player O')} Wins!`,
                `Congratulations! ${currentPlayer} took this round.`
            );
        }, 600);
    }

    function handleDraw() {
        isGameActive = false;
        scores.ties++;
        saveScores();

        playSound('draw');

        setTimeout(() => {
            showModal(
                '<i class="fa-solid fa-handshake"></i>',
                'It\'s a Draw!',
                'Well played! Neither player gave up an inch.'
            );
        }, 500);
    }

    // --- Draw Strike Line SVG ---
    function drawStrikeLine(combo) {
        const boardRect = document.getElementById('gameBoard').getBoundingClientRect();
        const firstCellRect = cells[combo[0]].getBoundingClientRect();
        const lastCellRect = cells[combo[2]].getBoundingClientRect();

        const x1 = firstCellRect.left + firstCellRect.width / 2 - boardRect.left;
        const y1 = firstCellRect.top + firstCellRect.height / 2 - boardRect.top;
        const x2 = lastCellRect.left + lastCellRect.width / 2 - boardRect.left;
        const y2 = lastCellRect.top + lastCellRect.height / 2 - boardRect.top;

        linePath.setAttribute('x1', x1);
        linePath.setAttribute('y1', y1);
        linePath.setAttribute('x2', x2);
        linePath.setAttribute('y2', y2);

        strikeLine.classList.add('draw');
    }

    function clearStrikeLine() {
        linePath.setAttribute('x1', 0);
        linePath.setAttribute('y1', 0);
        linePath.setAttribute('x2', 0);
        linePath.setAttribute('y2', 0);
        strikeLine.classList.remove('draw');
    }

    // --- AI Logic ---
    function makeAIMove() {
        if (!isGameActive) return;

        let moveIndex;
        if (gameMode === 'ai-easy') {
            moveIndex = getRandomMove();
        } else {
            moveIndex = getBestMinimaxMove();
        }

        if (moveIndex !== null && moveIndex !== undefined) {
            makeMove(moveIndex, 'O');
        }
    }

    function getRandomMove() {
        const available = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
        if (available.length === 0) return null;
        return available[Math.floor(Math.random() * available.length)];
    }

    function getBestMinimaxMove() {
        let bestScore = -Infinity;
        let bestMove = null;

        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        return bestMove;
    }

    function minimax(tempBoard, depth, isMaximizing) {
        const result = checkBoardState(tempBoard);
        if (result === 'O') return 10 - depth;
        if (result === 'X') return depth - 10;
        if (result === 'tie') return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (tempBoard[i] === '') {
                    tempBoard[i] = 'O';
                    let score = minimax(tempBoard, depth + 1, false);
                    tempBoard[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (tempBoard[i] === '') {
                    tempBoard[i] = 'X';
                    let score = minimax(tempBoard, depth + 1, true);
                    tempBoard[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkBoardState(b) {
        for (let i = 0; i < winConditions.length; i++) {
            const [x, y, z] = winConditions[i];
            if (b[x] && b[x] === b[y] && b[x] === b[z]) {
                return b[x];
            }
        }
        if (!b.includes('')) return 'tie';
        return null;
    }

    // --- Restart / Reset Board ---
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        isGameActive = true;
        
        cells.forEach(cell => {
            cell.className = 'cell';
            cell.innerHTML = '';
        });

        clearStrikeLine();
        updateTurnUI();
        resultModal.classList.remove('active');
    }

    function resetAllScores() {
        scores = { X: 0, O: 0, ties: 0 };
        saveScores();
        resetGame();
    }

    // --- Modal Controls ---
    function showModal(iconHtml, titleText, msgText) {
        modalIcon.innerHTML = iconHtml;
        modalTitle.textContent = titleText;
        modalMessage.textContent = msgText;
        resultModal.classList.add('active');
    }

    // --- Event Listeners ---
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    restartBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', resetGame);
    resetScoreBtn.addEventListener('click', resetAllScores);

    // Mode Selector
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameMode = btn.getAttribute('data-mode');
            resetGame();
        });
    });

    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        themeToggleBtn.querySelector('i').className = newTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });

    // Sound Toggle
    soundToggleBtn.addEventListener('click', () => {
        isSoundMuted = !isSoundMuted;
        soundToggleBtn.querySelector('i').className = isSoundMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    });

    // Initialize
    loadSavedScores();
    updateTurnUI();
});
