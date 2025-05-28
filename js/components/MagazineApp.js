class MagazineApp extends EventEmitter {
  constructor() {
    super();
    // Components will log events when debug is enabled
    this.debug = true;

    this.imageUrls = [
      "/image/001.jpg",
      "/image/002.jpg",
      "/image/003.jpg",
      "/image/004.jpg",
      "/image/005.jpg",
      "/image/006.jpg",
      "/image/007.jpg",
      "/image/008.jpg",
      "/image/009.jpg",
      "/image/010.jpg",
      "/image/011.jpg",
      "/image/012.jpg",
      "/image/013.jpg",
      "/image/014.jpg",
      "/image/015.jpg",
      "/image/016.jpg",
      "/image/017.jpg",
      "/image/018.jpg",
      "/image/019.jpg",
      "/image/020.jpg",
      "/image/021.jpg",
      "/image/022.jpg",
      "/image/023.jpg",
      "/image/024.jpg",
      "/image/025.jpg",
      "/image/026.jpg",
    ];

    this.components = {
      deviceManager: new DeviceManager(),
      loadingIndicator: new LoadingIndicator(),
      preloader: new ImagePreloader(this.imageUrls),
      viewer: new MagazineViewer(this.imageUrls),
      controls: new NavigationControls(this.imageUrls.length),
      fullscreenManager: new FullscreenManager(),
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startLoading();
  }

  setupEventListeners() {
    try {
      // Preloader events
      this.components.preloader.on("progress", (data) => {
        this.components.loadingIndicator.updateProgress(data.percentage);
        console.log(`Loading progress: ${data.percentage}%`);
      });

      this.components.preloader.on("complete", (data) => {
        console.log(`Loading completed in ${data.loadingTime}ms`);
        this.onLoadingComplete();
      });

      // Viewer events - these maintain your original UI logic
      this.components.viewer.on("pageTurning", (data) => {
        // Original turning logic is handled in the viewer component
      });

      this.components.viewer.on("pageTurned", (data) => {
        this.components.controls.updateCurrentPage(data.page);
        // Original turned logic is handled in the viewer component
      });

      this.components.viewer.on("ready", () => {
        this.emit("ready");
      });

      // Control events
      this.components.controls.on("goToFirst", () => {
        this.components.viewer.goToFirst();
      });

      this.components.controls.on("goToLast", () => {
        this.components.viewer.goToLast();
      });

      this.components.controls.on("nextPage", () => {
        this.components.viewer.nextPage();
      });

      this.components.controls.on("previousPage", () => {
        this.components.viewer.previousPage();
      });

      this.components.controls.on("goToPage", (page) => {
        this.components.viewer.goToPage(page);
      });

      // Setup fullscreen toggle function globally
      window.toggleFullscreen = () => {
        this.components.fullscreenManager.toggle();
      };
    } catch (error) {
      this.handleComponentError("navigation", error);
    }
  }

  startLoading() {
    this.components.loadingIndicator.show();
    this.components.preloader.load();
  }

  onLoadingComplete() {
    this.components.loadingIndicator.hide();

    // Use the progressbar function from your original code
    this.progressbar();
  }

  progressbar() {
    // Hide loading shade
    $(".shade").hide();

    // Show flipbook viewport
    $(".flipbook-viewport").show();

    // Load turn.js and initialize flipbook
    this.loadTurnJS(() => {
      this.components.viewer.setupFlipbook();
    });
  }

  loadTurnJS(callback) {
    if (typeof yepnope !== "undefined" && typeof Modernizr !== "undefined") {
      yepnope({
        test: Modernizr.csstransforms,
        yep: ["js/turn.js"],
        complete: callback,
      });
    } else {
      // Fallback: load turn.js directly
      this.loadScript("js/turn.js", callback);
    }
  }

  loadScript(src, callback) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = callback;
    script.onerror = () => {
      console.error(`Failed to load script: ${src}`);
      // Try to continue anyway
      callback();
    };
    document.head.appendChild(script);
  }

  // Utility method to add pages (from your original addPage function)
  addPage(page, book) {
    this.components.viewer.addPage(page, book);
  }

  // Utility method to handle component errors
  handleComponentError(component, error) {
    console.error(`Component ${component} error:`, error);
    this.emit("componentError", { component, error });
  }
}
