# Battleship

A browser-based Battleship game built with vanilla JavaScript.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript) ![Webpack](https://img.shields.io/badge/Webpack-5-blue?style=flat-square&logo=webpack) ![Jest](https://img.shields.io/badge/Jest-30-green?style=flat-square&logo=jest)

## Features

- **Interactive ship placement** — place your fleet before the game begins, with live hover preview showing valid (green) and invalid (red) positions
- **Direction toggle** — rotate ships between horizontal and vertical with a single click
- **Computer AI** — the computer makes random attacks and never hits the same cell twice
- **Hit & miss animations** — visual feedback with 💥 and 💧 emojis for hits and misses
- **Sound effects** — synthesized audio for hits, misses, and victory
- **Game over dialog** — displays the winner with a Play Again button
- **Restart** — reset the game at any time

## Built With

- Vanilla JavaScript (ES6+)
- Webpack + Babel
- Jest for unit testing
- CSS Grid for board layout
- Web Audio API for sound effects

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
git clone https://github.com/BarreraClaudia/battleship.git
cd battleship
npm install
```

### Development

```bash
npm run dev
```

Opens the game in your browser with hot reloading.

### Production Build

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## Deploy to GitHub Pages

Make sure you have all your work committed/pushed on main branch `git status`

Make sure you have a gh-pages branch `git branch gh-pages`

```
  git checkout gh-pages && git merge main --no-edit

  npm run build

  git add dist -f && git commit -m "Deployment commit"

  npm run deploy

  git checkout main
```

Note: Recall that the source branch for GitHub Pages is set in your repository’s settings. Get this changed to the gh-pages branch.

## Testing

The core game logic was built using Test-Driven Development (TDD) with Jest. Tests cover:

- **Ship** — hit tracking, sunk detection
- **GameBoard** — ship placement, overlap detection, out of bounds detection, attack handling, all-sunk detection
- **Player** — gameboard initialization, valid random attack coordinates, no repeated attacks

## Project Structure

```
src/
├── modules/
│   ├── __tests__/
│   │   ├── Ship.test.js
│   │   ├── GameBoard.test.js
│   │   └── Player.test.js
│   ├── Ship.js          # Ship class
│   ├── GameBoard.js     # GameBoard class
│   ├── Player.js        # Player class
│   └── UI.js            # DOM rendering and game loop
├── styles/
│   └── styles.css
├── template.html
└── index.js
```

## How to Play

1. **Place your ships** — click cells on your board to place each ship. Use the Rotate button to switch direction. Green preview = valid, red = invalid.
2. **Attack** — once all 5 ships are placed, click cells on the enemy board to attack.
3. **Win** — sink all 5 enemy ships before the computer sinks yours!

### Your Fleet

| Ship        | Length |
| ----------- | ------ |
| Carrier     | 5      |
| Battleship  | 4      |
| Destroyer   | 3      |
| Submarine   | 3      |
| Patrol Boat | 2      |
