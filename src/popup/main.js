import './style.css';

const elements = {
  host: document.querySelector('#page-host'),
  scanIndicator: document.querySelector('#scan-indicator'),
  colors: document.querySelector('#colors'),
  colorCount: document.querySelector('#color-count'),
  typography: document.querySelector('#typography'),
  typeCount: document.querySelector('#type-count'),
  logos: document.querySelector('#logos'),
  logoCount: document.querySelector('#logo-count'),
  exportButton: document.querySelector('#export-css'),
  toast: document.querySelector('#toast'),
};

let palette = [];
let toastTimer;

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove('is-visible'), 2200);
}

async function copyText(value, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement('textarea');
    field.value = value;
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) {
      showToast('Не удалось скопировать в буфер обмена');
      return false;
    }
  }
  showToast(successMessage);
  return true;
}

function addEmptyState(container, message) {
  const empty = document.createElement('p');
  empty.className = 'empty-state';
  empty.textContent = message;
  container.append(empty);
}

function renderColors(colors) {
  palette = colors;
  elements.colorCount.textContent = String(colors.length);
  elements.colors.replaceChildren();
  if (!colors.length) {
    addEmptyState(elements.colors, 'Цвета на странице не найдены');
    return;
  }

  for (const color of colors) {
    const button = document.createElement('button');
    button.className = 'color-swatch';
    button.type = 'button';
    button.setAttribute('aria-label', `Скопировать цвет ${color.hex}`);

    const chip = document.createElement('span');
    chip.className = 'swatch-chip';
    chip.style.backgroundColor = color.hex;
    chip.setAttribute('aria-hidden', 'true');

    const value = document.createElement('span');
    value.className = 'swatch-value';
    value.textContent = color.hex;
    button.append(chip, value);
    button.addEventListener('click', async () => {
      button.classList.add('is-copied');
      value.textContent = 'Скопировано ✓';
      const copied = await copyText(color.hex, `Скопировано: ${color.hex}`);
      if (!copied) {
        button.classList.remove('is-copied');
        value.textContent = color.hex;
        return;
      }
      setTimeout(() => {
        if (value.isConnected) {
          button.classList.remove('is-copied');
          value.textContent = color.hex;
        }
      }, 1200);
    });
    elements.colors.append(button);
  }
}

function renderTypography(styles) {
  elements.typeCount.textContent = String(styles.length);
  elements.typography.replaceChildren();
  if (!styles.length) {
    addEmptyState(elements.typography, 'Текстовые стили на странице не найдены');
    return;
  }

  for (const style of styles) {
    const item = document.createElement('div');
    item.className = 'type-item';

    const preview = document.createElement('span');
    preview.className = 'type-preview';
    preview.textContent = 'Аа';
    preview.style.fontFamily = style.fontFamily;
    preview.style.fontSize = `${Math.min(style.fontSize, 28)}px`;
    preview.style.fontWeight = style.fontWeight;
    preview.style.lineHeight = '1';
    preview.setAttribute('aria-hidden', 'true');

    const details = document.createElement('div');
    details.className = 'type-details';
    const spec = document.createElement('div');
    spec.className = 'type-spec';
    spec.textContent = `${style.fontFamily} · ${style.fontSize}px / ${style.lineHeight}px · ${style.fontWeight}`;
    details.append(spec);
    item.append(preview, details);
    elements.typography.append(item);
  }
}

