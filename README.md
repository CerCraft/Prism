# Prism — Design System & Asset Inspector

[🇷🇺 Русский](#-русский) • [🇬🇧 English](#-english)

---

## 🇷🇺 Русский

**Prism** — минималистичное расширение для браузеров на базе Chromium (Chrome, Edge, Яндекс Браузер, Brave), которое в один клик разбирает любой открытый сайт на базовые составляющие: цветовую палитру, типографику и векторную графику (SVG).

Инструмент создан для дизайнеров, арт-директоров и фронтенд-разработчиков, чтобы ускорить анализ референсов, сбор мудбордов и аудит верстки.

### ✨ Возможности

* **Палитра цветов:** Автоматически собирает все цвета текста, фонов и границ на странице, сортирует их по частоте использования и переводит в `HEX`. Клик по карточке копирует код в буфер обмена.
* **Типографика:** Находит используемые гарнитуры, размеры шрифтов, насыщенность (`font-weight`) и межстрочные интервалы (`line-height`) с живым предпросмотром начертания.
* **Вектор и логотипы:** Извлекает все инлайновые `<svg>` и векторные `<img>` со страницы, отображает их на контрастном шахматном фоне и позволяет скачать любой элемент в виде чистого `.svg`-файла в один клик.
* **Экспорт в CSS:** Генерирует готовый блок `:root` с CSS-переменными для всей найденной палитры и копирует его в буфер обмена.
* **Адаптивная тема:** Интерфейс автоматически подстраивается под светлую и темную тему операционной системы.

### 🛠 Технологический стек

* **Manifest V3** (Chrome Extensions API: `activeTab`, `scripting`)
* **Vanilla JavaScript (ES6+)** — без тяжелых фреймворков и лишних зависимостей
* **Vite** + **[@crxjs/vite-plugin](https://crxjs.dev)** — быстрая сборка и HMR при разработке

### 🚀 Сборка и запуск локально

Для сборки проекта вам понадобится установленный [Node.js](https://nodejs.org) (версии 18 или выше).

1. **Клонируйте репозиторий и перейдите в папку проекта:**
   ```bash
   git clone https://github.com
   cd prism-extension
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Соберите проект:**
   ```bash
   npm run build
   ```
   После выполнения команды в корне проекта появится папка `dist/` с готовым расширением.

*(Опционально)* Для запуска в режиме разработки с горячей перезагрузкой используйте:
```bash
npm run dev
```

### 🧩 Установка в браузер

1. Откройте страницу управления расширениями в вашем браузере:
   * Chrome: `chrome://extensions/`
   * Edge: `edge://extensions/`
   * Яндекс Браузер: `browser://extensions/`
2. Включите **«Режим разработчика»** (переключатель в правом верхнем углу).
3. Нажмите кнопку **«Загрузить распакованное расширение»** (Load unpacked).
4. Выберите сгенерированную папку **`dist`**.
5. Закрепите иконку **Prism** на панели расширений, откройте любой сайт и нажмите на неё.

---

## 🇬🇧 English

**Prism** is a minimalist Chromium browser extension (Chrome, Edge, Brave, Arc) that instantly inspects any active webpage and extracts its core design tokens: color palette, typography scale, and vector assets (SVG).

Built for UI/UX designers and frontend engineers to speed up design audits, moodboard creation, and competitive analysis.

### ✨ Features

* **Color Palette Extraction:** Scans computed styles (`color`, `background-color`, `border-color`), deduplicates values, sorts them by frequency, and converts them to uppercase `HEX`. Click any swatch to copy.
* **Typography Inspector:** Detects active font families, sizes, weights, and line heights across headings, paragraphs, and interactive elements with a live specimen preview.
* **SVG & Logo Downloader:** Extracts inline `<svg>` elements and `.svg` images, previews them over a transparency checkerboard grid, and lets you download clean `.svg` files with a single click.
* **One-Click CSS Variables:** Exports the extracted color palette as ready-to-use `:root` CSS custom properties directly to your clipboard.
* **Native Dark & Light Mode:** Automatically adapts to your system color scheme (`prefers-color-scheme`).

### 🛠 Tech Stack

* **Manifest V3** (`activeTab`, `scripting` APIs)
* **Vanilla JavaScript (ES6+)** — zero runtime overhead
* **Vite** + **[@crxjs/vite-plugin](https://crxjs.dev)** — fast bundling and HMR support

### 🚀 Build & Local Setup

Make sure you have [Node.js](https://nodejs.org) (v18+) installed on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd prism-extension
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the extension:**
   ```bash
   npm run build
   ```
   This will generate the production-ready extension inside the `dist/` directory.

*(Optional)* To run the development server with hot module replacement:
```bash
npm run dev
```

### 🧩 Load into Browser

1. Open the extensions page in your Chromium-based browser:
   * Chrome: `chrome://extensions/`
   * Edge: `edge://extensions/`
   * Brave: `brave://extensions/`
2. Enable **Developer mode** using the toggle in the top-right corner.
3. Click **Load unpacked**.
4. Select the **`dist`** folder created during the build step.
5. Pin **Prism** to your toolbar, navigate to any website, and click the icon to inspect.

---

### 📄 License

MIT License — feel free to use, modify, and distribute.
