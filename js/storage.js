let likes = [];
let playlists = [];
let recentlyPlayed = [];
let lastPlayedSong = null;

function initStorage() {
  likes = JSON.parse(localStorage.getItem("likes") || "[]");
  playlists = JSON.parse(localStorage.getItem("playlists") || "[]");
  recentlyPlayed = JSON.parse(localStorage.getItem("recentlyPlayed") || "[]");
  lastPlayedSong = JSON.parse(localStorage.getItem("lastPlayedSong") || "null");
}

function saveLikes() {
  localStorage.setItem("likes", JSON.stringify(likes));
}

function savePlaylists() {
  localStorage.setItem("playlists", JSON.stringify(playlists));
}

function saveRecentlyPlayed() {
  localStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed));
}

function saveLastPlayedSong(index) {
  const lastPlayedData = {
    songIndex: index,
    timestamp: Date.now(),
    currentTime: audio.currentTime || 0
  };
  localStorage.setItem("lastPlayedSong", JSON.stringify(lastPlayedData));
  lastPlayedSong = lastPlayedData;
}

function clearAllStorage() {
  localStorage.clear();
}
