function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-spotify-green text-black px-4 py-2 rounded-lg z-50 animate-fade-in';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function showPage(page) {
  ['homePage', 'searchPage', 'libraryPage'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });

  document.getElementById(page + 'Page').classList.remove('hidden');

  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.getElementById(page + 'Btn')?.classList.add('active');

  if (page === 'home') {
    renderHomePage();
  } else if (page === 'search') {
    renderSearchPage();
  } else if (page === 'library') {
    renderLibraryPage();
  }
}

function renderSongs(containerId, filterFn = () => true, layout = 'grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const filteredSongs = songs.filter(filterFn);

  filteredSongs.forEach((song) => {
    const originalIndex = songs.indexOf(song);
    const isLiked = likes.includes(song.src);
    const el = document.createElement('div');

    if (layout === 'list') {
      el.className = "flex items-center gap-4 p-3 rounded-lg hover:bg-spotify-light transition-all duration-200 cursor-pointer group";
      el.innerHTML = `
        <img src="${song.cover}" class="w-12 h-12 rounded">
        <div class="flex-1 min-w-0">
          <div class="font-medium truncate">${song.name}</div>
          <div class="text-sm text-gray-400 truncate">${song.artist}</div>
        </div>
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="event.stopPropagation(); toggleLike(${originalIndex})" class="p-2 hover:bg-spotify-gray rounded-full">
            <i class="${isLiked ? 'fas fa-heart text-spotify-green' : 'far fa-heart'}"></i>
          </button>
          <button onclick="event.stopPropagation(); openPlaylistModal(${originalIndex})" class="p-2 hover:bg-spotify-gray rounded-full">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      `;
    } else {
      el.className = "song-card bg-spotify-light p-4 rounded-lg cursor-pointer group relative";
      el.innerHTML = `
        <div class="relative mb-4">
          <img src="${song.cover}" class="w-full aspect-square object-cover rounded-lg">
          <button onclick="event.stopPropagation(); loadSong(${originalIndex})" class="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:scale-105">
            <i class="fas fa-play"></i>
          </button>
        </div>
        <div class="mb-2">
          <h3 class="font-semibold truncate">${song.name}</h3>
          <p class="text-sm text-gray-400 truncate">${song.artist}</p>
        </div>
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="event.stopPropagation(); toggleLike(${originalIndex})" class="p-1 hover:scale-110 transition-transform">
            <i class="${isLiked ? 'fas fa-heart text-spotify-green' : 'far fa-heart'}"></i>
          </button>
          <button onclick="event.stopPropagation(); openPlaylistModal(${originalIndex})" class="p-1 hover:scale-110 transition-transform">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
      `;
    }

    el.onclick = () => loadSong(originalIndex);
    el.oncontextmenu = (e) => {
      e.preventDefault();
      showContextMenu(e, originalIndex);
    };

    container.appendChild(el);
  });
}

function renderHomePage() {
  renderContinuePlayingSection();
  renderQuickPicks();
  renderRecentlyPlayedGrid();
  renderMadeForYou();
  renderSongs('allSongs');
}

