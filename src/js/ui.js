import { player } from './player.js';
import { storage } from './storage.js';
import { CONFIG } from '../config.js';

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-spotify-green text-black px-4 py-2 rounded-lg z-50 animate-fade-in';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), CONFIG.UI.NOTIFICATION_DURATION);
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

  if (page === 'home') renderHomePage();
  else if (page === 'search') renderSearchPage();
  else if (page === 'library') renderLibraryPage();
}

function renderSongs(containerId, filterFn = () => true) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const filteredSongs = songs.filter(filterFn);
  filteredSongs.forEach((song) => {
    const originalIndex = songs.indexOf(song);
    const isLiked = storage.likes.includes(song.src);
    const el = document.createElement('div');
    el.className = "song-card bg-spotify-light p-4 rounded-lg cursor-pointer group relative";
    el.innerHTML = `
      <div class="relative mb-4">
        <img src="${song.cover}" class="w-full aspect-square object-cover rounded-lg">
        <button onclick="event.stopPropagation(); player.load(${originalIndex})" 
                class="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:scale-105">
          <i class="fas fa-play"></i>
        </button>
      </div>
      <div class="mb-2">
        <h3 class="font-semibold truncate">${song.name}</h3>
        <p class="text-sm text-gray-400 truncate">${song.artist}</p>
      </div>
      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onclick="event.stopPropagation(); likes.toggle(${originalIndex})" class="p-1 hover:scale-110 transition-transform">
          <i class="${isLiked ? 'fas fa-heart text-spotify-green' : 'far fa-heart'}"></i>
        </button>
        <button onclick="event.stopPropagation(); playlistUI.openModal(${originalIndex})" class="p-1 hover:scale-110 transition-transform">
          <i class="fas fa-ellipsis-h"></i>
        </button>
      </div>
    `;
    el.onclick = () => player.load(originalIndex);
    el.oncontextmenu = (e) => {
      e.preventDefault();
      contextMenu.show(e, originalIndex);
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

  const last = storage.lastPlayedSong;
  if (last && last.songIndex !== undefined && last.songIndex >= 0 && last.songIndex < songs.length) {
    const song = songs[last.songIndex];
    const timeDiff = Date.now() - last.timestamp;
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let timeText = daysAgo > 0 ? `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago` 
               : hoursAgo > 0 ? `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago` 
               : 'Recently played';

    const progressPercent = last.currentTime && player.audio.duration 
      ? (last.currentTime / player.audio.duration) * 100 : 0;

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
    card.onclick = () => player.load(last.songIndex);
    section.classList.remove('hidden');
  } else {
    section.classList.add('hidden');
  }
}

function renderQuickPicks() {
  const container = document.getElementById('quickPicks');
  if (!container) return;
  container.innerHTML = '';

  const quickSongs = [...storage.likes, ...storage.recentlyPlayed].slice(0, 6);
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
      el.onclick = () => player.load(songs.indexOf(song));
      container.appendChild(el);
    }
  });
}

function renderRecentlyPlayedGrid() {
  const container = document.getElementById('recentlyPlayedGrid');
  if (!container) return;
  container.innerHTML = '';

  const recentSongs = storage.recentlyPlayed.slice(0, 6).map(id => songs.find(s => s.src === id)).filter(Boolean);
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
    el.onclick = () => player.load(songs.indexOf(song));
    container.appendChild(el);
  });
}

