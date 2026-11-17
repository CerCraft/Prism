# Prism

[Русский](#русский) / [English](#english)

---

## Русский

Расширение для Chromium-браузеров для извлечения цветов, шрифтов и SVG-элементов со страниц.

### Возможности

- **Цвета** — сбор, дедупликация и сортировка цветов страницы в `HEX`. Копирование по клику.
- **Шрифты** — определение гарнитур, размеров и начертаний.
- **SVG** — извлечение векторной графики и скачивание в один клик.
- **CSS** — экспорт палитры в виде переменных `:root`.
- **Тема** — поддержка светлой и темной системных тем.

### Стек

- Manifest V3, Vanilla JS, Vite (`@crxjs/vite-plugin`)

### Сборка и установка

Требуется Node.js 18+.

```bash
git clone https://github.com
cd Prism
npm install
npm run build
```

1. Откройте страницу расширений в браузере (`chrome://extensions/`).
2. Включите режим разработчика и нажмите **Загрузить распакованное**, выбрав папку `dist`.

---

## English

A lightweight Chromium extension for extracting colors, typography, and SVG assets from webpages.

### Features

- **Colors** — extract, deduplicate, and sort page colors as `HEX`.
- **Typography** — detect font families, sizes, and weights.
- **SVG** — grab vector elements and download them.
- **CSS Export** — export palettes as `:root` variables.
- **Theme** — auto-adapts to system dark/light mode.

### Stack

- Manifest V3, Vanilla JS, Vite (`@crxjs/vite-plugin`)

### Build & Installation

Requires Node.js 18+.

```bash
git clone https://github.com
cd Prism
npm install
npm run build
```

1. Go to `chrome://extensions/` in your browser.
2. Enable Developer mode and click **Load unpacked**, selecting the `dist` folder.

---

[MIT License](https://github.com/CerCraft/Prism)
