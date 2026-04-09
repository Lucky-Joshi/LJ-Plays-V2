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

  saveLikes();
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

function renderLikedSongs() {
  renderSongs("likedSongs", song => likes.includes(song.src));
}

function showLikedSongs() {
  showPage('library');
  setTimeout(() => {
    document.getElementById('likedSongs')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function updateLikedCount() {
  const likedCountEl = document.getElementById('likedCount');
  if (likedCountEl) {
    likedCountEl.textContent = `${likes.length} songs`;
  }
}