function renderMadeForYou() {
  const container = document.getElementById('madeForYou');
  if (!container) return;
  container.innerHTML = '';

  const playlists = [
    { name: 'Discover Weekly', description: 'Your weekly mixtape', cover: songs[0].cover },
    { name: 'Release Radar', description: 'Catch all the latest', cover: songs[1].cover },
    { name: 'Daily Mix 1', description: 'Made for you', cover: songs[2].cover }
  ];

  playlists.forEach(p => {
    const el = document.createElement('div');
    el.className = 'song-card bg-spotify-light p-4 rounded-lg cursor-pointer group';
    el.innerHTML = `
      <div class="relative mb-3">
        <img src="${p.cover}" class="w-full aspect-square object-cover rounded-lg">
        <button class="absolute bottom-2 right-2 w-10 h-10 bg-spotify-green text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
          <i class="fas fa-play text-sm"></i>
        </button>
      </div>
      <h3 class="font-medium truncate text-sm">${p.name}</h3>
      <p class="text-xs text-gray-400 truncate">${p.description}</p>
    `;
    container.appendChild(el);
  });
}

function renderSearchPage() {
  const input = document.getElementById('searchInput');
  if (input.value.trim()) {
    document.getElementById('searchResultsContainer').classList.remove('hidden');
    renderSongs('searchResults', song =>
      song.name.toLowerCase().includes(input.value.toLowerCase()) ||
      song.artist.toLowerCase().includes(input.value.toLowerCase())
    );
  } else {
    document.getElementById('searchResultsContainer').classList.add('hidden');
  }
}

function renderLibraryPage() {
  likes.renderLikedSongs();
  playlistUI.renderPlaylists();
  likes.updateCount();
}

