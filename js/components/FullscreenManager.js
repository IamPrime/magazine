class FullscreenManager extends EventEmitter {
  constructor() {
    super();
    this.isFullscreen = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for fullscreen change events
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
    
    document.addEventListener('webkitfullscreenchange', () => {
      this.isFullscreen = !!document.webkitFullscreenElement;
    });
    
    document.addEventListener('mozfullscreenchange', () => {
      this.isFullscreen = !!document.mozFullScreenElement;
    });
    
    document.addEventListener('MSFullscreenChange', () => {
      this.isFullscreen = !!document.msFullscreenElement;
    });
  }

  toggle() {
    if (!this.isFullscreen) {
      this.enter();
    } else {
      this.exit();
    }
  }

  enter() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  exit() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  isInFullscreen() {
    return this.isFullscreen;
  }
}
