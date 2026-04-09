let selectedForPlaylist = null;

function createPlaylist(name) {
  if (!name) {
    showNotification("Please enter a playlist name");
    return;
  }
  
  const newPlaylist = {
    id: Date.now().toString(),
    name: name,
    songs: [],
    createdAt: Date.now()
  };
  
  playlists.push(newPlaylist);
  savePlaylists();
  closeCreatePlaylistModal();
  showNotification(`Created "${name}"`);
  renderPlaylists();
  renderLibraryPage();
}

function quickCreatePlaylist() {
  const name = document.getElementById('quickPlaylistInput')?.value.trim();
  if (!name) {
    showNotification("Please enter a playlist name");
    return;
  }
  
  const newPlaylist = {
    id: Date.now().toString(),
    name: name,
    songs: [],
    createdAt: Date.now()
  };
  
  playlists.push(newPlaylist);
  savePlaylists();
  closeCreatePlaylistModal();
  showNotification(`Created "${name}"`);
  renderPlaylists();
  openPlaylistView(newPlaylist.id);
}

function openPlaylistModal(songIndex) {
  selectedForPlaylist = songIndex;
  document.getElementById("playlistModal").classList.remove("hidden");
  renderPlaylistOptions();
}

function closePlaylistModal() {
  document.getElementById("playlistModal").classList.add("hidden");
  selectedForPlaylist = null;
}

function renderPlaylistOptions() {
  const container = document.getElementById("playlistOptions");
  container.innerHTML = "";
  
  if (playlists.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-4">No playlists yet. Create one first!</p>';
    return;
  }
  
  playlists.forEach(playlist => {
    const isInPlaylist = playlist.songs.includes(songs[selectedForPlaylist].src);
    const btn = document.createElement("button");
    btn.className = `block w-full text-left px-3 py-2 rounded flex items-center justify-between ${isInPlaylist ? 'bg-spotify-green text-black' : 'bg-gray-700 hover:bg-gray-600'}`;
    btn.innerHTML = `
      <span><i class="fas ${isInPlaylist ? 'fa-check' : 'fa-plus'} mr-2"></i>${playlist.name}</span>
      <span class="text-xs opacity-60">${playlist.songs.length}</span>
    `;
    btn.onclick = () => {
      const songSrc = songs[selectedForPlaylist].src;
      if (isInPlaylist) {
        removeSongFromPlaylist(playlist.id, songSrc);
      } else {
        addSongToPlaylist(playlist.id, songSrc);
      }
      closePlaylistModal();
    };
    container.appendChild(btn);
  });
}

function addSongToPlaylist(playlistId, songSrc) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (playlist && !playlist.songs.includes(songSrc)) {
    playlist.songs.push(songSrc);
    savePlaylists();
    showNotification(`Added to "${playlist.name}"`);
    renderPlaylists();
  }
}

function removeSongFromPlaylist(playlistId, songSrc) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (playlist) {
    playlist.songs = playlist.songs.filter(s => s !== songSrc);
    savePlaylists();
    showNotification(`Removed from "${playlist.name}"`);
    if (currentPlaylistId === playlistId) {
      renderPlaylistView(playlistId);
    }
    renderPlaylists();
  }
}

