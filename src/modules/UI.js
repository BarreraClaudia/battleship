import { Player } from './Player';
import { Ship } from './Ship';

// ================================
// Constants
// ================================

const SHIP_NAMES = [
  'Carrier',
  'Battleship',
  'Destroyer',
  'Submarine',
  'Patrol Boat',
];
const SHIP_LENGTHS = [5, 4, 3, 3, 2];

// ================================
// State
// ================================

let gameOver = false;
let humanPlayer;
let computerPlayer;
let playerBoardContainer;
let computerBoardContainer;
let ships;
let currentShipIndex;
let currentDirection;

// ================================
// Audio
// ================================

const playSound = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  if (type === 'hit') {
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      40,
      ctx.currentTime + 0.3
    );
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
  } else if (type === 'miss') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      300,
      ctx.currentTime + 0.2
    );
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  } else if (type === 'win') {
    [261, 329, 392, 523].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.15 + 0.3
      );
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.3);
    });
  }
};

// ================================
// Rendering
// ================================

const renderBoard = (board, containerElement, hideShips = false) => {
  containerElement.innerHTML = '';

  board.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      let cellDiv = document.createElement('div');

      cellDiv.dataset.row = rowIndex;
      cellDiv.dataset.col = colIndex;

      let cellState = board[rowIndex][colIndex];

      cellDiv.classList.add('cell');

      if (cellState === 'miss') {
        cellDiv.classList.add('miss');
      } else if (cellState instanceof Ship && !hideShips) {
        cellDiv.classList.add('ship');
      } else if (cellState === 'hit') {
        cellDiv.classList.add('hit');
      }

      containerElement.appendChild(cellDiv);
    });
  });

  return containerElement;
};

const updateCell = (containerElement, row, col, state, hideShips = false) => {
  const cell = containerElement.querySelector(
    `[data-row="${row}"][data-col="${col}"]`
  );
  if (!cell) return;

  if (state === 'miss') cell.classList.add('miss');
  else if (state === 'hit') cell.classList.add('hit');
  else if (state instanceof Ship && !hideShips) cell.classList.add('ship');
};

const updatePlacementInfo = () => {
  const info = document.querySelector('#placement-info');

  if (currentShipIndex === ships.length) {
    info.textContent = 'Game started! Attack the enemy board!';
    return;
  }

  info.textContent = `Place your ${SHIP_NAMES[currentShipIndex]} (length ${ships[currentShipIndex].shipLength})`;
};

// ================================
// Ship Placement
// ================================

const clearPreview = () => {
  document.querySelectorAll('.preview, .preview-invalid').forEach((cell) => {
    cell.classList.remove('preview', 'preview-invalid');
  });
};

const handlePlacementPreview = (e) => {
  if (!e.target.classList.contains('cell')) return;

  clearPreview();

  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);
  const shipLength = ships[currentShipIndex].shipLength;

  let isValid = true;
  for (let i = 0; i < shipLength; i++) {
    const previewRow = currentDirection === 'vertical' ? row + i : row;
    const previewCol = currentDirection === 'horizontal' ? col + i : col;
    const cell = playerBoardContainer.querySelector(
      `[data-row="${previewRow}"][data-col="${previewCol}"]`
    );
    if (!cell || cell.classList.contains('ship')) {
      isValid = false;
      break;
    }
  }

  for (let i = 0; i < shipLength; i++) {
    const previewRow = currentDirection === 'vertical' ? row + i : row;
    const previewCol = currentDirection === 'horizontal' ? col + i : col;
    const cell = playerBoardContainer.querySelector(
      `[data-row="${previewRow}"][data-col="${previewCol}"]`
    );
    if (cell) cell.classList.add(isValid ? 'preview' : 'preview-invalid');
  }
};

const handlePlacement = (e) => {
  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  try {
    humanPlayer.playerBoard.placeShip(
      ships[currentShipIndex],
      [row, col],
      currentDirection
    );

    currentShipIndex++;
    renderBoard(humanPlayer.playerBoard.board, playerBoardContainer);
    updatePlacementInfo();

    if (currentShipIndex === ships.length) startGame();
  } catch (e) {
    return;
  }
};

const placementClickHandler = (e) => {
  if (e.target.classList.contains('cell')) handlePlacement(e);
};

