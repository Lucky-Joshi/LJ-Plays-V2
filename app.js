const songFiles = [
  "song1.mp3",
  "song2.mp3",
  "song3.mp3",
  "song4.mp3",
  "song5.mp3",
  "song6.mp3",
  "song7.mp3",
  "song8.mp3",
  "song9.mp3",
  "song10.mp3",
  "song11.mp3",
  "song12.mp3",
  "song13.mp3",
  "song14.mp3",
  "song15.mp3",
  "song16.mp3",
  "song17.mp3",
  "song18.mp3",
  "song19.mp3",
  "song20.mp3",
  "song21.mp3",
  "song22.mp3",
  "song23.mp3",
  "song24.mp3",
  "song25.mp3",
  "song26.mp3",
  "song27.mp3",
  "song28.mp3",
  "song29.mp3",
  "song30.mp3",
  "song31.mp3"
];

const songTitles = [
  "Victory Anthem",
  "Jatt Mehkma",
  "Millionaire",
  "Amkhon se batana",
  "Khwaab",
  "Ye Ishq Hai",
  "Girl I need You",
  "Relation",
  "Lehenga",
  "Bulleya",
  "Prem Ki Naiya Hai",
  "Punjabi Wedding",
  "Mitwa",
  "Yaad Piya Ki",
  "Teri Aankhon Mein", "Jhol",
  "Aashiq Tera",
  "O Rangrez",
  "Tum Mile",
  "Gandi Baat",
  "Teri Ore",
  "Mat Maari",
  "Tu Hi Mera",
  "One Love",
  "Rang Sharbaton ka",
  "Ye Tune Kya Kiya",
  "Tera Deedar Hua",
  "Ye Tune Kya Kiya - Love Version",
  "Te Amo",
  "Tu jaane na",
  "Pal Pal"

];

const songImages = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
  "image5.jpg",
  "image6.jpg",
  "image7.jpg",
  "image8.jpg",
  "image9.jpg",
  "image10.jpg",
  "image11.jpg",
  "image12.jpg",
  "image13.jpg",
  "image14.jpg",
  "image15.jpg",
  "image16.jpg",
  "image17.jpg",
  "image18.jpg",
  "image19.jpg",
  "image20.jpg",
  "image21.jpg",
  "image22.jpg",
  "image23.jpg",
  "image24.jpg",
  "image25.jpg",
  "image26.jpg",
  "image27.jpg",
  "image28.jpg",
  "image29.jpg",
  "image30.jpg",
  "image31.jpg"
];

const artistNames = [
  "Salim Sulaiman",                   // Victory Anthem
  "Karan Aujla",                      // Jatt Mehkma
  "Inder Chahal",                     // Millionaire
  "Dino James",                       // Amkhon se batana
  "Akhil",                            // Khwaab
  "Pritam, Shreya Ghoshal, Arijit Singh", // Ye Ishq Hai
  "Meet Bros, Arijit Singh",          // Girl I Need You
  "Ninja",                            // Relation
  "Jass Manak",                       // Lehenga
  "Pritam, Amit Mishra",              // Bulleya
  "Shreya Ghoshal, Shaan",            // Prem Ki Naiya Hai
  "Sunidhi Chauhan, Benny Dayal",     // Punjabi Wedding
  "Shankar-Ehsaan-Loy, Shafqat Amanat Ali", // Mitwa
  "Falguni Pathak",                   // Yaad Piya Ki
  "Zara Khan, Dev Negi",              // Teri Aankhon Mein
  "Raftaar",                          // jhol
  "Amit Mishra, Aditi Singh Sharma",  // Aashiq Tera
  "Shankar Mahadevan, Javed Bashir",  // O Rangrez
  "Neeraj Shridhar",                  // Tum Mile
  "Vishal Dadlani, Shreya Ghoshal",   // Gandi Baat
  "Arijit Singh, Shreya Ghoshal",     // Teri Ore  
  "Amit Trivedi, Shreya Ghoshal",     // Mat Maari
  "Pritam",                           // Tu hi mera
  "Shubh",                            // One Love
  "Shreya Ghoshal, Arijit Singh",     // Rang Sharbaton ka
  "Kailash Kher",                     // Ye Tune Kya Kiya
  "Rahat Fateh Ali Khan",             // Tera Deedar Hua
  "Ye Tune Kya Kiya - Love Version",   // Ye Tune Kya Kiya - Love Version
  "Ash King",                           // Te Amo
  "Arijit Singh",                     // Tu jaane na
  "Ali Somro",                       // Pal Pal
];

