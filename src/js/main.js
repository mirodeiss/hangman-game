import '../css/style.css'
import { darkModeHandle } from './utils';
import { startGame } from './game';
darkModeHandle()
// start game button
const startGameButton = document.getElementById('startGame')
startGameButton.addEventListener('click', startGame)