function renderAll() {
  renderHomePage();
  renderSearchPage();
  renderLibraryPage();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleSettings() {
  const modal = document.getElementById('settingsModal');
  modal.classList.toggle('hidden');
}

function clearAllData() {
  if (confirm('Clear all data?')) {
    storage.clearAll();
    showNotification('All data cleared');
    setTimeout(() => location.reload(), 1000);
  }
}

function showLikedSongs() {
  showPage('library');
  setTimeout(() => document.getElementById('likedSongs')?.scrollIntoView({ behavior: 'smooth' }), 100);
}

// Context Menu
const contextMenu = {
  show(event, songIndex) {
    const menu = document.getElementById('contextMenu');
    window.contextSongIndex = songIndex;
    menu.style.display = 'block';
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';
    setTimeout(() => document.addEventListener('click', this.hide, { once: true }), 0);
  },
  hide() {
    document.getElementById('contextMenu').style.display = 'none';
  }
};

// Playlist UI
const playlistUI = {
  selectedIndex: null,

  openModal(songIndex) {
    this.selectedIndex = songIndex;
    document.getElementById("playlistModal").classList.remove("hidden");
    this.renderOptions();
  },

  closeModal() {
    document.getElementById("playlistModal").classList.add("hidden");
    this.selectedIndex = null;
  },

  renderOptions() {
    const container = document.getElementById("playlistOptions");
    container.innerHTML = '';

    if (storage.playlists.length === 0) {
      container.innerHTML = '<p class="text-gray-400 text-center py-4">No playlists yet!</p>';
      return;
    }

    storage.playlists.forEach(pl => {
      const isIn = pl.songs.includes(songs[this.selectedIndex].src);
      const btn = document.createElement("button");
      btn.className = `block w-full text-left px-3 py-2 rounded flex items-center justify-between ${isIn ? 'bg-spotify-green text-black' : 'bg-gray-700 hover:bg-gray-600'}`;
      btn.innerHTML = `<span><i class="fas ${isIn ? 'fa-check' : 'fa-plus'} mr-2"></i>${pl.name}</span><span class="text-xs opacity-60">${pl.songs.length}</span>`;
      btn.onclick = () => {
        isIn ? this.removeFromPlaylist(pl.id) : this.addToPlaylist(pl.id);
        this.closeModal();
      };
      container.appendChild(btn);
    });
  },

  addToPlaylist(playlistId) {
    const pl = storage.playlists.find(p => p.id === playlistId);
    const songSrc = songs[this.selectedIndex].src;
    if (pl && !pl.songs.includes(songSrc)) {
      pl.songs.push(songSrc);
      storage.savePlaylists();
      showNotification(`Added to "${pl.name}"`);
      this.renderPlaylists();
    }
  },

  removeFromPlaylist(playlistId) {
    const pl = storage.playlists.find(p => p.id === playlistId);
    const songSrc = songs[this.selectedIndex].src;
    if (pl) {
      pl.songs = pl.songs.filter(s => s !== songSrc);
      storage.savePlaylists();
      showNotification(`Removed from "${pl.name}"`);
      this.renderPlaylists();
    }
  },

  createPlaylist(name) {
    if (!name) {
      showNotification("Enter a playlist name");
      return;
    }
    storage.playlists.push({
      id: Date.now().toString(),
      name,
      songs: [],
      createdAt: Date.now()
    });
    storage.savePlaylists();
    this.closeCreateModal();
    showNotification(`Created "${name}"`);
    this.renderPlaylists();
  },

  openCreateModal() {
    document.getElementById('createPlaylistModal')?.classList.remove('hidden');
    document.getElementById('quickPlaylistInput')?.focus();
  },

  closeCreateModal() {
    document.getElementById('createPlaylistModal')?.classList.add('hidden');
    document.getElementById('quickPlaylistInput').value = '';
  },

  renderPlaylists() {
    const wrapper = document.getElementById("playlistList");
    if (!wrapper) return;

    if (storage.playlists.length === 0) {
      wrapper.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-list text-4xl mb-4 opacity-50"></i><p>No playlists yet!</p></div>';
      return;
    }

    wrapper.innerHTML = storage.playlists.map(pl => {
      const covers = pl.songs.slice(0, 4).map(src => songs.find(s => s.src === src)?.cover || 'assets/logo.png');
      return `
        <div class="flex items-center gap-4 p-3 bg-spotify-light rounded-lg hover:bg-gray-600 transition-colors cursor-pointer group" onclick="playlistUI.openView('${pl.id}')">
          <div class="w-16 h-16 grid grid-cols-2 gap-0.5 rounded overflow-hidden flex-shrink-0">
            ${covers.map(c => `<img src="${c}" class="w-full h-full object-cover">`).join('')}
            ${Array(Math.max(0, 4 - covers.length)).fill('<div class="w-full h-full bg-gray-700"></div>').join('')}
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold truncate">${pl.name}</h3>
            <p class="text-sm text-gray-400">${pl.songs.length} songs</p>
          </div>
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onclick="event.stopPropagation(); playlistUI.playPlaylist('${pl.id}')" class="p-2 hover:bg-spotify-green rounded-full hover:text-black transition-colors"><i class="fas fa-play"></i></button>
            <button onclick="event.stopPropagation(); playlistUI.deletePlaylist('${pl.id}')" class="p-2 hover:bg-red-600 rounded-full"><i class="fas fa-trash text-red-400"></i></button>
          </div>
        </div>
      `;
    }).join('');
  },

  openView(playlistId) {
    window.currentPlaylistId = playlistId;
    this.renderView(playlistId);
    document.getElementById('playlistViewModal')?.classList.remove('hidden');
  },

  closeView() {
    document.getElementById('playlistViewModal')?.classList.add('hidden');
    window.currentPlaylistId = null;
  },

  renderView(playlistId) {
    const pl = storage.playlists.find(p => p.id === playlistId);
    const container = document.getElementById('playlistViewContent');
    if (!pl || !container) return;

    const covers = pl.songs.slice(0, 4).map(src => songs.find(s => s.src === src)?.cover || 'assets/logo.png');

    container.innerHTML = `
      <div class="flex items-center gap-6 mb-8">
        <div class="w-48 h-48 grid grid-cols-2 gap-1 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
          ${covers.map(c => `<img src="${c}" class="w-full h-full object-cover">`).join('')}
          ${Array(Math.max(0, 4 - covers.length)).fill('<div class="w-full h-full bg-gray-700"></div>').join('')}
        </div>
        <div>
          <p class="text-sm font-medium uppercase tracking-wider text-gray-300">Playlist</p>
          <h2 class="text-4xl font-bold mb-2">${pl.name}</h2>
          <p class="text-gray-400">${pl.songs.length} songs</p>
        </div>
      </div>
      <div class="flex items-center gap-4 mb-6">
        <button onclick="playlistUI.playPlaylist('${pl.id}')" class="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform hover:bg-green-400">
          <i class="fas fa-play text-2xl text-black"></i>
        </button>
        <button onclick="playlistUI.shufflePlaylist('${pl.id}')" class="p-3 border border-gray-500 rounded-full hover:border-white hover:scale-105 transition-all">
          <i class="fas fa-random"></i>
        </button>
      </div>
      <div class="space-y-2">
        ${pl.songs.length === 0 ? '<div class="text-center py-12 text-gray-400"><i class="fas fa-music text-4xl mb-4 opacity-50"></i><p>Empty playlist</p></div>' : 
        pl.songs.map((songSrc, idx) => {
          const song = songs.find(s => s.src === songSrc);
          if (!song) return '';
          const isLiked = storage.likes.includes(songSrc);
          return `
            <div class="flex items-center gap-4 p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors group cursor-pointer" onclick="player.load(${songs.indexOf(song)})">
              <div class="w-6 text-center text-gray-400 group-hover:hidden">${idx + 1}</div>
              <i class="fas fa-play hidden group-hover:block text-spotify-green"></i>
              <img src="${song.cover}" class="w-12 h-12 rounded flex-shrink-0">
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate">${song.name}</div>
                <div class="text-sm text-gray-400 truncate">${song.artist}</div>
              </div>
              <button onclick="event.stopPropagation(); likes.toggle(${songs.indexOf(song)})" class="p-2 hover:scale-110"><i class="${isLiked ? 'fas fa-heart text-spotify-green' : 'far fa-heart'}"></i></button>
              <button onclick="event.stopPropagation(); playlistUI.removeFromPlaylist('${pl.id}')" class="p-2 text-gray-400 hover:text-red-400"><i class="fas fa-minus-circle"></i></button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  playPlaylist(playlistId) {
    const pl = storage.playlists.find(p => p.id === playlistId);
    if (!pl || pl.songs.length === 0) {
      showNotification("Playlist is empty");
      return;
    }
    const firstSong = songs.find(s => s.src === pl.songs[0]);
    if (firstSong) {
      player.load(songs.indexOf(firstSong));
      showNotification(`Playing "${pl.name}"`);
    }
  },

  shufflePlaylist(playlistId) {
    const pl = storage.playlists.find(p => p.id === playlistId);
    if (!pl || pl.songs.length === 0) {
      showNotification("Playlist is empty");
      return;
    }
    const shuffled = [...pl.songs].sort(() => Math.random() - 0.5);
    const firstSong = songs.find(s => s.src === shuffled[0]);
    if (firstSong) {
      player.isShuffle = true;
      document.getElementById('shuffleBtn').style.color = '#1DB954';
      player.load(songs.indexOf(firstSong));
      showNotification(`Shuffle playing "${pl.name}"`);
    }
  },

  deletePlaylist(playlistId) {
    const pl = storage.playlists.find(p => p.id === playlistId);
    if (!pl) return;
    if (confirm(`Delete "${pl.name}"?`)) {
      storage.playlists = storage.playlists.filter(p => p.id !== playlistId);
      storage.savePlaylists();
      showNotification(`Deleted "${pl.name}"`);
      this.renderPlaylists();
      if (window.currentPlaylistId === playlistId) this.closeView();
    }
  }
};

// Likes module
const likes = {
  toggle(index) {
    const id = songs[index].src;
    const i = storage.likes.indexOf(id);
    const isLiked = i === -1;

    if (isLiked) {
      storage.likes.push(id);
      showNotification('Added to Liked Songs');
    } else {
      storage.likes.splice(i, 1);
      showNotification('Removed from Liked Songs');
    }
    storage.saveLikes();
    if (window.updateLikeButton) updateLikeButton();
    renderAll();
  },

  renderLikedSongs() {
    renderSongs("likedSongs", song => storage.likes.includes(song.src));
  },

  updateCount() {
    const el = document.getElementById('likedCount');
    if (el) el.textContent = `${storage.likes.length} songs`;
  },

  updateButton() {
    const btn = document.getElementById('likeCurrentBtn');
    if (btn && player.currentIndex !== null) {
      const isLiked = storage.likes.includes(songs[player.currentIndex].src);
      btn.querySelector('i').className = isLiked ? 'fas fa-heart text-spotify-green' : 'far fa-heart';
    }
  }
};

// Queue module
const queue = {
  items: [],

  add(songIndex) {
    this.items.push(songIndex);
    showNotification(`Added "${songs[songIndex].name}" to queue`);
    contextMenu.hide();
  },

  toggle() {
    const modal = document.getElementById('queueModal');
    if (modal.classList.contains('hidden')) {
      this.render();
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  },

  render() {
    const container = document.getElementById('queueList');
    container.innerHTML = '';
    if (this.items.length === 0) {
      container.innerHTML = '<p class="text-gray-400 text-center py-8">Queue is empty</p>';
      return;
    }
    this.items.forEach((idx, i) => {
      const song = songs[idx];
      const el = document.createElement('div');
      el.className = 'flex items-center gap-3 p-2 rounded hover:bg-spotify-light';
      el.innerHTML = `
        <img src="${song.cover}" class="w-10 h-10 rounded">
        <div class="flex-1"><div class="font-medium">${song.name}</div><div class="text-sm text-gray-400">${song.artist}</div></div>
        <button onclick="queue.remove(${i})" class="p-2 hover:bg-spotify-gray rounded"><i class="fas fa-times"></i></button>
      `;
      container.appendChild(el);
    });
  },

  remove(index) {
    this.items.splice(index, 1);
    this.render();
  }
};

// Media Session
function updateMediaSession(song) {
  if ('mediaSession' in navigator) {
    const artworkUrl = new URL(song.cover, window.location.href).href;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name,
      artist: song.artist,
      album: 'LJ Plays V2',
      artwork: [
        { src: artworkUrl, sizes: '512x512', type: 'image/jpeg' }
      ]
    });
  }
}

function updateMediaSessionPlaybackState() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = player.isPlaying ? 'playing' : 'paused';
  }
}

