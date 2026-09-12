# Study Reader

A lightweight, distraction-free HTML study document viewer designed for reading long educational materials, study guides, finance notes, and exported web pages with high-contrast, Obsidian-style typography.

## What It Does

- **Cleans & Sanitizes**: Parses raw `.html` / `.htm` study files and neutralizes legacy styling, scripts, inline event handlers, and distracting page clutter.
- **Calm Reading Interface**: Default dark theme with a polished light theme alternative.
- **Reading Width Control**: 3 column width modes (Compact, Comfortable, Wide) stored in `localStorage`.
- **Text Scaling**: Quick `A-` / `A+` font scaling (70% to 160%) stored in `localStorage`.
- **Semantic Structure**: Beautiful formatting for headings, tables (with horizontal scrolling), code blocks, blockquotes, lists, and images.
- **Zero Copy Required**: Keeps your study files wherever they already reside on your computer. Open via native file picker or drag-and-drop.
- **Back to Top**: Smooth floating button for navigating long study guides.

## How to Run

Study Reader is a 100% static application with zero external dependencies, no build steps, and no frameworks.

### Method 1: Local HTTP Server (Recommended)

Run any lightweight static server from the project directory:

```bash
# Node.js
node server.js

# Or Python 3
python -m http.server 8000
```

Then open your browser to:
**http://localhost:8000**

### Method 2: Direct File Open

You can also double-click `index.html` directly in Windows File Explorer or open it in any modern web browser:

```
file:///C:/SS/CODING-omniroute/index.html
```

## How to Use

1. Click **Open Study File** (or press `Ctrl + O`), or drag-and-drop any `.html` / `.htm` file onto the browser window.
2. The document will immediately render in a distraction-free layout.
3. Adjust text size with **A−** / **A+**, toggle widths (**Compact** / **Comfortable** / **Wide**), or toggle **Light / Dark** mode.
4. Click **Open File** anytime to switch documents without reloading.