function sanitizeSvg(markup) {
  const parsed = new DOMParser().parseFromString(markup, 'image/svg+xml');
  const svg = parsed.documentElement;
  if (svg.localName !== 'svg' || parsed.querySelector('parsererror')) return null;

  for (const node of svg.querySelectorAll('script, foreignObject, iframe, object, embed')) {
    node.remove();
  }
  for (const node of [svg, ...svg.querySelectorAll('*')]) {
    for (const attribute of [...node.attributes]) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith('on') || ((name === 'href' || name.endsWith(':href')) && /^\s*javascript:/i.test(value))) {
        node.removeAttribute(attribute.name);
      }
    }
  }

  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(svg)}`;
}

function downloadSvg(logo, index) {
  if (!logo.markup) {
    if (logo.url) {
      const link = document.createElement('a');
      link.href = logo.url;
      link.download = `prism-vector-${index + 1}.svg`;
      link.rel = 'noopener';
      link.click();
      showToast('Скачать SVG');
    } else {
      showToast('Не удалось подготовить SVG для скачивания');
    }
    return;
  }

  const cleanMarkup = sanitizeSvg(logo.markup);
  if (!cleanMarkup) {
    showToast('Не удалось подготовить SVG для скачивания');
    return;
  }
  const url = URL.createObjectURL(new Blob([cleanMarkup], { type: 'image/svg+xml;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `prism-vector-${index + 1}.svg`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Скачать SVG');
}

function renderLogos(logos) {
  elements.logoCount.textContent = String(logos.length);
  elements.logos.replaceChildren();
  if (!logos.length) {
    addEmptyState(elements.logos, 'SVG на странице не найдены');
    return;
  }

  logos.forEach((logo, index) => {
    const button = document.createElement('button');
    button.className = 'logo-button';
    button.type = 'button';
    button.title = `Скачать SVG ${index + 1}`;
    button.setAttribute('aria-label', `Скачать SVG ${index + 1}`);

    const preview = document.createElement('img');
    preview.className = 'logo-preview';
    preview.alt = '';
    if (logo.markup) {
      const cleanMarkup = sanitizeSvg(logo.markup);
      if (cleanMarkup) {
        preview.src = URL.createObjectURL(new Blob([cleanMarkup], { type: 'image/svg+xml' }));
        preview.addEventListener('load', () => URL.revokeObjectURL(preview.src), { once: true });
      }
    } else if (logo.url) {
      preview.src = logo.url;
    }

    const label = document.createElement('span');
    label.className = 'logo-label';
    label.textContent = `SVG ${index + 1}`;
    button.append(preview, label);
    button.addEventListener('click', () => downloadSvg(logo, index));
    elements.logos.append(button);
  });
}

async function scanActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id || !tab.url || !/^https?:/i.test(tab.url)) {
    throw new Error('Системная страница недоступна для анализа');
  }
  elements.host.textContent = new URL(tab.url).hostname;

  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      const colors = new Map();
      const colorToHex = (value) => {
        const match = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)/i);
        if (!match || (match[4] !== undefined && Number.parseFloat(match[4]) === 0)) return null;
        const channels = match.slice(1, 4).map((part) =>
          Math.max(0, Math.min(255, Number.parseInt(part, 10)))
            .toString(16)
            .padStart(2, '0'),
        );
        return `#${channels.join('')}`.toUpperCase();
      };
      const visible = (element, rect = element.getBoundingClientRect()) => {
        if (!rect.width || !rect.height) return false;
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0;
      };

      for (const element of [...document.querySelectorAll('body *')].slice(0, 8000)) {
        const rect = element.getBoundingClientRect();
        if (!visible(element, rect)) continue;
        const style = getComputedStyle(element);
        for (const value of [style.color, style.backgroundColor, style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor]) {
          const hex = colorToHex(value);
          if (hex) colors.set(hex, (colors.get(hex) || 0) + 1);
        }
      }

      const palette = [...colors]
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, 12)
        .map(([hex]) => ({ hex }));

      const typographyCounts = new Map();
      for (const element of document.querySelectorAll('h1, h2, h3, h4, p, a, button')) {
        if (!visible(element)) continue;
        const style = getComputedStyle(element);
        const fontFamily = style.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
        const fontSize = Number.parseFloat(style.fontSize);
        const lineHeight = Number.parseFloat(style.lineHeight);
        const fontWeight = style.fontWeight;
        if (!fontFamily || !Number.isFinite(fontSize)) continue;
        const entry = {
          fontFamily,
          fontSize: Math.round(fontSize),
          lineHeight: Number.isFinite(lineHeight) ? Math.round(lineHeight) : Math.round(fontSize * 1.2),
          fontWeight,
        };
        const key = `${entry.fontFamily}|${entry.fontSize}|${entry.fontWeight}|${entry.lineHeight}`;
        const existing = typographyCounts.get(key);
        if (existing) existing.count += 1;
        else typographyCounts.set(key, { ...entry, count: 1 });
      }
      const typography = [...typographyCounts.values()]
        .sort((left, right) => right.count - left.count || right.fontSize - left.fontSize)
        .slice(0, 6);

      const logos = [];
      const seen = new Set();
      for (const element of document.querySelectorAll('svg')) {
        if (logos.length >= 30) break;
        const rect = element.getBoundingClientRect();
        if (!visible(element, rect) || Math.max(rect.width, rect.height) < 16 || Math.max(rect.width, rect.height) > 500) continue;
        const markup = element.outerHTML;
        if (seen.has(markup)) continue;
        seen.add(markup);
        logos.push({ markup, url: null });
      }

      for (const image of document.querySelectorAll('img[src]')) {
        if (logos.length >= 30) break;
        const rect = image.getBoundingClientRect();
        if (!visible(image, rect) || Math.max(rect.width, rect.height) < 16 || Math.max(rect.width, rect.height) > 500) continue;
        const url = image.currentSrc || image.src;
        if (!/\.svg(?:[?#]|$)/i.test(url) || seen.has(url)) continue;
        seen.add(url);
        let markup = null;
        try {
          const response = await fetch(url);
          if (response.ok) markup = await response.text();
        } catch {
          // Для SVG с ограниченным CORS оставляем ссылку на исходный файл.
        }
        logos.push({ markup, url });
      }

      return { palette, typography, logos };
    },
  });

  if (!result?.result) throw new Error('Не удалось получить данные со страницы');
  renderColors(result.result.palette);
  renderTypography(result.result.typography);
  renderLogos(result.result.logos);
  elements.scanIndicator.classList.remove('is-scanning');
  elements.scanIndicator.classList.add('is-ready');
  elements.scanIndicator.setAttribute('aria-label', 'Сканирование завершено');
}

elements.exportButton.addEventListener('click', () => {
  if (!palette.length) return;
  const variables = palette.map((color, index) => `  --color-${index + 1}: ${color.hex};`).join('\n');
  copyText(`:root {\n${variables}\n}`, 'CSS-переменные скопированы');
});

scanActiveTab().catch(() => {
  elements.host.textContent = '';
  elements.colors.replaceChildren();
  elements.typography.replaceChildren();
  elements.logos.replaceChildren();
  elements.colorCount.textContent = '0';
  elements.typeCount.textContent = '0';
  elements.logoCount.textContent = '0';
  elements.exportButton.disabled = true;
  elements.scanIndicator.classList.remove('is-scanning');
  elements.scanIndicator.setAttribute('aria-label', 'Сканирование недоступно');
  addEmptyState(elements.colors, 'Системная страница недоступна для анализа');
});