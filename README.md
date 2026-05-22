# 🤖 AI Desktop Agent

An AI-powered desktop automation assistant built using React and Node.js that can control desktop applications, execute voice commands, automate workflows, and monitor system activities.

---

# 🚀 Features

## 🎙️ Voice Assistant
- Speech recognition support
- Wake word support (`Hey Superman`)
- Hands-free desktop automation

## 🧠 Smart Command Processing
- Intent detection system
- Smart command routing
- AI-style interaction

## 🌐 Open Applications
Supports opening:
- Chrome
- VS Code
- Notepad
- Calculator
- CMD
- Spotify
- File Explorer
- Photos

## 🌍 Open Websites
Supports:
- YouTube
- GitHub
- Google Search

## 🚀 Productivity Modes

### 💻 Coding Mode
Automatically opens:
- VS Code
- Chrome
- CMD
- GitHub

### 📚 Study Mode
Automatically opens:
- Chrome
- YouTube
- ChatGPT

### 🎵 Entertainment Mode
Automatically opens:
- YouTube
- Spotify

### 🧑‍💻 Interview Mode
Automatically opens:
- LeetCode
- GitHub
- VS Code

---

# 📸 Screenshot Capture
Capture desktop screenshots instantly.

---

# 🔊 Volume Controls
- Volume Up
- Volume Down
- Mute
- Unmute

---

# 📊 System Monitoring
Displays:
- CPU Information
- RAM Usage
- Battery Percentage
- Free Memory

---

# 📜 Command History
Stores previously executed commands.

---

# ⭐ Smart Memory
Tracks frequently used applications and modes.

---

# 🛠️ Tech Stack

## Frontend
- React
- Axios
- CSS

## Backend
- Node.js
- Express.js

## Libraries Used
- systeminformation
- screenshot-desktop
- loudness
- annyang
- child_process

---

# 📂 Project Structure

```bash
AI-Desktop-Agent/
│
├── backend/
│   ├── server.js
│   ├── memory.json
│   ├── history.json
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── components/
│   │       └── WakeWord.js
│   │
│   ├── public/
│   └── package.json
│
└── README.md
