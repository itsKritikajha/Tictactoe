# Welcome - Tic Tac Toe

A modern, responsive, visually stunning Tic Tac Toe web application featuring dark mode, glassmorphism design, interactive sound effects (SFX), minimax AI algorithm, and smooth animations.

---

## 🌟 Features

- **Multiple Game Modes**:
  - **2 Players**: Play locally with a friend on the same device.
  - **VS AI (Easy)**: Casual AI that makes random valid moves.
  - **VS AI (Hard)**: Unbeatable Minimax AI algorithm that challenges your strategy.
- **Visual Excellence & Aesthetics**:
  - Preloader animation screen (`loader-overlay`).
  - Dark mode glassmorphism UI with custom gradients.
  - Dynamic strike-through SVG line animation upon victory.
  - Custom neon glowing tokens for **X** (cyan) and **O** (rose magenta).
  - Celebration dialog modal with animated trophies.
- **Audio Synthesizer (SFX)**:
  - Custom Web Audio API sound generator for moves, wins, and draws (no external audio assets needed).
  - Mute/Unmute audio control toggle.
- **Theme & Score Persistence**:
  - Seamless Light/Dark theme switcher.
  - Scoreboard tracking (Player X, Player O, Ties) saved in `localStorage`.

---

## 📂 Project Structure

```
├── index.html       # HTML5 structure with loader overlay, scoreboard, grid, and modal
├── style.css        # Vanilla CSS3 design system, dark/light themes & glassmorphism
├── script.js        # Game logic, Minimax AI, Web Audio synthesizer, and score tracking
└── readme.md        # Documentation and project overview
```

---

## 🚀 How to Run

1. Open `index.html` directly in any web browser (Chrome, Firefox, Edge, Safari).
2. Alternatively, serve via VS Code **Live Server** extension (or `npx serve .`).
3. Enjoy the game!

---

## 🛠️ Built With

- **HTML5** - Semantic markup
- **CSS3** - Glassmorphism, animations, CSS grid & flexbox
- **JavaScript (ES6+)** - Game engine & Minimax AI
- **Font Awesome 6.5.1** - Modern vector icons
