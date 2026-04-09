function setupEventListeners() {
  seekBar.addEventListener('input', (e) => {
    seekTo(e.target.value);
  });

  volumeSlider.addEventListener('input', (e) => {
    setVolume(e.target.value);
  });

  document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query) {
      document.getElementById('searchCategories').classList.add('hidden');
      document.getElementById('searchResultsContainer').classList.remove('hidden');

      renderSongs("searchResults", song =>
        song.name.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
      );
    } else {
      document.getElementById('searchCategories').classList.remove('hidden');
      document.getElementById('searchResultsContainer').classList.add('hidden');
    }
  });

  setupKeyboardShortcuts();

  audio.addEventListener('pause', () => {
    if (currentIndex !== null && audio.currentTime > 0) {
      saveLastPlayedSong(currentIndex);
    }
  });

  window.addEventListener('beforeunload', () => {
    if (currentIndex !== null && audio.currentTime > 0) {
      saveLastPlayedSong(currentIndex);
    }
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowRight':
        if (e.ctrlKey) {
          e.preventDefault();
          nextSong();
        }
        break;
      case 'ArrowLeft':
        if (e.ctrlKey) {
          e.preventDefault();
          prevSong();
        }
        break;
      case 'ArrowUp':
        if (e.ctrlKey) {
          e.preventDefault();
          const currentVolume = Math.min(100, audio.volume * 100 + 10);
          volumeSlider.value = currentVolume;
          setVolume(currentVolume);
        }
        break;
      case 'ArrowDown':
        if (e.ctrlKey) {
          e.preventDefault();
          const currentVolume = Math.max(0, audio.volume * 100 - 10);
          volumeSlider.value = currentVolume;
          setVolume(currentVolume);
        }
        break;
    }
  });
}

function initApp() {
  initStorage();
  initPlayer();
  setupEventListeners();

  setVolume(50);
  volumeSlider.value = 50;

  const hasLastSong = loadLastPlayedSong();

  if (!hasLastSong) {
    setTimeout(() => {
      showNotification('Welcome back! Select a song to start listening.');
    }, 3000);
  }

  renderAll();
  showPage('home');
  initializeMediaSession();

  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.style.opacity = '0';
      splash.style.transform = 'scale(0.8)';
      setTimeout(() => {
        splash.remove();
      }, 1000);
    }
  }, 2500);

  setTimeout(() => {
    document.querySelectorAll('.song-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-fade-in');
    });
  }, 3500);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
}

window.addEventListener('DOMContentLoaded', initApp);