function initMediaSession() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => { player.audio.play(); player.isPlaying = true; player.updatePlayButton(); });
    navigator.mediaSession.setActionHandler('pause', () => { player.audio.pause(); player.isPlaying = false; player.updatePlayButton(); });
    navigator.mediaSession.setActionHandler('previoustrack', () => player.prev());
    navigator.mediaSession.setActionHandler('nexttrack', () => player.next());
    navigator.mediaSession.setActionHandler('seekbackward', (d) => { player.audio.currentTime = Math.max(player.audio.currentTime - (d.seekOffset || 10), 0); });
    navigator.mediaSession.setActionHandler('seekforward', (d) => { player.audio.currentTime = Math.min(player.audio.currentTime + (d.seekOffset || 10), player.audio.duration); });
  }
}

// Global functions
window.showNotification = showNotification;
window.showPage = showPage;
window.renderAll = renderAll;
window.renderSongs = renderSongs;
window.showLikedSongs = showLikedSongs;
window.toggleFullscreen = toggleFullscreen;
window.toggleSettings = toggleSettings;
window.clearAllData = clearAllData;
window.contextMenu = contextMenu;
window.playlistUI = playlistUI;
window.likes = likes;
window.queue = queue;
const updateLikeButton = () => likes.updateButton();
window.updateLikeButton = updateLikeButton;
window.updateMediaSession = updateMediaSession;
window.updateMediaSessionPlaybackState = updateMediaSessionPlaybackState;

export { showNotification, showPage, renderAll, playlistUI, likes, queue, contextMenu, updateLikeButton };
