import { CONFIG } from '../config/index.js';

class Storage {
  constructor() {
    this.likes = this.getArray(CONFIG.STORAGE_KEYS.LIKES);
    this.playlists = this.getArray(CONFIG.STORAGE_KEYS.PLAYLISTS);
    this.recentlyPlayed = this.getArray(CONFIG.STORAGE_KEYS.RECENTLY_PLAYED);
    this.lastPlayedSong = this.getObject(CONFIG.STORAGE_KEYS.LAST_PLAYED);
  }

  getArray(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  getObject(key) {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  saveLikes() {
    this.setItem(CONFIG.STORAGE_KEYS.LIKES, this.likes);
  }

  savePlaylists() {
    this.setItem(CONFIG.STORAGE_KEYS.PLAYLISTS, this.playlists);
  }

  saveRecentlyPlayed() {
    this.setItem(CONFIG.STORAGE_KEYS.RECENTLY_PLAYED, this.recentlyPlayed);
  }

  saveLastPlayed(index, currentTime = 0) {
    const data = {
      songIndex: index,
      timestamp: Date.now(),
      currentTime: currentTime
    };
    this.setItem(CONFIG.STORAGE_KEYS.LAST_PLAYED, data);
    this.lastPlayedSong = data;
  }

  addToRecentlyPlayed(songSrc) {
    this.recentlyPlayed = this.recentlyPlayed.filter(id => id !== songSrc);
    this.recentlyPlayed.unshift(songSrc);
    this.recentlyPlayed = this.recentlyPlayed.slice(0, CONFIG.UI.MAX_RECENTLY_PLAYED);
    this.saveRecentlyPlayed();
  }

  clearAll() {
    localStorage.clear();
  }
}

export const storage = new Storage();
export default storage;
