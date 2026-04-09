let queue = [];
let contextSongIndex = null;

function addToQueue(songIndex) {
  const song = songs[songIndex];
  queue.push(songIndex);
  showNotification(`Added "${song.name}" to queue`);
  hideContextMenu();
}

function removeFromQueue(queueIndex) {
  queue.splice(queueIndex, 1);
  renderQueue();
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

function showContextMenu(event, songIndex) {
  const contextMenu = document.getElementById('contextMenu');
  contextSongIndex = songIndex;

  contextMenu.style.display = 'block';
  contextMenu.style.left = event.pageX + 'px';
  contextMenu.style.top = event.pageY + 'px';

  setTimeout(() => {
    document.addEventListener('click', hideContextMenu, { once: true });
  }, 0);
}

function hideContextMenu() {
  document.getElementById('contextMenu').style.display = 'none';
}
