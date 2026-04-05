import './styles/styles.css';
import { greeting } from './modules/greeting.js';
import iconSrc from './assets/imgs/icon.png';

console.log(greeting);

const icon = document.createElement('img');
icon.src = iconSrc;

document.body.appendChild(icon);
