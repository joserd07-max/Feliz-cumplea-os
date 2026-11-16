"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/components/gallery.ts
  var ROTATION_INTERVAL_MS = 4e3;
  function localAsset(path) {
    return new URL(path.replace(/^\/+/, ""), document.baseURI).href;
  }
  function twoDigits(value) {
    return String(value).padStart(2, "0");
  }
  var Gallery = class {
    constructor(root2, photos) {
      this.root = root2;
      this.photos = photos;
      __publicField(this, "carousel");
      __publicField(this, "emptyState");
      __publicField(this, "image");
      __publicField(this, "openButton");
      __publicField(this, "caption");
      __publicField(this, "count");
      __publicField(this, "dots");
      __publicField(this, "previousButton");
      __publicField(this, "nextButton");
      __publicField(this, "toggleButton");
      __publicField(this, "missingMessage");
      __publicField(this, "dialog");
      __publicField(this, "dialogImage");
      __publicField(this, "dialogCaption");
      __publicField(this, "prefersReducedMotion", window.matchMedia("(prefers-reduced-motion: reduce)"));
      __publicField(this, "index", 0);
      __publicField(this, "active", false);
      __publicField(this, "wantsAutoplay", !this.prefersReducedMotion.matches);
      __publicField(this, "timer");
      this.carousel = root2.querySelector("#photo-carousel");
      this.emptyState = root2.querySelector("#photo-empty");
      this.image = root2.querySelector("#carousel-image");
      this.openButton = root2.querySelector("#open-carousel-photo");
      this.caption = root2.querySelector("#carousel-caption");
      this.count = root2.querySelector("#carousel-count");
      this.dots = root2.querySelector("#carousel-dots");
      this.previousButton = root2.querySelector("#carousel-previous");
      this.nextButton = root2.querySelector("#carousel-next");
      this.toggleButton = root2.querySelector("#carousel-toggle");
      this.missingMessage = root2.querySelector("#carousel-missing");
      this.dialog = root2.querySelector("#photo-dialog");
      this.dialogImage = root2.querySelector("#photo-dialog-image");
      this.dialogCaption = root2.querySelector("#photo-dialog-caption");
      this.carousel.hidden = photos.length === 0;
      this.emptyState.hidden = photos.length > 0;
      this.buildDots();
      this.bindEvents();
      if (photos.length > 0) this.render();
      if (photos.length < 2) {
        root2.querySelector(".photo-carousel__controls").hidden = true;
      }
    }
    /** Autoavance solo mientras la vista de carta y fotos está abierta. */
    setActive(active) {
      this.active = active;
      this.syncTimer();
    }
    buildDots() {
      this.photos.forEach((photo, photoIndex) => {
        const dot = document.createElement("button");
        dot.className = "photo-carousel__dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Mostrar foto ${photoIndex + 1}: ${photo.caption}`);
        dot.addEventListener("click", () => {
          this.index = photoIndex;
          this.render();
          this.restartTimer();
        });
        this.dots.append(dot);
      });
    }
    bindEvents() {
      this.previousButton.addEventListener("click", () => this.move(-1));
      this.nextButton.addEventListener("click", () => this.move(1));
      this.toggleButton.addEventListener("click", () => {
        this.wantsAutoplay = !this.wantsAutoplay;
        this.updateToggleButton();
        this.syncTimer();
      });
      this.openButton.addEventListener("click", () => this.openPhoto());
      this.image.addEventListener("error", () => {
        this.image.hidden = true;
        this.openButton.disabled = true;
        this.missingMessage.hidden = false;
      });
      this.root.querySelector("#close-photo")?.addEventListener("click", () => this.dialog.close());
      this.dialog.addEventListener("click", (event) => {
        if (event.target === this.dialog) this.dialog.close();
      });
    }
    move(direction) {
      if (this.photos.length < 2) return;
      this.index = (this.index + direction + this.photos.length) % this.photos.length;
      this.render();
      this.restartTimer();
    }
    render() {
      const photo = this.photos[this.index];
      if (!photo) return;
      this.image.classList.remove("is-changing");
      void this.image.offsetWidth;
      this.image.hidden = false;
      this.openButton.disabled = false;
      this.missingMessage.hidden = true;
      this.image.alt = photo.alt;
      this.image.src = localAsset(photo.src);
      this.image.classList.add("is-changing");
      this.openButton.setAttribute("aria-label", `Ampliar fotograf\xEDa: ${photo.alt}`);
      this.caption.textContent = photo.caption;
      this.count.textContent = `${twoDigits(this.index + 1)} / ${twoDigits(this.photos.length)}`;
      this.dots.querySelectorAll(".photo-carousel__dot").forEach((dot, dotIndex) => {
        dot.setAttribute("aria-pressed", String(dotIndex === this.index));
      });
    }
    openPhoto() {
      const photo = this.photos[this.index];
      if (!photo) return;
      this.dialogImage.src = localAsset(photo.src);
      this.dialogImage.alt = photo.alt;
      this.dialogCaption.textContent = photo.caption;
      this.dialog.showModal();
      this.root.querySelector("#close-photo")?.focus();
    }
    restartTimer() {
      if (!this.active || !this.wantsAutoplay || this.photos.length < 2) return;
      this.syncTimer();
    }
    syncTimer() {
      if (this.timer !== void 0) {
        window.clearInterval(this.timer);
        this.timer = void 0;
      }
      this.updateToggleButton();
      if (!this.active || !this.wantsAutoplay || this.photos.length < 2) return;
      this.timer = window.setInterval(() => this.move(1), ROTATION_INTERVAL_MS);
    }
    updateToggleButton() {
      const isRunning = this.active && this.wantsAutoplay;
      this.toggleButton.setAttribute("aria-label", isRunning ? "Pausar carrusel" : "Reanudar carrusel");
      this.toggleButton.querySelector("span").textContent = isRunning ? "\u2161" : "\u25B6";
    }
  };

  // src/components/letter.ts
  var Letter = class {
    constructor(root2, letter) {
      this.root = root2;
      __publicField(this, "toggleButton");
      __publicField(this, "closeButton");
      __publicField(this, "paper");
      __publicField(this, "envelope");
      this.toggleButton = root2.querySelector("#open-letter");
      this.closeButton = root2.querySelector("#close-letter");
      this.paper = root2.querySelector("#letter-paper");
      this.envelope = root2.querySelector("#letter-envelope");
      root2.querySelector("#letter-eyebrow").textContent = letter.eyebrow;
      root2.querySelector("#letter-title").textContent = letter.title;
      root2.querySelector("#letter-signature").textContent = letter.signature;
      const copy = root2.querySelector("#letter-copy");
      for (const paragraph of letter.paragraphs) {
        const element = document.createElement("p");
        element.textContent = paragraph;
        copy.append(element);
      }
      this.toggleButton.addEventListener("click", () => this.show());
      this.closeButton.addEventListener("click", () => this.hide());
    }
    show() {
      this.envelope.classList.add("is-open");
      this.toggleButton.hidden = true;
      this.paper.hidden = false;
      this.closeButton.hidden = false;
      this.root.querySelector("#letter-title")?.focus({ preventScroll: true });
    }
    hide() {
      this.envelope.classList.remove("is-open");
      this.paper.hidden = true;
      this.toggleButton.hidden = false;
      this.closeButton.hidden = true;
      this.toggleButton.focus({ preventScroll: true });
    }
  };

  // src/components/music-player.ts
  function localAsset2(path) {
    return new URL(path.replace(/^\/+/, ""), document.baseURI).href;
  }
  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
  }
  var MusicPlayer = class {
    constructor(root2, song, onError) {
      this.root = root2;
      this.onError = onError;
      __publicField(this, "audio", document.createElement("audio"));
      __publicField(this, "playButton");
      __publicField(this, "progress");
      __publicField(this, "elapsed");
      __publicField(this, "duration");
      __publicField(this, "volume");
      __publicField(this, "status");
      root2.innerHTML = `
      <div class="music-dock__identity">
        <span class="music-dock__icon" aria-hidden="true">\u266B</span>
        <span class="music-dock__text"><strong></strong><small></small></span>
      </div>
      <button class="music-dock__play" type="button" aria-label="Reproducir canci\xF3n" disabled>
        <span aria-hidden="true">\u25B6</span>
      </button>
      <div class="music-dock__timeline">
        <span class="music-dock__elapsed">0:00</span>
        <input class="music-dock__progress" type="range" min="0" max="100" value="0" aria-label="Posici\xF3n de reproducci\xF3n" disabled />
        <span class="music-dock__duration">0:00</span>
      </div>
      <label class="music-dock__volume-label" aria-label="Volumen">
        <span aria-hidden="true">\u25D6</span>
        <input class="music-dock__volume" type="range" min="0" max="1" step="0.01" value="0.8" aria-label="Volumen de la canci\xF3n" disabled />
      </label>
      <span class="music-dock__status sr-only" role="status" aria-live="polite"></span>`;
      this.audio.preload = "auto";
      this.audio.setAttribute("playsinline", "");
      this.audio.hidden = true;
      this.audio.setAttribute("aria-label", "Reproductor de audio de la canci\xF3n");
      root2.append(this.audio);
      this.playButton = root2.querySelector(".music-dock__play");
      this.progress = root2.querySelector(".music-dock__progress");
      this.elapsed = root2.querySelector(".music-dock__elapsed");
      this.duration = root2.querySelector(".music-dock__duration");
      this.volume = root2.querySelector(".music-dock__volume");
      this.status = root2.querySelector(".music-dock__status");
      root2.querySelector(".music-dock__text strong").textContent = song.title;
      root2.querySelector(".music-dock__text small").textContent = song.artist;
      this.bindEvents();
      if (song.audioPath.trim()) {
        this.audio.src = localAsset2(song.audioPath);
        this.playButton.disabled = false;
        this.volume.disabled = false;
        this.audio.volume = Number(this.volume.value);
        this.status.textContent = "Intentando iniciar la canci\xF3n autom\xE1ticamente.";
        this.audio.load();
        void this.audio.play().catch(() => {
          this.status.textContent = "Toca o haz clic en la p\xE1gina para iniciar la canci\xF3n.";
          const startOnGesture = () => {
            void this.audio.play().then(() => {
              window.removeEventListener("pointerdown", startOnGesture);
              window.removeEventListener("keydown", startOnGesture);
            }).catch(() => void 0);
          };
          window.addEventListener("pointerdown", startOnGesture);
          window.addEventListener("keydown", startOnGesture);
        });
      } else {
        this.status.textContent = "A\xF1ade una canci\xF3n en la configuraci\xF3n para activar el reproductor.";
      }
    }
    bindEvents() {
      this.playButton.addEventListener("click", () => {
        if (this.audio.paused) {
          void this.audio.play().catch(() => this.showError("El navegador no pudo reproducir este archivo de audio."));
        } else {
          this.audio.pause();
        }
      });
      this.audio.addEventListener("play", () => this.setPlaying(true));
      this.audio.addEventListener("pause", () => this.setPlaying(false));
      this.audio.addEventListener("ended", () => {
        this.setPlaying(false);
        this.status.textContent = "La canci\xF3n termin\xF3.";
      });
      this.audio.addEventListener("loadedmetadata", () => {
        this.duration.textContent = formatTime(this.audio.duration);
        this.progress.disabled = false;
        this.volume.disabled = false;
      });
      this.audio.addEventListener("timeupdate", () => {
        this.elapsed.textContent = formatTime(this.audio.currentTime);
        if (Number.isFinite(this.audio.duration) && this.audio.duration > 0) {
          this.progress.value = String(this.audio.currentTime / this.audio.duration * 100);
        }
      });
      this.audio.addEventListener("error", () => this.showError("No se pudo cargar la canci\xF3n. Revisa la ruta y el formato del archivo."));
      this.progress.addEventListener("input", () => {
        if (Number.isFinite(this.audio.duration)) {
          this.audio.currentTime = Number(this.progress.value) / 100 * this.audio.duration;
        }
      });
      this.volume.addEventListener("input", () => {
        this.audio.volume = Number(this.volume.value);
      });
    }
    setPlaying(playing) {
      this.playButton.setAttribute("aria-label", playing ? "Pausar canci\xF3n" : "Reproducir canci\xF3n");
      this.playButton.querySelector("span").textContent = playing ? "\u2161" : "\u25B6";
      this.root.classList.toggle("is-playing", playing);
      this.status.textContent = playing ? "Reproduciendo." : "Reproducci\xF3n pausada.";
    }
    showError(message) {
      this.setPlaying(false);
      this.status.textContent = message;
      this.onError(message);
      this.playButton.disabled = true;
      this.progress.disabled = true;
      this.volume.disabled = true;
    }
  };

  // src/components/navigation.ts
  var Navigation = class {
    constructor(root2, onNavigate) {
      this.root = root2;
      this.onNavigate = onNavigate;
      __publicField(this, "current", "intro");
      __publicField(this, "transitioning", false);
    }
    get experience() {
      return this.current;
    }
    navigate(next) {
      if (this.transitioning || next === this.current) return;
      const active = this.root.querySelector('[data-view="active"]');
      const target = this.root.querySelector(`[data-view="${next}"]`);
      if (!active || !target) return;
      this.transitioning = true;
      active.classList.add("is-leaving");
      window.setTimeout(() => {
        active.hidden = true;
        active.classList.remove("is-leaving");
        target.hidden = false;
        target.dataset.view = "active";
        active.dataset.view = this.current;
        this.current = next;
        this.onNavigate?.(next);
        target.classList.add("is-entering");
        target.addEventListener(
          "animationend",
          () => {
            target.classList.remove("is-entering");
            this.transitioning = false;
            target.querySelector("h1, h2")?.focus({ preventScroll: true });
          },
          { once: true }
        );
        window.setTimeout(() => {
          this.transitioning = false;
        }, 700);
      }, 260);
    }
  };

  // src/data/content.ts
  var content = {
    introEyebrow: "Hoy celebramos a alguien muy especial",
    title: "Feliz cumplea\xF1os,\nmi amor",
    subtitle: "Prepar\xE9 algo para recordarte cu\xE1nto te quiero. \u{1F973}",
    surpriseHint: "Hay una peque\xF1a sorpresa esperando por ti",
    story: {
      eyebrow: "CADA MOMENTO NOS TRAJO AQU\xCD",
      title: "Nuestros recuerdos",
      description: "Peque\xF1os momentos para volver a mirar contigo.",
      photos: [
        { src: "assets/images/WhatsApp Image 2026-11-12 at 6.26.17 PM.jpeg", alt: "Un recuerdo especial juntos", caption: "Un recuerdo para compartir" },
        { src: "assets/images/WhatsApp Image 2026-11-12 at 6.26.17 PM (1).jpeg", alt: "Un momento especial juntos", caption: "Un momento especial" },
        { src: "assets/images/WhatsApp Image 2026-11-12 at 6.25.55 PM.jpeg", alt: "Un d\xEDa para recordar", caption: "Un d\xEDa para recordar" },
        { src: "assets/images/WhatsApp Image 2026-11-12 at 6.25.55 PM (1).jpeg", alt: "Un recuerdo bonito", caption: "Un recuerdo bonito" },
        { src: "assets/images/WhatsApp Image 2026-11-12 at 6.25.55 PM (2).jpeg", alt: "Un momento para guardar en el coraz\xF3n", caption: "Para guardar en el coraz\xF3n" },
        { src: "assets/images/IMG-20261112-WA0021.jpg", alt: "Una foto para celebrar este d\xEDa", caption: "Celebrando tu d\xEDa" },
        { src: "assets/images/IMG-20261112-WA0024.jpg", alt: "Un instante que quiero recordar", caption: "Un instante especial" },
        { src: "assets/images/IMG-20261112-WA0025.jpg", alt: "Un recuerdo que me hace sonre\xEDr", caption: "Una sonrisa para ti" },
        { src: "assets/images/IMG-20261112-WA0026.jpg", alt: "Un momento bonito para recordar", caption: "Momentos bonitos" },
        { src: "assets/images/IMG-20261112-WA0027.jpg", alt: "Un recuerdo muy querido", caption: "Con mucho cari\xF1o" },
        { src: "assets/images/IMG-20261112-WA0028.jpg", alt: "Un recuerdo especial para ti", caption: "Siempre en mi coraz\xF3n" }
      ]
    },
    letter: {
      eyebrow: "",
      title: "Feliz cumplea\xF1os, mi amor",
      paragraphs: [
        "\u{1F382}Feliz cumplea\xF1os, mi amor hermoso.\u2764\uFE0F\u{1F382} Hoy es un d\xEDa muy especial, porque celebra la vida de una de las personas m\xE1s importantes y maravillosas que tengo en mi coraz\xF3n: t\xFA, mi amor.",
        "\u263A\uFE0F\u2764\uFE0FLe doy gracias a Dios por tu vida, por haberte puesto en mi camino y por permitirme sentir este amor tan bonito que, a pesar de la distancia, sigue creciendo cada d\xEDa m\xE1s.",
        "La distancia podr\xE1 separar nuestros cuerpos, pero jam\xE1s podr\xE1 separar dos corazones que se aman de verdad. \u2764\uFE0F\u2764\uFE0FPorque, aunque hoy no podamos compartir el mismo espacio, seguimos unidos \u{1F469}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F468}por este amor, por nuestros sentimientos, por nuestros sue\xF1os y por las ganas de alg\xFAn d\xEDa poder abrazarnos sin tener que despedirnos con tristeza. No importa cu\xE1ntos kil\xF3metros haya entre nosotros, mi coraz\xF3n siempre encontrar\xE1 el camino hacia ti, porque t\xFA eres mi lugar bonito, incluso cuando est\xE1s lejos.\u2764\uFE0F\u{1FAF6}",
        "En este nuevo a\xF1o de vida, deseo que Dios te bendiga inmensamente, que te regale mucha salud, felicidad, paz, sabidur\xEDa y que cada uno de tus sue\xF1os se convierta en realidad.\u{1F64F}\u{1F3FC} Que nunca te falten motivos para sonre\xEDr, fuerzas para luchar y amor para sentirte la persona especial que eres. Y, sobre todo, deseo que la vida nos regale la oportunidad de estar juntos, de abrazarnos durante horas y de convertir toda esta distancia en una historia de amor que alg\xFAn d\xEDa podamos recordar con una sonrisa.",
        "Gracias por existir, por formar parte de mi vida y por ocupar un lugar tan especial en mi coraz\xF3n. Hoy quisiera regalarte el mundo entero, pero mientras llega el d\xEDa en que pueda darte todos esos abrazos y besos que tengo guardados para ti, te regalo estas palabras, todo mi cari\xF1o y la certeza de que la distancia no cambia lo que siento por ti ni disminuye mis ganas de seguir construyendo algo hermoso contigo.\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F468}",
        "Feliz cumplea\xF1os, mi vida, mi amor y mi persona especial. Que hoy seas tan feliz como mereces y que nunca dudes de lo mucho que te amo. Aunque estemos lejos, seguimos unidos por ese hilo invisible que une nuestros corazones y que ninguna distancia puede romper.\u{1F64F}\u{1F3FC}\u2764\uFE0F Te AMO MY HUMBERT\u{1F495}\u2763\uFE0FHBD mi amor \u{1F60D} bonito. \u{1F973}"
      ],
      signature: "Con todo mi amor \u2764\uFE0F"
    },
    song: {
      title: "Junto a ti",
      artist: "Alex Sirvent feat. Ximena Herrera",
      audioPath: "assets/audio/Alex Sirvent feat Ximena Herrera - Junto a ti.mp3"
    }
  };

  // src/main.ts
  var root = document.querySelector("#app");
  if (!root) throw new Error("No se encontr\xF3 el elemento ra\xEDz de la aplicaci\xF3n.");
  root.innerHTML = `
  <main class="experience-shell">
    <div class="ambient ambient--wine" aria-hidden="true"></div>
    <div class="ambient ambient--gold" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>
    <div class="sparkles" aria-hidden="true">
      <i class="sparkle sparkle--one"></i><i class="sparkle sparkle--two"></i>
      <i class="sparkle sparkle--three"></i><i class="sparkle sparkle--four"></i>
      <i class="sparkle sparkle--five"></i><i class="sparkle sparkle--six"></i>
      <i class="sparkle sparkle--seven"></i>
    </div>
    <div class="heart-rain" id="heart-rain" aria-hidden="true"></div>

    <header class="topbar" aria-label="Encabezado">
      <a class="wordmark" href="#intro-title" aria-label="Eternal Love, inicio" data-navigate="intro"><span class="wordmark__mark">E</span><span>ETERNAL <span class="wordmark__light">LOVE</span></span></a>
      <nav class="chapter-nav" aria-label="Navegaci\xF3n de experiencias">
        <button type="button" data-navigate="intro" aria-current="page">Inicio</button>
        <button type="button" data-navigate="letter">Carta y fotos</button>
      </nav>
    </header>

    <section class="view intro" data-view="active" aria-labelledby="intro-title">
      <div class="intro__content">
        <div class="heart-emblem" aria-hidden="true">
          <span class="heart-emblem__halo"></span><span class="heart-emblem__heart">\u2665</span>
          <span class="heart-emblem__orbit heart-emblem__orbit--one"></span>
          <span class="heart-emblem__orbit heart-emblem__orbit--two"></span>
          <span class="heart-emblem__spark heart-emblem__spark--a">\u2726</span>
          <span class="heart-emblem__spark heart-emblem__spark--b">\u2727</span>
        </div>
        <p class="eyebrow"><span class="eyebrow__line"></span><span id="intro-eyebrow"></span><span class="eyebrow__line"></span></p>
        <h1 class="intro__title" id="intro-title" tabindex="-1"></h1>
        <p class="intro__subtitle" id="intro-subtitle"></p>
        <button class="primary-button" type="button" data-navigate="letter">
          <span>Abrir mi regalo</span><span class="primary-button__arrow" aria-hidden="true">\u2197</span>
        </button>
        <p class="intro__hint"><span class="hint-star" aria-hidden="true">\u2726</span><span id="intro-hint"></span></p>
      </div>
      <div class="side-note side-note--left" aria-hidden="true">UNA HISTORIA \xB7 UN SENTIMIENTO</div>
      <div class="side-note side-note--right" aria-hidden="true">CON TODO MI AMOR</div>
      <div class="scroll-cue" aria-hidden="true"><span></span></div>
    </section>

    <section class="view letter-view" data-view="letter" aria-labelledby="story-title" hidden>
      <div class="letter-experience">
        <section class="memory-column" aria-labelledby="story-title">
          <p class="eyebrow"><span class="eyebrow__line"></span><span id="story-eyebrow"></span><span class="eyebrow__line"></span></p>
          <h1 id="story-title" class="chapter-title" tabindex="-1"></h1>
          <p id="story-description" class="chapter-description"></p>
          <div id="photo-empty" class="photo-empty" role="status" hidden>
            <div class="photo-empty__frame" aria-hidden="true"><span>\u2726</span><span>\u2665</span><span>\u2726</span></div>
            <h2>Aqu\xED ir\xE1n nuestros momentos</h2>
            <p>A\xF1ade tus fotograf\xEDas en <code>src/data/content.ts</code> y aparecer\xE1n junto a la carta. No hay recuerdos inventados.</p>
          </div>
          <div id="photo-carousel" class="photo-carousel" role="region" aria-roledescription="carrusel" aria-label="Fotograf\xEDas de nuestra historia" hidden>
            <button class="photo-carousel__picture" id="open-carousel-photo" type="button" aria-label="Ampliar fotograf\xEDa actual">
              <img id="carousel-image" class="photo-carousel__image" alt="" />
              <span id="carousel-missing" class="photo-carousel__missing" hidden>No se pudo cargar esta foto</span>
              <span class="photo-carousel__zoom" aria-hidden="true">\u2197</span>
            </button>
            <div class="photo-carousel__caption"><span id="carousel-caption"></span><span id="carousel-count"></span></div>
            <div class="photo-carousel__controls" aria-label="Controles del carrusel">
              <button id="carousel-previous" type="button" aria-label="Foto anterior">\u2190</button>
              <div id="carousel-dots" class="photo-carousel__dots" aria-label="Elegir fotograf\xEDa"></div>
              <button id="carousel-toggle" type="button" aria-label="Pausar carrusel"><span aria-hidden="true">\u2161</span></button>
              <button id="carousel-next" type="button" aria-label="Foto siguiente">\u2192</button>
            </div>
          </div>
        </section>

        <section class="letter-column" id="letter-experience" aria-labelledby="letter-title">
          <p class="eyebrow letter-column__eyebrow"><span class="eyebrow__line"></span><span id="letter-eyebrow"></span><span class="eyebrow__line"></span></p>
          <div class="letter-envelope" id="letter-envelope">
            <div class="letter-envelope__flap" aria-hidden="true"></div>
            <div class="letter-envelope__seal" aria-hidden="true">E</div>
            <div class="letter-envelope__face" aria-hidden="true"></div>
            <button class="letter-open" id="open-letter" type="button"><span class="letter-open__icon" aria-hidden="true">\u2726</span><span>Abrir mi carta</span><span aria-hidden="true">\u2197</span></button>
            <article class="letter-paper" id="letter-paper" aria-labelledby="letter-title" hidden>
              <span class="letter-paper__rule" aria-hidden="true"></span>
              <h2 id="letter-title" tabindex="-1"></h2>
              <div id="letter-copy" class="letter-paper__copy"></div>
              <p class="letter-paper__signoff" id="letter-signature"></p>
              <span class="letter-paper__heart" aria-hidden="true">\u2665</span>
              <button class="letter-close text-button" id="close-letter" type="button" hidden>Doblar la carta <span aria-hidden="true">\u2197</span></button>
            </article>
          </div>
          <p class="letter-column__hint" id="player-error">La canci\xF3n te acompa\xF1a desde el reproductor de abajo.</p>
        </section>

        <div class="letter-actions"><button class="text-button" type="button" data-navigate="intro"><span aria-hidden="true">\u2190</span> Volver al inicio</button></div>
      </div>
    </section>

    <dialog class="photo-dialog" id="photo-dialog" aria-labelledby="photo-dialog-caption">
      <button class="photo-dialog__close" id="close-photo" type="button" aria-label="Cerrar fotograf\xEDa">\xD7</button>
      <figure><img id="photo-dialog-image" alt="" /><figcaption id="photo-dialog-caption"></figcaption></figure>
    </dialog>

    <footer class="footer"><span>PARA SIEMPRE, EN CADA DETALLE</span><span class="footer__heart" aria-hidden="true">\u2665</span><span>ETERNAL LOVE</span></footer>
    <aside class="music-dock" id="music-player" aria-label="Reproductor persistente"></aside>
    <div class="sr-only" role="status" aria-live="polite" id="navigation-status"></div>
  </main>`;
  var text = (selector, value) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };
  text("#intro-eyebrow", content.introEyebrow);
  text("#intro-title", content.title);
  text("#intro-subtitle", content.subtitle);
  text("#intro-hint", content.surpriseHint);
  text("#story-eyebrow", content.story.eyebrow);
  text("#story-title", content.story.title);
  text("#story-description", content.story.description);
  text("#player-error", content.song.audioPath ? "La canci\xF3n est\xE1 lista en el reproductor de abajo." : "A\xF1ade un archivo de audio local para activar la canci\xF3n.");
  new Letter(root, content.letter);
  var gallery = new Gallery(root, content.story.photos);
  gallery.setActive(true);
  var heartRain = root.querySelector("#heart-rain");
  if (heartRain) {
    window.setInterval(() => {
      const heart = document.createElement("span");
      heart.className = "heart-rain__heart";
      heart.textContent = Math.random() > 0.45 ? "\u2665" : "\u{1F973}";
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.setProperty("--fall-duration", `${5 + Math.random() * 5}s`);
      heart.style.setProperty("--heart-size", `${12 + Math.random() * 18}px`);
      heartRain.append(heart);
      window.setTimeout(() => heart.remove(), 10500);
    }, 480);
  }
  var playerRoot = root.querySelector("#music-player");
  if (!playerRoot) throw new Error("No se encontr\xF3 el reproductor persistente.");
  new MusicPlayer(playerRoot, content.song, (message) => {
    const status2 = root.querySelector("#player-error");
    if (status2) status2.textContent = message;
  });
  var status = root.querySelector("#navigation-status");
  var navigation = new Navigation(root, (experience) => {
    gallery.setActive(experience === "letter");
    root.querySelectorAll(".chapter-nav [data-navigate]").forEach((button) => {
      if (button.dataset.navigate === experience) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (status) {
      status.textContent = experience === "intro" ? "Sorpresa inicial." : "Carta y fotograf\xEDas.";
    }
  });
  root.querySelectorAll("[data-navigate]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      const next = control.dataset.navigate;
      if (next === "intro" || next === "letter") navigation.navigate(next);
    });
  });
})();
