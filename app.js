/**
 * Study Reader — Core Application Logic
 * A clean, distraction-free HTML study document reader.
 */

(function () {
  'use strict';

  // --- State & Constants ---
  const STORAGE_KEYS = {
    THEME: 'study_reader_theme',
    WIDTH: 'study_reader_width',
    FONT_SIZE: 'study_reader_font_size'
  };

  const DEFAULT_STATE = {
    theme: 'dark',
    width: 'comfortable',
    scale: 100 // percent
  };

  const SCALE_MIN = 70;
  const SCALE_MAX = 160;
  const SCALE_STEP = 10;

  let currentScale = DEFAULT_STATE.scale;

  // --- DOM Elements ---
  const htmlRoot = document.documentElement;
  const fileInput = document.getElementById('fileInput');
  const openFileBtn = document.getElementById('openFileBtn');
  const emptyOpenBtn = document.getElementById('emptyOpenBtn');
  const dropCard = document.getElementById('dropCard');
  const dragOverlay = document.getElementById('dragOverlay');
  const emptyState = document.getElementById('emptyState');
  const readerContainer = document.getElementById('readerContainer');
  const readerContent = document.getElementById('readerContent');
  const fileBadgeContainer = document.getElementById('fileBadgeContainer');
  const currentFileName = document.getElementById('currentFileName');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const decreaseSizeBtn = document.getElementById('decreaseSizeBtn');
  const increaseSizeBtn = document.getElementById('increaseSizeBtn');
  const sizeIndicator = document.getElementById('sizeIndicator');
  const widthButtons = document.querySelectorAll('.seg-btn[data-width-val]');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const toastBanner = document.getElementById('toastBanner');
  const toastMessage = document.getElementById('toastMessage');
  const toastCloseBtn = document.getElementById('toastCloseBtn');
  const metaFileType = document.getElementById('metaFileType');
  const metaWordCount = document.getElementById('metaWordCount');
  const metaReadTime = document.getElementById('metaReadTime');

  // --- Initialize Settings from LocalStorage ---
  function initSettings() {
    // Theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || DEFAULT_STATE.theme;
    setTheme(savedTheme);

    // Reading Width
    const savedWidth = localStorage.getItem(STORAGE_KEYS.WIDTH) || DEFAULT_STATE.width;
    setWidth(savedWidth);

    // Font Size
    const savedSize = parseInt(localStorage.getItem(STORAGE_KEYS.FONT_SIZE), 10);
    if (!isNaN(savedSize) && savedSize >= SCALE_MIN && savedSize <= SCALE_MAX) {
      currentScale = savedSize;
    } else {
      currentScale = DEFAULT_STATE.scale;
    }
    updateFontScale(currentScale);
  }

  // --- Theme Management ---
  function setTheme(theme) {
    const validTheme = (theme === 'light') ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', validTheme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, validTheme);
    } catch (e) {
      // Storage unavailable or private mode
    }
  }

  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }

  // --- Width Management ---
  function setWidth(widthMode) {
    const validModes = ['compact', 'comfortable', 'wide'];
    const mode = validModes.includes(widthMode) ? widthMode : 'comfortable';
    htmlRoot.setAttribute('data-width', mode);

    widthButtons.forEach(btn => {
      if (btn.getAttribute('data-width-val') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    try {
      localStorage.setItem(STORAGE_KEYS.WIDTH, mode);
    } catch (e) {
      // Storage unavailable
    }
  }

  // --- Font Size Management ---
  function updateFontScale(scaleVal) {
    currentScale = Math.max(SCALE_MIN, Math.min(SCALE_MAX, scaleVal));
    htmlRoot.style.setProperty('--reader-scale', (currentScale / 100).toString());
    sizeIndicator.textContent = `${currentScale}%`;

    try {
      localStorage.setItem(STORAGE_KEYS.FONT_SIZE, currentScale.toString());
    } catch (e) {
      // Storage unavailable
    }
  }

  function changeFontSize(delta) {
    updateFontScale(currentScale + delta);
  }

  // --- Toast Messages ---
  let toastTimeout = null;
  function showToast(message, isError = true) {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    toastMessage.textContent = message;
    toastBanner.hidden = false;
    if (isError) {
      toastBanner.style.backgroundColor = 'rgba(239, 68, 68, 0.14)';
      toastBanner.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      toastBanner.style.color = 'var(--text-heading)';
    } else {
      toastBanner.style.backgroundColor = 'var(--accent-subtle)';
      toastBanner.style.borderColor = 'var(--accent-border)';
      toastBanner.style.color = 'var(--text-heading)';
    }

    toastTimeout = setTimeout(() => {
      toastBanner.hidden = true;
    }, 5000);
  }

  function hideToast() {
    toastBanner.hidden = true;
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
  }

  // --- File Verification & Reading ---
  function isValidHtmlFile(file) {
    if (!file) return false;
    const name = file.name.toLowerCase();
    return name.endsWith('.html') || name.endsWith('.htm') || file.type === 'text/html';
  }

  function handleFile(file) {
    if (!file) return;

    if (!isValidHtmlFile(file)) {
      showToast(`"${file.name}" is not an HTML file. Please select a .html or .htm file.`, true);
      return;
    }

    hideToast();

    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      processHtmlContent(content, file.name);
    };

    reader.onerror = function () {
      showToast(`Failed to read "${file.name}". Please check file permissions and try again.`, true);
    };

    reader.readAsText(file);
  }

  // --- HTML Parsing, Sanitization & Content Extraction ---
  function processHtmlContent(rawHtml, filename) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      // Check for parser errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        showToast(`Error parsing "${filename}": ${parserError.textContent.slice(0, 100)}`, true);
        return;
      }

      // Extract title
      const extractedTitle = doc.title || filename;

      // Extract content root
      const contentRoot = extractMeaningfulRoot(doc);

      // Sanitize node tree
      const sanitizedContainer = sanitizeAndFormatTree(contentRoot);

      // Render into reader
      readerContent.innerHTML = '';
      readerContent.appendChild(sanitizedContainer);

      // Post-process: wrap tables for horizontal scroll
      wrapTables(readerContent);

      // Update Header info & Document Metadata
      currentFileName.textContent = filename;
      currentFileName.title = `${filename} (${extractedTitle})`;
      fileBadgeContainer.hidden = false;
      document.title = `${extractedTitle} — Study Reader`;

      // Calculate stats
      updateDocumentStats(readerContent.textContent || '', filename);

      // Show reader view & smooth scroll to top
      emptyState.hidden = true;
      readerContainer.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Error processing HTML:', err);
      showToast(`Could not process "${filename}". The file content could not be rendered.`, true);
    }
  }

  /**
   * Determine the most informative root element in the document.
   */
  function extractMeaningfulRoot(doc) {
    // Check for common semantic content wrappers
    const candidates = [
      'main',
      'article',
      '.markdown-body',
      '#content',
      '#main-content',
      '.content',
      '.main-content',
      '.post-content',
      '.entry-content',
      '.page-content',
      '.study-content'
    ];

    for (const selector of candidates) {
      const el = doc.querySelector(selector);
      if (el && el.textContent.trim().length > 100) {
        return el;
      }
    }

    // Default to body
    return doc.body || doc.documentElement;
  }

  /**
   * Deeply cleans, sanitizes, and strips dangerous tags/attributes from imported HTML.
   */
  function sanitizeAndFormatTree(sourceElement) {
    const container = document.createElement('div');
    container.className = 'reader-body';

    // Tags that must be completely removed
    const DANGEROUS_OR_USELESS_TAGS = new Set([
      'script',
      'style',
      'noscript',
      'template',
      'iframe',
      'frame',
      'frameset',
      'object',
      'embed',
      'applet',
      'form',
      'input',
      'button',
      'select',
      'textarea',
      'canvas',
      'meta',
      'link',
      'base'
    ]);

    // Allowed elements for study reader
    const ALLOWED_TAGS = new Set([
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'blockquote', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
      'pre', 'code', 'kbd', 'samp', 'var',
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'abbr', 'q', 'cite',
      'a', 'img', 'figure', 'figcaption', 'picture', 'source',
      'hr', 'br', 'details', 'summary', 'section', 'article', 'main', 'div', 'span'
    ]);

    function cleanNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.nodeValue);
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }

      const tagName = node.tagName.toLowerCase();

      // Drop dangerous or useless tags
      if (DANGEROUS_OR_USELESS_TAGS.has(tagName)) {
        return null;
      }

      // Check if tag is in allowed set; if not, return cleaned children wrapped in a span/div
      const isAllowed = ALLOWED_TAGS.has(tagName);
      const targetElement = document.createElement(isAllowed ? tagName : 'div');

      // Copy and sanitize safe attributes
      const attrs = node.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attrName = attrs[i].name.toLowerCase();
        const attrVal = attrs[i].value;

        // Skip event handlers (onclick, onload, etc.)
        if (attrName.startsWith('on')) {
          continue;
        }

        // Skip inline styles so reader CSS controls styling completely
        if (attrName === 'style') {
          continue;
        }

        // Link handling
        if (attrName === 'href' && tagName === 'a') {
          const trimmed = attrVal.trim().toLowerCase();
          if (trimmed.startsWith('javascript:') || trimmed.startsWith('vbscript:') || trimmed.startsWith('data:text/html')) {
            continue;
          }
          targetElement.setAttribute('href', attrVal);
          targetElement.setAttribute('target', '_blank');
          targetElement.setAttribute('rel', 'noopener noreferrer');
          continue;
        }

        // Image handling
        if (attrName === 'src' && (tagName === 'img' || tagName === 'source')) {
          const trimmed = attrVal.trim().toLowerCase();
          if (trimmed.startsWith('javascript:') || trimmed.startsWith('vbscript:')) {
            continue;
          }
          targetElement.setAttribute('src', attrVal);
          targetElement.setAttribute('loading', 'lazy');
          continue;
        }

        // Preserve accessibility, IDs for internal links, and table spans
        if (['id', 'alt', 'title', 'colspan', 'rowspan', 'scope', 'aria-label', 'open', 'start'].includes(attrName)) {
          targetElement.setAttribute(attrName, attrVal);
        }
      }

      // Recursively clean children
      const children = Array.from(node.childNodes);
      for (const child of children) {
        const cleanedChild = cleanNode(child);
        if (cleanedChild) {
          targetElement.appendChild(cleanedChild);
        }
      }

      return targetElement;
    }

    const clonedCleaned = cleanNode(sourceElement);
    if (clonedCleaned) {
      container.appendChild(clonedCleaned);
    }

    return container;
  }

  /**
   * Wrap tables inside a responsive scroll wrapper
   */
  function wrapTables(rootEl) {
    const tables = rootEl.querySelectorAll('table');
    tables.forEach(table => {
      if (table.parentElement && table.parentElement.classList.contains('table-wrapper')) {
        return;
      }
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  /**
   * Calculate word count and estimated reading time
   */
  function updateDocumentStats(text, filename) {
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    const count = words.length;
    metaWordCount.textContent = `${count.toLocaleString()} words`;

    const mins = Math.max(1, Math.ceil(count / 220));
    metaReadTime.textContent = `${mins} min read`;

    const ext = filename.split('.').pop().toUpperCase();
    metaFileType.textContent = `${ext} Study Document`;
  }

  // --- Drag and Drop Handlers ---
  let dragCounter = 0;

  function initDragAndDrop() {
    // Window-level drag overlay
    window.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dragCounter++;
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
        dragOverlay.hidden = false;
      }
    });

    window.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter <= 0) {
        dragCounter = 0;
        dragOverlay.hidden = true;
      }
    });

    window.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      dragCounter = 0;
      dragOverlay.hidden = true;

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    // Drop card local cues
    if (dropCard) {
      dropCard.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropCard.classList.add('drag-active');
      });

      dropCard.addEventListener('dragleave', () => {
        dropCard.classList.remove('drag-active');
      });

      dropCard.addEventListener('drop', (e) => {
        e.preventDefault();
        dropCard.classList.remove('drag-active');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFile(e.dataTransfer.files[0]);
        }
      });
    }
  }

  // --- Scroll & Back to Top Logic ---
  function initScrollBehavior() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 280 && !readerContainer.hidden) {
        backToTopBtn.hidden = false;
      } else {
        backToTopBtn.hidden = true;
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Event Listeners Setup ---
  function initEvents() {
    // Open file triggers
    const triggerFileSelect = () => {
      fileInput.value = '';
      fileInput.click();
    };

    openFileBtn.addEventListener('click', triggerFileSelect);
    emptyOpenBtn.addEventListener('click', triggerFileSelect);

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });

    // Theme toggle
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Font size controls
    decreaseSizeBtn.addEventListener('click', () => changeFontSize(-SCALE_STEP));
    increaseSizeBtn.addEventListener('click', () => changeFontSize(SCALE_STEP));

    // Width buttons
    widthButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-width-val');
        if (mode) setWidth(mode);
      });
    });

    // Toast dismiss
    toastCloseBtn.addEventListener('click', hideToast);

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Ctrl+O or Cmd+O to open file
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        triggerFileSelect();
      }
      // Escape to close toast
      if (e.key === 'Escape') {
        hideToast();
      }
    });
  }

  // --- Bootstrap ---
  function init() {
    initSettings();
    initEvents();
    initDragAndDrop();
    initScrollBehavior();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