const songs = songFiles.map((src, i) => ({
  name: songTitles[i],
  artist: artistNames[i],
  cover: `assets/${songImages[i]}`,
  src: `assets/${src}`
}));

const audio = document.getElementById('audio');
const cover = document.getElementById('playerCover');
const title = document.getElementById('playerTitle');
const artist = document.getElementById('playerArtist');
const seekBar = document.getElementById('seekBar');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const playBtn = document.getElementById('playBtn');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

let currentIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;
let isMuted = false;
let selectedForPlaylist = null;
let contextSongIndex = null;
let queue = [];
let recentlyPlayed = JSON.parse(localStorage.getItem("recentlyPlayed") || "[]");

const likes = JSON.parse(localStorage.getItem("likes") || "[]");
const playlists = JSON.parse(localStorage.getItem("playlists") || "{}");

// Last played song functionality
let lastPlayedSong = JSON.parse(localStorage.getItem("lastPlayedSong") || "null");

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  title.textContent = song.name;
  artist.textContent = song.artist;
  cover.src = song.cover;
  currentIndex = index;

  // Save as last played song
  saveLastPlayedSong(index);

  // Add to recently played
  addToRecentlyPlayed(song);

  // Update like button
  updateLikeButton();

  audio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
  }).catch(e => console.log('Playback failed:', e));
}

function saveLastPlayedSong(index) {
  const lastPlayedData = {
    songIndex: index,
    timestamp: Date.now(),
    currentTime: audio.currentTime || 0
  };
  localStorage.setItem("lastPlayedSong", JSON.stringify(lastPlayedData));
}

function loadLastPlayedSong() {
  if (lastPlayedSong && lastPlayedSong.songIndex !== undefined) {
    const songIndex = lastPlayedSong.songIndex;

    // Verify the song index is still valid
    if (songIndex >= 0 && songIndex < songs.length) {
      const song = songs[songIndex];

      // Set up the player without auto-playing
      audio.src = song.src;
      title.textContent = song.name;
      artist.textContent = song.artist;
      cover.src = song.cover;
      currentIndex = songIndex;

      // Update like button
      updateLikeButton();

      // Restore playback position if it was saved recently (within 24 hours)
      const timeDiff = Date.now() - lastPlayedSong.timestamp;
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (timeDiff < oneDayInMs && lastPlayedSong.currentTime > 0) {
        audio.addEventListener('loadedmetadata', () => {
          audio.currentTime = lastPlayedSong.currentTime;
        }, { once: true });
      }

      showNotification(`Restored: ${song.name}`);
      return true;
    }
  }
  return false;
}

function addToRecentlyPlayed(song) {
  const songId = song.src;
  recentlyPlayed = recentlyPlayed.filter(id => id !== songId);
  recentlyPlayed.unshift(songId);
  recentlyPlayed = recentlyPlayed.slice(0, 10); // Keep only last 10
  localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
}

function togglePlay() {
  if (audio.paused) {
    audio.play().then(() => {
      isPlaying = true;
      updatePlayButton();
    });
  } else {
    audio.pause();
    isPlaying = false;
    updatePlayButton();
  }
}

function updatePlayButton() {
  const icon = playBtn.querySelector('i');
  icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function nextSong() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex);
}

