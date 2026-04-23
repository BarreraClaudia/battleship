import { Player } from '../Player';
import { GameBoard } from '../GameBoard';

test('player has a game board', () => {
  let player = new Player();
  expect(player.playerBoard).toBeInstanceOf(GameBoard);
});

test("computer's random attack hits a valid coordinate (0-9)", () => {
  let player = new Player();
  let [x, y] = player.computerRandomAttack();

  expect(x).toBeGreaterThanOrEqual(0);
  expect(x).toBeLessThan(10);

  expect(y).toBeGreaterThanOrEqual(0);
  expect(y).toBeLessThan(10);
});

test('computer attacks do not hit the same cell', () => {
  let player = new Player();

  let oneHundredAttacks = [];

  while (oneHundredAttacks.length < 100) {
    oneHundredAttacks.push(player.computerRandomAttack().toString());
  }

  let noRepeats = new Set(oneHundredAttacks).size === oneHundredAttacks.length;

  expect(noRepeats).toBe(true);
});
