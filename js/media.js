function initializeMediaSession() {
  if ('mediaSession' in navigator) {
    setTimeout(() => {
      showNotification('Lock screen controls are now available!');
    }, 5000);

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

    audio.addEventListener('loadedmetadata', updateMediaSessionPositionState);
    audio.addEventListener('timeupdate', updateMediaSessionPositionState);

    console.log('Media Session API initialized');
  } else {
    console.log('Media Session API not supported');
  }
}

function updateMediaSession(song) {
  if ('mediaSession' in navigator) {
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
    setTimeout(() => {
      indicator.classList.add('hidden');
    }, 3000);
  }
}