function renderContinuePlayingSection() {
  const section = document.getElementById('continuePlayingSection');
  const card = document.getElementById('continuePlayingCard');

  if (!section || !card) return;

  if (lastPlayedSong && lastPlayedSong.songIndex !== undefined) {
    const songIndex = lastPlayedSong.songIndex;

    if (songIndex >= 0 && songIndex < songs.length) {
      const song = songs[songIndex];
      const timeDiff = Date.now() - lastPlayedSong.timestamp;
      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
      const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      let timeText = '';
      if (daysAgo > 0) {
        timeText = `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
      } else if (hoursAgo > 0) {
        timeText = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
      } else {
        timeText = 'Recently played';
      }

      const progressPercent = lastPlayedSong.currentTime && audio.duration
        ? (lastPlayedSong.currentTime / audio.duration) * 100
        : 0;

      card.innerHTML = `
        <div class="flex items-center gap-4">
          <img src="${song.cover}" class="w-16 h-16 rounded-lg shadow-lg">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-lg text-black truncate">${song.name}</h3>
            <p class="text-black opacity-80 text-sm truncate">${song.artist}</p>
            <p class="text-black opacity-60 text-xs">${timeText}</p>
            ${progressPercent > 0 ? `
              <div class="mt-2 bg-black bg-opacity-20 rounded-full h-1">
                <div class="bg-black h-1 rounded-full transition-all" style="width: ${progressPercent}%"></div>
              </div>
            ` : ''}
          </div>
          <button class="bg-black bg-opacity-20 hover:bg-opacity-30 text-black p-3 rounded-full transition-all hover:scale-110">
            <i class="fas fa-play"></i>
          </button>
        </div>
      `;

      card.onclick = () => {
        loadSong(songIndex);
      };

      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  } else {
    section.classList.add('hidden');
  }
}

function renderQuickPicks() {
  const container = document.getElementById('quickPicks');
  if (!container) return;

  container.innerHTML = '';
  const quickSongs = [...likes, ...recentlyPlayed].slice(0, 6);

  quickSongs.forEach(songId => {
    const song = songs.find(s => s.src === songId);
    if (song) {
      const el = document.createElement('div');
      el.className = 'flex items-center bg-spotify-light rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer group';
      el.innerHTML = `
        <img src="${song.cover}" class="w-16 h-16">
        <span class="px-4 font-medium truncate flex-1">${song.name}</span>
        <button class="p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <i class="fas fa-play text-spotify-green"></i>
        </button>
      `;
      el.onclick = () => loadSong(songs.indexOf(song));
      container.appendChild(el);
    }
  });
}

function renderRecentlyPlayedGrid() {
  const container = document.getElementById('recentlyPlayedGrid');
  if (!container) return;

  const recentSongs = recentlyPlayed.slice(0, 6).map(id => songs.find(s => s.src === id)).filter(Boolean);
  container.innerHTML = '';

  recentSongs.forEach(song => {
    const el = document.createElement('div');
    el.className = 'song-card bg-spotify-light p-4 rounded-lg cursor-pointer group';
    el.innerHTML = `
      <div class="relative mb-3">
        <img src="${song.cover}" class="w-full aspect-square object-cover rounded-lg">
        <button class="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <i class="fas fa-play text-sm"></i>
        </button>
      </div>
      <h3 class="font-medium truncate text-sm">${song.name}</h3>
      <p class="text-xs text-gray-400 truncate">${song.artist}</p>
    `;
    el.onclick = () => loadSong(songs.indexOf(song));
    container.appendChild(el);
  });
}

function renderMadeForYou() {
  const container = document.getElementById('madeForYou');
  if (!container) return;

  const madeForYouPlaylists = [
    { name: 'Discover Weekly', description: 'Your weekly mixtape of fresh music', cover: songs[0].cover },
    { name: 'Release Radar', description: 'Catch all the latest music', cover: songs[1].cover },
    { name: 'Daily Mix 1', description: 'Made for you', cover: songs[2].cover },
  ];

  container.innerHTML = '';
  madeForYouPlaylists.forEach(playlist => {
    const el = document.createElement('div');
    el.className = 'song-card bg-spotify-light p-4 rounded-lg cursor-pointer group';
    el.innerHTML = `
      <div class="relative mb-3">
        <img src="${playlist.cover}" class="w-full aspect-square object-cover rounded-lg">
        <button class="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <i class="fas fa-play text-sm"></i>
        </button>
      </div>
      <h3 class="font-medium truncate text-sm">${playlist.name}</h3>
      <p class="text-xs text-gray-400 truncate">${playlist.description}</p>
    `;
    container.appendChild(el);
  });
}

function renderSearchPage() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput.value.trim()) {
    document.getElementById('searchResultsContainer').classList.remove('hidden');
    renderSongs('searchResults', song =>
      song.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  } else {
    document.getElementById('searchResultsContainer').classList.add('hidden');
  }
}

function renderLibraryPage() {
  renderLikedSongs();
  renderPlaylists();
  updateLikedCount();
}

function renderAll() {
  renderHomePage();
  renderSearchPage();
  renderLibraryPage();
}

function addToRecentlyPlayed(song) {
  const songId = song.src;
  recentlyPlayed = recentlyPlayed.filter(id => id !== songId);
  recentlyPlayed.unshift(songId);
  recentlyPlayed = recentlyPlayed.slice(0, 10);
  saveRecentlyPlayed();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleSettings() {
  const settingsModal = document.getElementById('settingsModal');
  const isHidden = settingsModal.classList.contains('hidden');

  if (isHidden) {
    settingsModal.classList.remove('hidden');
  } else {
    settingsModal.classList.add('hidden');
  }
}

function clearAllData() {
  if (confirm('This will clear all your playlists, liked songs, and playback history. Are you sure?')) {
    clearAllStorage();
    showNotification('All app data cleared');
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}
