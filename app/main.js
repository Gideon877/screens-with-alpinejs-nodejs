import './style.css';
import App from './app';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.data('app', App)

Alpine.start();