// ================================
// Game Loop
// ================================

const handleHumanAttack = (e) => {
  if (gameOver) return;

  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);

  const cellState = computerPlayer.playerBoard.board[row][col];
  if (cellState === 'miss' || cellState === 'hit') return;

  computerPlayer.playerBoard.receiveAttack([row, col]);

  const wasHit = computerPlayer.playerBoard.board[row][col] === 'hit';
  playSound(wasHit ? 'hit' : 'miss');

  updateCell(
    computerBoardContainer,
    row,
    col,
    computerPlayer.playerBoard.board[row][col],
    true
  );

  if (computerPlayer.playerBoard.allSunk()) {
    gameOverDialog('Human');
    gameOver = true;
    return;
  }

  // delay computer attack
  setTimeout(() => {
    const computerAttack = computerPlayer.computerRandomAttack();
    humanPlayer.playerBoard.receiveAttack(computerAttack);

    const [compRow, compCol] = computerAttack;
    updateCell(
      playerBoardContainer,
      compRow,
      compCol,
      humanPlayer.playerBoard.board[compRow][compCol]
    );

    if (humanPlayer.playerBoard.allSunk()) {
      gameOverDialog('Computer');
      gameOver = true;
    }
  }, 600);
};

const humanAttackClickHandler = (e) => {
  if (e.target.classList.contains('cell')) handleHumanAttack(e);
};

const gameOverDialog = (winner) => {
  const dialog = document.createElement('dialog');
  dialog.textContent = `Game over! ${winner} wins!!`;

  const restartBtn = document.createElement('button');
  restartBtn.textContent = 'Play Again';
  restartBtn.addEventListener('click', () => restartGame());

  dialog.appendChild(restartBtn);
  document.body.appendChild(dialog);
  dialog.showModal();

  playSound('win');
};

// ================================
// Game Lifecycle
// ================================

const startPlacementPhase = () => {
  humanPlayer = new Player();
  computerPlayer = new Player();

  playerBoardContainer = document.querySelector('#human-board');
  computerBoardContainer = document.querySelector('#computer-board');

  renderBoard(humanPlayer.playerBoard.board, playerBoardContainer);
  renderBoard(computerPlayer.playerBoard.board, computerBoardContainer, true);

  playerBoardContainer.addEventListener('mouseover', handlePlacementPreview);
  playerBoardContainer.addEventListener('mouseout', clearPreview);
  playerBoardContainer.addEventListener('click', placementClickHandler);

  updatePlacementInfo();
};

const startGame = () => {
  playerBoardContainer.removeEventListener('mouseover', handlePlacementPreview);
  playerBoardContainer.removeEventListener('mouseout', clearPreview);
  playerBoardContainer.removeEventListener('click', placementClickHandler);

  computerPlayer.playerBoard.placeShip(new Ship(5), [0, 3], 'horizontal');
  computerPlayer.playerBoard.placeShip(new Ship(4), [2, 6], 'vertical');
  computerPlayer.playerBoard.placeShip(new Ship(3), [5, 0], 'horizontal');
  computerPlayer.playerBoard.placeShip(new Ship(3), [7, 7], 'vertical');
  computerPlayer.playerBoard.placeShip(new Ship(2), [9, 2], 'horizontal');

  computerBoardContainer.addEventListener('click', humanAttackClickHandler);
};

const restartGame = () => {
  gameOver = false;
  currentShipIndex = 0;
  currentDirection = 'horizontal';
  ships = SHIP_LENGTHS.map((length) => new Ship(length));

  computerBoardContainer.removeEventListener('click', humanAttackClickHandler);

  const existingDialog = document.querySelector('dialog');
  if (existingDialog) existingDialog.remove();

  startPlacementPhase();
};

// ================================
// Initialization
// ================================

const toggleDirectionBtn = document.querySelector('#toggle-direction');
toggleDirectionBtn.addEventListener('click', () => {
  currentDirection =
    currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
});

const restartBtn = document.querySelector('#restart');
restartBtn.addEventListener('click', () => restartGame());

export const initGame = () => {
  currentShipIndex = 0;
  currentDirection = 'horizontal';
  ships = SHIP_LENGTHS.map((length) => new Ship(length));
  startPlacementPhase();
};