function renderPlaylists() {
  const wrapper = document.getElementById("playlistList");
  if (!wrapper) return;

  if (playlists.length === 0) {
    wrapper.innerHTML = `
      <div class="text-center py-8 text-gray-400">
        <i class="fas fa-list text-4xl mb-4 opacity-50"></i>
        <p>No playlists yet. Create one to get started!</p>
      </div>
    `;
    return;
  }

  wrapper.innerHTML = playlists.map(playlist => {
    const coverSongs = playlist.songs.slice(0, 4).map(src => {
      const song = songs.find(s => s.src === src);
      return song ? song.cover : 'assets/logo.png';
    });
    
    return `
      <div class="flex items-center gap-4 p-3 bg-spotify-light rounded-lg hover:bg-gray-600 transition-colors cursor-pointer group" onclick="openPlaylistView('${playlist.id}')">
        <div class="w-16 h-16 grid grid-cols-2 gap-0.5 rounded overflow-hidden flex-shrink-0">
          ${coverSongs.map(c => `<img src="${c}" class="w-full h-full object-cover">`).join('')}
          ${Array(4 - coverSongs.length).fill('<div class="w-full h-full bg-gray-700"></div>').join('')}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold truncate">${playlist.name}</h3>
          <p class="text-sm text-gray-400">${playlist.songs.length} songs</p>
        </div>
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="event.stopPropagation(); playPlaylist('${playlist.id}')" class="p-2 hover:bg-spotify-green rounded-full hover:text-black transition-colors" title="Play">
            <i class="fas fa-play"></i>
          </button>
          <button onclick="event.stopPropagation(); deletePlaylist('${playlist.id}')" class="p-2 hover:bg-red-600 rounded-full transition-colors" title="Delete">
            <i class="fas fa-trash text-red-400"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openPlaylistView(playlistId) {
  currentPlaylistId = playlistId;
  renderPlaylistView(playlistId);
  document.getElementById('playlistViewModal')?.classList.remove('hidden');
}

function renderPlaylistView(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist) return;
  
  const container = document.getElementById('playlistViewContent');
  if (!container) return;
  
  const coverSongs = playlist.songs.slice(0, 4).map(src => {
    const song = songs.find(s => s.src === src);
    return song ? song.cover : 'assets/logo.png';
  });
  
  container.innerHTML = `
    <div class="flex items-center gap-6 mb-8">
      <div class="w-48 h-48 grid grid-cols-2 gap-1 rounded-lg overflow-hidden shadow-xl flex-shrink-0">
        ${coverSongs.map(c => `<img src="${c}" class="w-full h-full object-cover">`).join('')}
        ${Array(Math.max(0, 4 - coverSongs.length)).fill('<div class="w-full h-full bg-gray-700"></div>').join('')}
      </div>
      <div>
        <p class="text-sm font-medium uppercase tracking-wider text-gray-300">Playlist</p>
        <h2 class="text-4xl font-bold mb-2">${playlist.name}</h2>
        <p class="text-gray-400">${playlist.songs.length} songs</p>
      </div>
    </div>
    
    <div class="flex items-center gap-4 mb-6">
      <button onclick="playPlaylist('${playlist.id}')" class="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform hover:bg-green-400">
        <i class="fas fa-play text-2xl text-black"></i>
      </button>
      <button onclick="shufflePlaylist('${playlist.id}')" class="p-3 border border-gray-500 rounded-full hover:border-white hover:scale-105 transition-all">
        <i class="fas fa-random"></i>
      </button>
    </div>
    
    <div class="space-y-2">
      ${playlist.songs.length === 0 ? `
        <div class="text-center py-12 text-gray-400">
          <i class="fas fa-music text-4xl mb-4 opacity-50"></i>
          <p>This playlist is empty. Add songs from the library!</p>
        </div>
      ` : playlist.songs.map((songSrc, index) => {
        const song = songs.find(s => s.src === songSrc);
        if (!song) return '';
        const isLiked = likes.includes(songSrc);
        return `
          <div class="flex items-center gap-4 p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors group cursor-pointer" onclick="loadSong(${songs.indexOf(song)})">
            <div class="w-6 text-center text-gray-400 group-hover:hidden">${index + 1}</div>
            <i class="fas fa-play hidden group-hover:block text-spotify-green"></i>
            <img src="${song.cover}" class="w-12 h-12 rounded flex-shrink-0">
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">${song.name}</div>
              <div class="text-sm text-gray-400 truncate">${song.artist}</div>
            </div>
            <button onclick="event.stopPropagation(); toggleLike(${songs.indexOf(song)})" class="p-2 hover:scale-110 transition-transform">
              <i class="${isLiked ? 'fas fa-heart text-spotify-green' : 'far fa-heart'}"></i>
            </button>
            <button onclick="event.stopPropagation(); removeSongFromPlaylist('${playlist.id}', '${songSrc}')" class="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Remove from playlist">
              <i class="fas fa-minus-circle"></i>
            </button>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function closePlaylistView() {
  document.getElementById('playlistViewModal')?.classList.add('hidden');
  currentPlaylistId = null;
}

function playPlaylist(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist || playlist.songs.length === 0) {
    showNotification("Playlist is empty");
    return;
  }
  
  const firstSong = songs.find(s => s.src === playlist.songs[0]);
  if (firstSong) {
    loadSong(songs.indexOf(firstSong));
    showNotification(`Playing "${playlist.name}"`);
  }
}

function shufflePlaylist(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist || playlist.songs.length === 0) {
    showNotification("Playlist is empty");
    return;
  }
  
  const shuffledSongs = [...playlist.songs].sort(() => Math.random() - 0.5);
  const firstSong = songs.find(s => s.src === shuffledSongs[0]);
  if (firstSong) {
    isShuffle = true;
    document.getElementById('shuffleBtn').style.color = '#1DB954';
    loadSong(songs.indexOf(firstSong));
    showNotification(`Shuffle playing "${playlist.name}"`);
  }
}

function deletePlaylist(playlistId) {
  const playlist = playlists.find(p => p.id === playlistId);
  if (!playlist) return;
  
  if (confirm(`Delete playlist "${playlist.name}"?`)) {
    playlists = playlists.filter(p => p.id !== playlistId);
    savePlaylists();
    showNotification(`Deleted "${playlist.name}"`);
    renderPlaylists();
    
    if (currentPlaylistId === playlistId) {
      closePlaylistView();
    }
  }
}

function showCreatePlaylistModal() {
  document.getElementById('createPlaylistModal')?.classList.remove('hidden');
  document.getElementById('quickPlaylistInput')?.focus();
}

function closeCreatePlaylistModal() {
  document.getElementById('createPlaylistModal')?.classList.add('hidden');
  const input = document.getElementById('quickPlaylistInput');
  if (input) input.value = '';
}
