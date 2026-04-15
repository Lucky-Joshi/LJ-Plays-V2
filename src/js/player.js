import { storage } from './storage.js';
import { CONFIG } from '../config.js';

class Player {
  constructor() {
    this.audio = null;
    this.currentIndex = 0;
    this.isPlaying = false;
    this.isRepeat = false;
    this.isShuffle = false;
    this.isMuted = false;
    this.currentPlaylistId = null;
    this.state = {
      cover: null,
      title: null,
      artist: null,
      seekBar: null,
      volumeSlider: null,
      progressBar: null,
      playBtn: null,
      currentTimeEl: null,
      totalTimeEl: null
    };
  }

  init() {
    this.cacheElements();
    this.bindEvents();
  }

  cacheElements() {
    this.state.cover = document.getElementById('playerCover');
    this.state.title = document.getElementById('playerTitle');
    this.state.artist = document.getElementById('playerArtist');
    this.state.seekBar = document.getElementById('seekBar');
    this.state.volumeSlider = document.getElementById('volumeSlider');
    this.state.progressBar = document.getElementById('progressBar');
    this.state.playBtn = document.getElementById('playBtn');
    this.state.currentTimeEl = document.getElementById('currentTime');
    this.state.totalTimeEl = document.getElementById('totalTime');
  }

  bindEvents() {
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.audio.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
    this.audio.addEventListener('play', () => this.onPlay());
    this.audio.addEventListener('pause', () => this.onPause());
  }

  onEnded() {
    if (this.isRepeat) {
      this.audio.currentTime = 0;
      this.audio.play().catch(() => {});
    } else {
      this.isPlaying = false;
      this.updatePlayButton();
      this.next();
    }
  }

  onTimeUpdate() {
    if (this.audio.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.state.seekBar.value = progress;
      this.state.progressBar.style.width = progress + '%';
      this.state.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
      this.state.totalTimeEl.textContent = this.formatTime(this.audio.duration);

      if (Math.floor(this.audio.currentTime) % CONFIG.AUDIO.SAVE_POSITION_INTERVAL === 0) {
        storage.saveLastPlayed(this.currentIndex, this.audio.currentTime);
      }
    }
  }

  onMetadataLoaded() {
    this.state.totalTimeEl.textContent = this.formatTime(this.audio.duration);
  }

  onPlay() {
    this.isPlaying = true;
    this.updatePlayButton();
    if (window.updateMediaSessionPlaybackState) {
      updateMediaSessionPlaybackState();
    }
  }

  onPause() {
    this.isPlaying = false;
    this.updatePlayButton();
    if (this.currentIndex !== null && this.audio.currentTime > 0) {
      storage.saveLastPlayed(this.currentIndex, this.audio.currentTime);
    }
    if (window.updateMediaSessionPlaybackState) {
      updateMediaSessionPlaybackState();
    }
  }

  load(songIndex) {
    const song = songs[songIndex];
    this.audio.src = song.src;
    this.state.title.textContent = song.name;
    this.state.artist.textContent = song.artist;
    this.state.cover.src = song.cover;
    this.currentIndex = songIndex;

    storage.saveLastPlayed(songIndex, 0);
    storage.addToRecentlyPlayed(song.src);

    if (window.updateLikeButton) updateLikeButton();
    if (window.updateMediaSession) updateMediaSession(song);

    this.audio.play().then(() => {
      this.isPlaying = true;
      this.updatePlayButton();
    }).catch(() => {});
  }

  togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  updatePlayButton() {
    const icon = this.state.playBtn.querySelector('i');
    icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
  }

  next() {
    if (this.isShuffle) {
      this.currentIndex = Math.floor(Math.random() * songs.length);
    } else {
      this.currentIndex = (this.currentIndex + 1) % songs.length;
    }
    this.load(this.currentIndex);
  }

  prev() {
    if (this.isShuffle) {
      this.currentIndex = Math.floor(Math.random() * songs.length);
    } else {
      this.currentIndex = (this.currentIndex - 1 + songs.length) % songs.length;
    }
    this.load(this.currentIndex);
  }

  setVolume(val) {
    this.audio.volume = val / 100;
    this.updateVolumeIcon();
  }

  toggleRepeat() {
    this.isRepeat = !this.isRepeat;
    document.getElementById('repeatBtn').style.color = this.isRepeat ? '#1DB954' : '#9CA3AF';
    if (window.showNotification) showNotification(`Repeat ${this.isRepeat ? 'enabled' : 'disabled'}`);
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    document.getElementById('shuffleBtn').style.color = this.isShuffle ? '#1DB954' : '#9CA3AF';
    if (window.showNotification) showNotification(`Shuffle ${this.isShuffle ? 'enabled' : 'disabled'}`);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.updateVolumeIcon();
  }

  updateVolumeIcon() {
    const muteBtn = document.getElementById('muteBtn');
    const icon = muteBtn.querySelector('i');
    if (this.isMuted || this.audio.volume === 0) {
      icon.className = 'fas fa-volume-mute';
    } else if (this.audio.volume < 0.5) {
      icon.className = 'fas fa-volume-down';
    } else {
      icon.className = 'fas fa-volume-up';
    }
  }

  seek(percent) {
    if (this.audio.duration) {
      this.audio.currentTime = (percent / 100) * this.audio.duration;
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  restoreLastPlayed() {
    const last = storage.lastPlayedSong;
    if (last && last.songIndex !== undefined) {
      const songIndex = last.songIndex;
      if (songIndex >= 0 && songIndex < songs.length) {
        const song = songs[songIndex];
        this.audio.src = song.src;
        this.state.title.textContent = song.name;
        this.state.artist.textContent = song.artist;
        this.state.cover.src = song.cover;
        this.currentIndex = songIndex;

        if (window.updateLikeButton) updateLikeButton();

        const timeDiff = Date.now() - last.timestamp;
        if (timeDiff < CONFIG.AUDIO.PLAYBACK_RESTORE_HOURS * 60 * 60 * 1000 && last.currentTime > 0) {
          this.audio.addEventListener('loadedmetadata', () => {
            this.audio.currentTime = last.currentTime;
          }, { once: true });
        }

        if (window.showNotification) showNotification(`Restored: ${song.name}`);
        return true;
      }
    }
    return false;
  }

  clearLastPlayed() {
    storage.setItem(CONFIG.STORAGE_KEYS.LAST_PLAYED, null);
    storage.lastPlayedSong = null;
    if (window.renderContinuePlayingSection) renderContinuePlayingSection();
    if (window.showNotification) showNotification('Cleared last played song');
  }

  get audio() {
    return this._audio;
  }

  set audio(el) {
    this._audio = el;
  }
}

export const player = new Player();
export default player;