function prevSong() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  }
  loadSong(currentIndex);
}

function setVolume(val) {
  audio.volume = val / 100;
  updateVolumeIcon();
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  const repeatBtn = document.getElementById('repeatBtn');
  repeatBtn.style.color = isRepeat ? '#1DB954' : '#9CA3AF';
  showNotification(`Repeat ${isRepeat ? 'enabled' : 'disabled'}`);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  const shuffleBtn = document.getElementById('shuffleBtn');
  shuffleBtn.style.color = isShuffle ? '#1DB954' : '#9CA3AF';
  showNotification(`Shuffle ${isShuffle ? 'enabled' : 'disabled'}`);
}

function toggleMute() {
  isMuted = !isMuted;
  audio.muted = isMuted;
  updateVolumeIcon();
}

function updateVolumeIcon() {
  const muteBtn = document.getElementById('muteBtn');
  const icon = muteBtn.querySelector('i');
  if (isMuted || audio.volume === 0) {
    icon.className = 'fas fa-volume-mute';
  } else if (audio.volume < 0.5) {
    icon.className = 'fas fa-volume-down';
  } else {
    icon.className = 'fas fa-volume-up';
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-spotify-green text-black px-4 py-2 rounded-lg z-50 animate-fade-in';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

audio.addEventListener('ended', () => {
  isPlaying = false;
  updatePlayButton();
  isRepeat ? loadSong(currentIndex) : nextSong();
});

audio.addEventListener('timeupdate', () => {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;
    progressBar.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);

    // Save current playback position every 5 seconds
    if (Math.floor(audio.currentTime) % 5 === 0) {
      saveLastPlayedSong(currentIndex);
    }
  }
});

audio.addEventListener('loadedmetadata', () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('play', () => {
  isPlaying = true;
  updatePlayButton();
});

audio.addEventListener('pause', () => {
  isPlaying = false;
  updatePlayButton();
});

seekBar.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
});

volumeSlider.addEventListener('input', (e) => {
  setVolume(e.target.value);
});

function toggleLike(index) {
  const id = songs[index].src;
  const i = likes.indexOf(id);
  const isLiked = i === -1;

  if (isLiked) {
    likes.push(id);
    showNotification('Added to Liked Songs');
  } else {
    likes.splice(i, 1);
    showNotification('Removed from Liked Songs');
  }

  localStorage.setItem("likes", JSON.stringify(likes));
  updateLikeButton();
  renderAll();
}

function toggleCurrentLike() {
  if (currentIndex !== null) {
    toggleLike(currentIndex);
  }
}

function updateLikeButton() {
  const likeBtn = document.getElementById('likeCurrentBtn');
  if (likeBtn && currentIndex !== null) {
    const isLiked = likes.includes(songs[currentIndex].src);
    const icon = likeBtn.querySelector('i');
    icon.className = isLiked ? 'fas fa-heart text-spotify-green' : 'far fa-heart';
  }
}

function openPlaylistModal(index) {
  selectedForPlaylist = index;
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
  Object.keys(playlists).forEach(name => {
    const btn = document.createElement("button");
    btn.textContent = `➕ ${name}`;
    btn.className = "block w-full text-left bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded";
    btn.onclick = () => {
      const id = songs[selectedForPlaylist].src;
      if (!playlists[name].includes(id)) playlists[name].push(id);
      localStorage.setItem("playlists", JSON.stringify(playlists));
      closePlaylistModal();
    };
    container.appendChild(btn);
  });
}

function createPlaylist() {
  const name = document.getElementById("newPlaylistInput").value.trim();
  if (!name || playlists[name]) return alert("Invalid or duplicate playlist name");
  playlists[name] = [];
  localStorage.setItem("playlists", JSON.stringify(playlists));
  renderPlaylistOptions();
  document.getElementById("newPlaylistInput").value = "";
}

