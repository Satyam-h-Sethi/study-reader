# Study Reader

[![Live Demo](https://img.shields.io/badge/Live_Demo-study.satyamsethi.dpdns.org-3b82f6?style=for-the-badge&logo=cloudflare&logoColor=white)](https://study.satyamsethi.dpdns.org)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-study--reader.pages.dev-F38020?style=for-the-badge&logo=cloudflarepages&logoColor=white)](https://study-reader.pages.dev)
[![GitHub](https://img.shields.io/badge/GitHub-Satyam--h--Sethi%2Fstudy--reader-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Satyam-h-Sethi/study-reader)

A lightweight, distraction-free HTML and Markdown study-material reader designed for reading long technical notes, financial documents, and educational exports with high-readability typography.

## Author

**Satyam Sethi**  
GitHub: [@Satyam-h-Sethi](https://github.com/Satyam-h-Sethi)

## Live Web Preview

- **Cloudflare Pages Direct**: [https://study-reader.pages.dev](https://study-reader.pages.dev)
- **Primary Custom Domain**: [https://study.satyamsethi.dpdns.org](https://study.satyamsethi.dpdns.org) *(Configured on Cloudflare Pages; pending external DNS CNAME propagation)*
- **GitHub Repository**: [https://github.com/Satyam-h-Sethi/study-reader](https://github.com/Satyam-h-Sethi/study-reader)

## What It Does

Study Reader allows you to select any local `.html`, `.htm`, `.md`, or `.markdown` document from your computer and immediately view its contents in a clean, high-contrast, developer-documentation reading environment.

It features a client-side zero-dependency Markdown parser, neutralizes legacy, inconsistent, or cramped webpage styles, and strips executable scripts and inline event handlers for a secure, calm reading experience. Loaded documents can also be exported with one click as clean, standalone HTML files.

## Why

Many educational guides, exported reference docs, and technical study materials are formatted as standalone HTML or raw Markdown files. While their information is valuable, raw markdown lacks formatting in standard browsers and original HTML styling is often noisy, cramped, poorly scaled, or tiring on the eyes during extended study sessions.

Study Reader separates the underlying document structure from legacy presentation rules, converting Markdown and HTML directly in the browser and rendering the content in a typography-focused layout optimized for focus and retention.

## Features

- **Unified File Support**: Open `.html`, `.htm`, `.md`, and `.markdown` files directly from your computer without uploading them to any remote server.
- **Client-Side Markdown Engine**: Zero-dependency parser handles headings, code blocks with syntax tags, inline code, bold/italic, lists, blockquotes, horizontal rules, links, and images.
- **Clean Standalone HTML Export**: Download any loaded Markdown or sanitized HTML document as a standalone, beautifully styled `.html` file with embedded CSS and zero reader scripts.
- **Drag-and-Drop**: Drop files anywhere onto the reader interface for instant parsing.
- **Dark Mode by Default**: Tailored dark theme inspired by modern developer documentation, with a one-click Light/Dark theme toggle.
- **Reading Width Modes**: Switch between **Compact** (680px), **Comfortable** (860px), and **Wide** (1140px) reading layouts.
- **Adjustable Font Size**: Fine-tune typography scaling from 70% to 160% via responsive `A-` / `A+` controls.
- **Integrated Read Aloud**: Browser-native text-to-speech engine powered by the Web Speech API (`SpeechSynthesis`), prioritizing high-fidelity Microsoft Natural / Aria voices in Edge with adjustable speed (`0.75×` to `2×`), active paragraph highlighting, and auto-scrolling.
- **Dynamic Document Stats**: Automatic computation of word counts, estimated reading time, and format indicators (`MARKDOWN STUDY DOCUMENT` / `HTML STUDY DOCUMENT`).
- **Preference Persistence**: Theme, reading width, speech rate, and zoom preferences persist automatically across sessions via `localStorage`.
- **Enhanced Typography**: Polished typography and spacing for headings, blockquotes, lists, and images.
- **Responsive Tables & Code Blocks**: Code snippets use high-contrast monospaced styling; tables automatically wrap in scrollable containers to protect layout bounds.
- **HTML Sanitization**: DOM parser filters dangerous tags (`<script>`, `<iframe>`, `<style>`, `<form>`) and strips inline `on*` event handlers.
- **Back-to-Top Navigation**: Smooth floating button for swift navigation through lengthy study documents.
- **Zero Backend Required**: Fully client-side processing with zero third-party dependencies.

## Usage

### Local Quick Start

Requires Node.js (v14+). Zero external npm packages required.

```bash
# Navigate to the project directory
cd study-reader

# Start the local server
node server.js
```

Open your browser to:
**http://localhost:8000**

*(Alternatively, you can open `index.html` directly in any modern web browser).*

### Reading a Document

1. Click **Open File** (or drag and drop an `.html`, `.htm`, `.md`, or `.markdown` file into the window).
2. Use the top toolbar to adjust text size, switch reading width, toggle dark/light theme, or listen with **Read Aloud**.
3. Click **Export HTML** to download the clean, standalone styled document.
4. Use the floating **Back to Top** button to return to the document header.

## Deployment

Study Reader is deployed as a static site on **Cloudflare Pages**:

- Production Branch: `main`
- Build Output Directory: `/` (Static root)
- Custom Hostname: `study.satyamsethi.dpdns.org` (CNAME target: `study-reader.pages.dev`)

## Tech Stack

- **HTML5**: Clean semantic layout structure, accessibility attributes, and native file input handling.
- **CSS3**: Modern CSS custom properties, responsive typography, and theme tokens.
- **Vanilla JavaScript**: Zero-dependency client-side Markdown engine, native `DOMParser` tree walker, sanitization engine, Web Speech API integration, and `localStorage` state management.
- **Node.js**: Zero-dependency standard library HTTP static file server (`server.js`) for local development.

## Project Structure

```
study-reader/
├── index.html                  # Main application interface, header controls, and drop targets
├── style.css                   # Dark/light theme design system and reader typography
├── app.js                      # Markdown engine, DOM parser, sanitizer, speech engine, and exporter
├── server.js                   # Lightweight Node.js local development server
├── Finance_Fundamentals.html   # Sample study document for local demonstration
└── README.md                   # Project documentation
```
