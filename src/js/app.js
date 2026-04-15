import { player } from './player.js';
import { storage } from './storage.js';
import { CONFIG } from '../config.js';
import { showNotification, showPage, renderAll, playlistUI, initMediaSession } from './ui.js';

function setupEventListeners() {
  document.getElementById('seekBar').addEventListener('input', (e) => player.seek(e.target.value));
  document.getElementById('volumeSlider').addEventListener('input', (e) => player.setVolume(e.target.value));
  document.getElementById('searchInput').addEventListener('input', () => {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (query) {
      document.getElementById('searchCategories').classList.add('hidden');
      document.getElementById('searchResultsContainer').classList.remove('hidden');
      window.renderSongs('searchResults', song => 
        song.name.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
      );
    } else {
      document.getElementById('searchCategories').classList.remove('hidden');
      document.getElementById('searchResultsContainer').classList.add('hidden');
    }
  });

  setupKeyboardShortcuts();

  window.addEventListener('beforeunload', () => {
    if (player.currentIndex !== null && player.audio.currentTime > 0) {
      storage.saveLastPlayed(player.currentIndex, player.audio.currentTime);
    }
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        player.togglePlay();
        break;
      case 'ArrowRight':
        if (e.ctrlKey) { e.preventDefault(); player.next(); }
        break;
      case 'ArrowLeft':
        if (e.ctrlKey) { e.preventDefault(); player.prev(); }
        break;
      case 'ArrowUp':
        if (e.ctrlKey) {
          e.preventDefault();
          const vol = Math.min(100, player.audio.volume * 100 + 10);
          document.getElementById('volumeSlider').value = vol;
          player.setVolume(vol);
        }
        break;
      case 'ArrowDown':
        if (e.ctrlKey) {
          e.preventDefault();
          const vol = Math.max(0, player.audio.volume * 100 - 10);
          document.getElementById('volumeSlider').value = vol;
          player.setVolume(vol);
        }
        break;
    }
  });
}

function initApp() {
  player.audio = document.getElementById('audio');
  player.init();
  setupEventListeners();

  player.setVolume(CONFIG.AUDIO.DEFAULT_VOLUME);
  document.getElementById('volumeSlider').value = CONFIG.AUDIO.DEFAULT_VOLUME;

  const hasLastSong = player.restoreLastPlayed();

  if (!hasLastSong) {
    setTimeout(() => showNotification('Welcome! Select a song to start.'), 3000);
  }

  renderAll();
  showPage('home');
  initMediaSession();

  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.transform = 'scale(0.8)';
      setTimeout(() => splash.remove(), 1000);
    }
  }, CONFIG.UI.SPLASH_DURATION);

  setTimeout(() => {
    document.querySelectorAll('.song-card').forEach((card, i) => {
      card.style.animationDelay = `${i * CONFIG.UI.ANIMATION_DELAY}ms`;
      card.classList.add('animate-fade-in');
    });
  }, CONFIG.UI.SPLASH_DURATION + 1000);
}

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW registration failed'));
  });
}

window.addEventListener('DOMContentLoaded', initApp);

export { initApp };