function renderSongs(containerId, filterFn = () => true, layout = 'grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const filteredSongs = songs.filter(filterFn);

  filteredSongs.forEach((song, idx) => {
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

function showContextMenu(event, songIndex) {
  const contextMenu = document.getElementById('contextMenu');
  contextSongIndex = songIndex;

  contextMenu.style.display = 'block';
  contextMenu.style.left = event.pageX + 'px';
  contextMenu.style.top = event.pageY + 'px';

  // Hide context menu when clicking elsewhere
  setTimeout(() => {
    document.addEventListener('click', hideContextMenu, { once: true });
  }, 0);
}

function hideContextMenu() {
  document.getElementById('contextMenu').style.display = 'none';
}

function renderLikedSongs() {
  renderSongs("likedSongs", song => likes.includes(song.src));
}

function renderPlaylists() {
  const wrapper = document.getElementById("playlistList");
  wrapper.innerHTML = "";
  Object.entries(playlists).forEach(([name, ids]) => {
    const container = document.createElement("div");
    container.innerHTML = `<h4 class="font-bold text-lg">${name}</h4>`;
    const grid = document.createElement("div");
    grid.className = "grid grid-cols-2 md:grid-cols-4 gap-4";
    ids.forEach(id => {
      const song = songs.find(s => s.src === id);
      if (song) {
        const el = document.createElement("div");
        el.className = "bg-gray-700 p-3 rounded shadow hover:bg-gray-600 transition cursor-pointer";
        el.innerHTML = `
          <img src="${song.cover}" class="w-full rounded mb-2">
          <div class="font-bold">${song.name}</div>
          <div class="text-sm text-gray-400">${song.artist}</div>
        `;
        el.onclick = () => loadSong(songs.indexOf(song));
        grid.appendChild(el);
      }
    });
    container.appendChild(grid);
    wrapper.appendChild(container);
  });
}

function showPage(page) {
  // Hide all pages
  ['homePage', 'searchPage', 'libraryPage'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });

  // Show selected page
  document.getElementById(page + 'Page').classList.remove('hidden');

  // Update navigation buttons
  document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  document.getElementById(page + 'Btn')?.classList.add('active');

  // Render content based on page
  if (page === 'home') {
    renderHomePage();
  } else if (page === 'search') {
    renderSearchPage();
  } else if (page === 'library') {
    renderLibraryPage();
  }
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

      // Calculate progress percentage
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

  // Create some algorithmic playlists
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

function updateLikedCount() {
  const likedCountEl = document.getElementById('likedCount');
  if (likedCountEl) {
    likedCountEl.textContent = `${likes.length} songs`;
  }
}

function renderAll() {
  renderSongs("homePage");
  renderSongs("searchResults");
  renderLikedSongs();
  renderPlaylists();
}

document.getElementById('searchInput')?.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  renderSongs("searchResults", s => s.name.toLowerCase().includes(query));
});

window.onload = () => {
  renderAll();
  setTimeout(() => {
    document.getElementById('splash').classList.add("opacity-0");
    setTimeout(() => document.getElementById('splash').remove(), 700);
  }, 2500);
};

// Queue functionality
function addToQueue(songIndex) {
  const song = songs[songIndex];
  queue.push(songIndex);
  showNotification(`Added "${song.name}" to queue`);
  hideContextMenu();
}

function toggleQueue() {
  const queueModal = document.getElementById('queueModal');
  const isHidden = queueModal.classList.contains('hidden');

  if (isHidden) {
    renderQueue();
    queueModal.classList.remove('hidden');
  } else {
    queueModal.classList.add('hidden');
  }
}

function renderQueue() {
  const container = document.getElementById('queueList');
  container.innerHTML = '';

  if (queue.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-8">Queue is empty</p>';
    return;
  }

  queue.forEach((songIndex, queueIndex) => {
    const song = songs[songIndex];
    const el = document.createElement('div');
    el.className = 'flex items-center gap-3 p-2 rounded hover:bg-spotify-light transition-colors';
    el.innerHTML = `
      <img src="${song.cover}" class="w-10 h-10 rounded">
      <div class="flex-1">
        <div class="font-medium">${song.name}</div>
        <div class="text-sm text-gray-400">${song.artist}</div>
      </div>
      <button onclick="removeFromQueue(${queueIndex})" class="p-2 hover:bg-spotify-gray rounded">
        <i class="fas fa-times"></i>
      </button>
    `;
    container.appendChild(el);
  });
}

function removeFromQueue(queueIndex) {
  queue.splice(queueIndex, 1);
  renderQueue();
}

// Fullscreen functionality
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// Enhanced playlist functionality
function createPlaylist() {
  const name = document.getElementById("newPlaylistInput").value.trim();
  if (!name) {
    showNotification("Please enter a playlist name");
    return;
  }

  if (playlists[name]) {
    showNotification("Playlist already exists");
    return;
  }

  playlists[name] = [];
  localStorage.setItem("playlists", JSON.stringify(playlists));
  document.getElementById("newPlaylistInput").value = "";
  showNotification(`Created playlist "${name}"`);
  renderPlaylists();
}

function renderPlaylists() {
  const wrapper = document.getElementById("playlistList");
  if (!wrapper) return;

  wrapper.innerHTML = "";

  Object.entries(playlists).forEach(([name, songIds]) => {
    const container = document.createElement("div");
    container.className = "mb-6";

    const header = document.createElement("div");
    header.className = "flex items-center gap-4 p-4 bg-spotify-light rounded-lg mb-4 cursor-pointer hover:bg-gray-600 transition-colors";
    header.innerHTML = `
      <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
        <i class="fas fa-music"></i>
      </div>
      <div>
        <h3 class="font-bold">${name}</h3>
        <p class="text-sm text-gray-400">${songIds.length} songs</p>
      </div>
      <button onclick="deletePlaylist('${name}')" class="ml-auto p-2 hover:bg-spotify-gray rounded">
        <i class="fas fa-trash text-red-400"></i>
      </button>
    `;

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4";

    songIds.forEach(id => {
      const song = songs.find(s => s.src === id);
      if (song) {
        const el = document.createElement("div");
        el.className = "song-card bg-spotify-light p-3 rounded-lg cursor-pointer group";
        el.innerHTML = `
          <div class="relative mb-2">
            <img src="${song.cover}" class="w-full aspect-square object-cover rounded">
            <button class="absolute bottom-1 right-1 w-8 h-8 bg-spotify-green text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <i class="fas fa-play text-xs"></i>
            </button>
          </div>
          <div class="font-medium text-sm truncate">${song.name}</div>
          <div class="text-xs text-gray-400 truncate">${song.artist}</div>
        `;
        el.onclick = () => loadSong(songs.indexOf(song));
        grid.appendChild(el);
      }
    });

    container.appendChild(header);
    container.appendChild(grid);
    wrapper.appendChild(container);
  });
}

function deletePlaylist(name) {
  if (confirm(`Delete playlist "${name}"?`)) {
    delete playlists[name];
    localStorage.setItem("playlists", JSON.stringify(playlists));
    showNotification(`Deleted playlist "${name}"`);
    renderPlaylists();
  }
}

function showLikedSongs() {
  showPage('library');
  // Scroll to liked songs section
  setTimeout(() => {
    document.getElementById('likedSongs')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

// Enhanced search functionality
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

// Keyboard shortcuts
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

// Initialize app
function renderAll() {
  renderHomePage();
  renderSearchPage();
  renderLibraryPage();
}

// Enhanced window load
window.onload = () => {
  // Set initial volume
  setVolume(50);
  volumeSlider.value = 50;

  // Load last played song if available
  const hasLastSong = loadLastPlayedSong();

  // If no last played song, show welcome message
  if (!hasLastSong) {
    setTimeout(() => {
      showNotification('Welcome back! Select a song to start listening.');
    }, 3000);
  }

  // Render all content
  renderAll();

  // Show home page by default
  showPage('home');

  // Enhanced splash screen
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';
    splash.style.transform = 'scale(0.8)';

    setTimeout(() => {
      splash.remove();
    }, 1000);
  }, 2500);

  // Add some welcome animations
  setTimeout(() => {
    document.querySelectorAll('.song-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('animate-fade-in');
    });
  }, 3500);
};

// Service Worker for offline functionality (basic)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
}

