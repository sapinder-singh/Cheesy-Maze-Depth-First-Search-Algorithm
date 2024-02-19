import { handleGestureStart, handleKeyDown } from './eventHandlers.js';
import { Canvas, FormSelect } from './index.js';
import Maze from './mazeContainer.js';

let completionBox = document.querySelector('.game-complete');
let restartButton = document.querySelector('#restart');

export default class Game {
  static #gridOrder;
  static context;
  maze;
  player;

  constructor() {
    this.gridOrder = FormSelect.value;
    this.context = Canvas.getContext('2d');
  }

  set gridOrder(value) {
    Game.#gridOrder = parseInt(value);
  }

  get gridOrder() {
    return Game.#gridOrder;
  }

  setOrder(value) {
    this.gridOrder = value;
  }

  initiate() {
    this.maze = new Maze(this.context);
    this.maze.setup();
    this.player = this.maze.player;
    this.listenMoves();
  }

  listenMoves() {
    window.addEventListener('keydown', handleKeyDown);
    Canvas.addEventListener('touchstart', handleGestureStart);
    Canvas.addEventListener('mousedown', handleGestureStart);
  }

  unListenMoves() {
    window.removeEventListener('keydown', handleKeyDown);
    Canvas.removeEventListener('touchstart', handleGestureStart);
    Canvas.removeEventListener('mousedown', handleGestureStart);
  }

  checkCompletion() {
    let reachedCol = this.player.colNum === this.maze.goal.colNum;
    let reachedRow = this.player.rowNum === this.maze.goal.rowNum;

    if (reachedRow && reachedCol) {
      this.unListenMoves();
      this.gameComplete();
    }
  }

  gameComplete() {
    document.querySelector('.game-complete .steps-count').innerText = String(
      this.player.stepCount
    );

    completionBox.classList.add('show');
    restartButton.addEventListener('click', this.restart);
  }

  restart() {
    completionBox.classList.remove('show');
    this.initiate();
    document.querySelector('.game-complete h2').innerText = '';

    restartButton.removeEventListener('click', this.restart);
  }
}