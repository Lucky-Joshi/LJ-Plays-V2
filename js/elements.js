let audio;
let cover;
let title;
let artist;
let seekBar;
let volumeSlider;
let progressBar;
let playBtn;
let currentTimeEl;
let totalTimeEl;

function initElements() {
  audio = document.getElementById('audio');
  cover = document.getElementById('playerCover');
  title = document.getElementById('playerTitle');
  artist = document.getElementById('playerArtist');
  seekBar = document.getElementById('seekBar');
  volumeSlider = document.getElementById('volumeSlider');
  progressBar = document.getElementById('progressBar');
  playBtn = document.getElementById('playBtn');
  currentTimeEl = document.getElementById('currentTime');
  totalTimeEl = document.getElementById('totalTime');
}
