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
  "song22.mp3"
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
  "Mat Maari"
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
  "image22.jpg"
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
  "Neeraj Shridhar",                   // Tum Mile
  "Vishal Dadlani, Shreya Ghoshal",    // Gandi Baat
  "Arijit Singh, Shreya Ghoshal",      // Teri Ore  
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

let currentIndex = 0;
let isRepeat = false;
let selectedForPlaylist = null;

const likes = JSON.parse(localStorage.getItem("likes") || "[]");
const playlists = JSON.parse(localStorage.getItem("playlists") || "{}");

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  title.textContent = song.name;
  artist.textContent = song.artist;
  cover.src = song.cover;
  currentIndex = index;
  audio.play();
}

function togglePlay() {
  audio.paused ? audio.play() : audio.pause();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
}

function setVolume(val) {
  audio.volume = val / 100;
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  alert("Repeat is now " + (isRepeat ? "ON" : "OFF"));
}

audio.addEventListener('ended', () => {
  isRepeat ? loadSong(currentIndex) : nextSong();
});

audio.addEventListener('timeupdate', () => {
  seekBar.value = (audio.currentTime / audio.duration) * 100 || 0;
});

seekBar.addEventListener('input', () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

function toggleLike(index) {
  const id = songs[index].src;
  const i = likes.indexOf(id);
  i === -1 ? likes.push(id) : likes.splice(i, 1);
  localStorage.setItem("likes", JSON.stringify(likes));
  renderAll();
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

function renderSongs(containerId, filterFn = () => true) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  songs.filter(filterFn).forEach((song, idx) => {
    const isLiked = likes.includes(song.src);
    const el = document.createElement('div');
    el.className = "bg-gray-700 p-3 rounded shadow hover:bg-gray-600 transition relative group";
    el.innerHTML = `
      <img src="${song.cover}" class="w-full rounded mb-2">
      <div class="font-bold">${song.name}</div>
      <div class="text-sm text-gray-400">${song.artist}</div>
      <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
        <button onclick="event.stopPropagation(); toggleLike(${idx})">${isLiked ? '❤️' : '🤍'}</button>
        <button onclick="event.stopPropagation(); openPlaylistModal(${idx})">➕</button>
      </div>
    `;
    el.onclick = () => loadSong(idx);
    container.appendChild(el);
  });
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
  ['homePage', 'searchPage', 'libraryPage'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(page + 'Page').classList.remove('hidden');
  renderAll();
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
