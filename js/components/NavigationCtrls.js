class NavigationControls extends EventEmitter {
  constructor(totalPages) {
    super();
    this.totalPages = totalPages;
    this.currentPage = 1;
    this.element = this.getExistingElement();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
  }

  getExistingElement() {
    return (
      document.querySelector(".bottom") || document.querySelector("footer")
    );
  }

  setupEventListeners() {
    $(document).ready(() => {
      // Set total pages
      $("#pageTot").html(this.totalPages);

      // Use unified event handling
      this.setupNavigationEvents();
    });
  }

  setupNavigationEvents() {
    // First page button
    $("#toFirst").on("click touchend", (e) => {
      e.preventDefault();
      this.emit("goToFirst");
    });

    // Last page button
    $("#toLast").on("click touchend", (e) => {
      e.preventDefault();
      this.emit("goToLast");
    });

    // Previous page - simplified logic
    $("#prev-fa").on("click touchend", (e) => {
      e.preventDefault();
      this.emit("previousPage");
    });

    // Next page - simplified logic
    $("#next-fa").on("click touchend", (e) => {
      e.preventDefault();
      this.emit("nextPage");
    });

    // Page number input
    $("#pageNum").on("change keypress", (e) => {
      if (e.type === "keypress" && e.which !== 13) return; // Only handle Enter key

      try {
        const pageNum = parseInt($(e.target).val());
        if (pageNum > 0 && pageNum <= this.totalPages) {
          this.emit("goToPage", pageNum);
        } else {
          this.showInvalidPageError(pageNum);
          $(e.target).val(this.currentPage); // Reset to current page
        }
      } catch (error) {
        console.error("Error navigating to page:", error);
      }
    });
  }

  // Add page validation
  isValidPage(pageNum) {
    return (
      Number.isInteger(pageNum) && pageNum >= 1 && pageNum <= this.totalPages
    );
  }

  // Add keyboard navigation support
  setupKeyboardNavigation() {
    $(document).on("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          this.emit("previousPage");
          break;
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          this.emit("nextPage");
          break;
        case "Home":
          e.preventDefault();
          this.emit("goToFirst");
          break;
        case "End":
          e.preventDefault();
          this.emit("goToLast");
          break;
      }
    });
  }

  updateNavigationState() {
    // Disable/enable buttons based on current page
    $("#toFirst, #prev-fa").prop("disabled", this.currentPage <= 1);
    $("#toLast, #next-fa").prop(
      "disabled",
      this.currentPage >= this.totalPages
    );

    // Update ARIA attributes for accessibility
    $("#pageNum").attr(
      "aria-label",
      `Current page ${this.currentPage} of ${this.totalPages}`
    );
  }

  destroy() {
    // Cleanup event listeners when component is destroyed
    $(document).off("keydown");
    $("#toFirst, #toLast, #prev-fa, #next-fa, #pageNum").off();
  }

  updateCurrentPage(page) {
    if (this.currentPage === page) return; // prevent unnecessary updates

    const previousPage = this.currentPage; // Store previous page BEFORE updating
    this.currentPage = page;
    $("#pageNum").val(page);
    this.emit("pageChanged", { page, previousPage }); // Now previousPage is correct
  }

  show() {
    if (this.element) {
      $(this.element).css("display", "block");
    }
  }

  hide() {
    if (this.element) {
      $(this.element).css("display", "none");
    }
  }

  showElement(selector) {
    $(selector).css("display", "block");
  }

  hideElement(selector) {
    $(selector).css("display", "none");
  }

  showToast(message, type = "info", duration = 3000) {
    // Remove any existing toast
    this.removeExistingToast();

    // Create toast container if it doesn't exist
    this.createToastContainer();

    // Create toast element
    const toast = this.createToastElement(message, type);

    // Add toast to container
    const container = document.getElementById("toast-container");
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Auto-remove toast after duration
    setTimeout(() => {
      this.removeToast(toast);
    }, duration);

    // Return toast element for manual control if needed
    return toast;
  }

  createToastContainer() {
    if (!document.getElementById("toast-container")) {
      const container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
  }

  createToastElement(message, type) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    // Add icon based on type
    const icon = this.getToastIcon(type);

    toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icon}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `;

    return toast;
  }

  getToastIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || icons["info"];
  }

  removeToast(toast) {
    if (toast && toast.parentNode) {
      toast.classList.remove("show");
      toast.classList.add("hide");

      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  removeExistingToast() {
    const existingToasts = document.querySelectorAll(".toast");
    existingToasts.forEach((toast) => this.removeToast(toast));
  }

  // Enhanced showInvalidPageError method using the new toast
  showInvalidPageError(pageNum) {
    const message = `Please enter a valid page number between 1 and ${this.totalPages}. You entered: ${pageNum}`;
    this.showToast(message, "error", 4000);
  }
}