// Clear last played song functionality
function clearLastPlayedSong() {
  localStorage.removeItem("lastPlayedSong");
  lastPlayedSong = null;
  renderContinuePlayingSection();
  showNotification('Cleared last played song');
}

// Auto-save playback position when pausing
audio.addEventListener('pause', () => {
  if (currentIndex !== null && audio.currentTime > 0) {
    saveLastPlayedSong(currentIndex);
  }
});

// Save position when the page is about to unload
window.addEventListener('beforeunload', () => {
  if (currentIndex !== null && audio.currentTime > 0) {
    saveLastPlayedSong(currentIndex);
  }
});

//Settings functionality
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
    localStorage.clear();
    showNotification('All app data cleared');
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}

// Media Session API for lock screen controls
function initializeMediaSession() {
  if ('mediaSession' in navigator) {
    // Show notification about lock screen controls
    setTimeout(() => {
      showNotification('🎵 Lock screen controls are now available!');
    }, 5000);

    // Set up action handlers
    navigator.mediaSession.setActionHandler('play', () => {
      audio.play();
      isPlaying = true;
      updatePlayButton();
      updateMediaSessionPlaybackState();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      audio.pause();
      isPlaying = false;
      updatePlayButton();
      updateMediaSessionPlaybackState();
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      prevSong();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      nextSong();
    });

    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset || 10;
      audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
      updateMediaSessionPositionState();
    });

    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 10;
      audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
      updateMediaSessionPositionState();
    });

    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime) {
        audio.currentTime = details.seekTime;
        updateMediaSessionPositionState();
      }
    });

    // Set up position state updates
    audio.addEventListener('loadedmetadata', updateMediaSessionPositionState);
    audio.addEventListener('timeupdate', updateMediaSessionPositionState);

    console.log('Media Session API initialized');
  } else {
    console.log('Media Session API not supported');
  }
}

