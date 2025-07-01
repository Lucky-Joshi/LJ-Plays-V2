# 🎵 LJ Plays V2  
*A beautiful, responsive music player web app built with Vanilla JavaScript and Tailwind CSS.*

---

## 🚀 Live Demo

- 🌐 [lj-plays-v2.netlify.app](https://lj-plays-v2.netlify.app/)  
- 📦 [GitHub Repository](https://github.com/Lucky-Joshi/LJ-Plays-V2.git)

---

## ✨ Features

### 🎧 Core Music Player  
- Play / Pause / Next / Previous controls  
- Volume slider and seek bar  
- Repeat mode  
- Autoplay on song end  
- Real-time progress updates

### 📁 Dynamic Song Library  
- Songs loaded dynamically from `/assets/`  
- Displays song title, artist, and cover  
- Clickable song cards to play instantly

### ❤️ Like System  
- Like/unlike songs via heart icon  
- Liked songs saved in `localStorage`  
- View all liked songs in Library tab

### 🎼 Playlist System  
- Create custom playlists  
- Add songs to playlists via modal  
- Playlists persist in `localStorage`  
- Browse and play from your playlists

### 🔍 Search  
- Live search filter for songs by name

### 📱 Responsive UI  
- Sidebar navigation for desktop  
- Slide-in drawer menu on mobile  
- Sticky footer music player  
- Splash screen with animated logo on load

---

## 🛠 Tech Stack

| Technology      | Purpose                              |
|-----------------|--------------------------------------|
| HTML5           | Structure of the app                 |
| Tailwind CSS    | Styling & layout (utility-first CSS)|
| Vanilla JavaScript | Core functionality & logic       |
| localStorage    | Persistent likes and playlists       |

---

## 📷 Screenshots

> _Add screenshots or screen recordings here to show how the app looks on desktop and mobile._

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Lucky-Joshi/LJ-Plays-V2.git
cd LJ-Plays-V2
```

### 2. Add Songs and Covers

Place your `.mp3` and `.jpg` files into the `/assets/` folder like so:

```
/assets/
  ├── song1.mp3
  ├── song2.mp3
  ├── image1.jpg
  ├── image2.jpg
  ...
```

Make sure the names match the arrays in `app.js`.

### 3. Run the App

Just open `index.html` in any modern web browser. No build tools or servers required.

---

## 🧪 Optional Enhancements

- Lyrics popup modal  
- Shuffle & queue system  
- Media Session API support  
- Firebase sync for likes/playlists  
- Download or share song feature  
- Dark/light mode toggle

---

## 📄 License

This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute it freely.

---

## 🙌 Credits

Made with 💚 by [Lucky Joshi](https://github.com/Lucky-Joshi)