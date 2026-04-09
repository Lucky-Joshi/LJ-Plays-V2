let currentIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;
let isMuted = false;
let currentPlaylistId = null;

function initPlayer() {
  initElements();
  setupPlayerEvents();
}

function setupPlayerEvents() {
  audio.addEventListener('ended', handleSongEnded);
  audio.addEventListener('timeupdate', handleTimeUpdate);
  audio.addEventListener('loadedmetadata', handleMetadataLoaded);
  audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
    updateMediaSessionPlaybackState();
  });
  audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
    updateMediaSessionPlaybackState();
  });
}

function handleSongEnded() {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } else {
    isPlaying = false;
    updatePlayButton();
    nextSong();
  }
}

function handleTimeUpdate() {
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    seekBar.value = progress;
    progressBar.style.width = progress + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    totalTimeEl.textContent = formatTime(audio.duration);

    if (Math.floor(audio.currentTime) % 5 === 0) {
      saveLastPlayedSong(currentIndex);
    }
  }
}

function handleMetadataLoaded() {
  totalTimeEl.textContent = formatTime(audio.duration);
}

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  title.textContent = song.name;
  artist.textContent = song.artist;
  cover.src = song.cover;
  currentIndex = index;

  saveLastPlayedSong(index);
  addToRecentlyPlayed(song);
  updateLikeButton();
  updateMediaSession(song);

  audio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
  }).catch(() => {});
}

function loadLastPlayedSong() {
  if (lastPlayedSong && lastPlayedSong.songIndex !== undefined) {
    const songIndex = lastPlayedSong.songIndex;
    if (songIndex >= 0 && songIndex < songs.length) {
      const song = songs[songIndex];
      audio.src = song.src;
      title.textContent = song.name;
      artist.textContent = song.artist;
      cover.src = song.cover;
      currentIndex = songIndex;
      updateLikeButton();

      const timeDiff = Date.now() - lastPlayedSong.timestamp;
      if (timeDiff < 86400000 && lastPlayedSong.currentTime > 0) {
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

function seekTo(percent) {
  if (audio.duration) {
    audio.currentTime = (percent / 100) * audio.duration;
  }
}

function clearLastPlayedSong() {
  localStorage.removeItem("lastPlayedSong");
  lastPlayedSong = null;
  renderContinuePlayingSection();
  showNotification('Cleared last played song');
}