function updateMediaSession(song) {
  if ('mediaSession' in navigator) {
    // Create absolute URL for artwork
    const artworkUrl = new URL(song.cover, window.location.href).href;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.name,
      artist: song.artist,
      album: 'LJ Plays V2',
      artwork: [
        { src: artworkUrl, sizes: '96x96', type: 'image/jpeg' },
        { src: artworkUrl, sizes: '128x128', type: 'image/jpeg' },
        { src: artworkUrl, sizes: '192x192', type: 'image/jpeg' },
        { src: artworkUrl, sizes: '256x256', type: 'image/jpeg' },
        { src: artworkUrl, sizes: '384x384', type: 'image/jpeg' },
        { src: artworkUrl, sizes: '512x512', type: 'image/jpeg' }
      ]
    });

    console.log(`Media Session updated: ${song.name} by ${song.artist}`);
  }
}

function updateMediaSessionPlaybackState() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }
}

function updateMediaSessionPositionState() {
  if ('mediaSession' in navigator && audio.duration) {
    navigator.mediaSession.setPositionState({
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      position: audio.currentTime
    });
  }
} 

function showMediaSessionIndicator() {
  const indicator = document.getElementById('mediaSessionIndicator');
  if (indicator) {
    indicator.classList.remove('hidden');
    // Hide after 3 seconds
    setTimeout(() => {
      indicator.classList.add('hidden');
    }, 3000);
  }
}