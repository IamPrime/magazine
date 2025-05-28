class MagazineViewer extends EventEmitter {
  constructor(imageUrls) {
    super();
    this.imageUrls = imageUrls;
    this.totalPages = imageUrls.length;
    this.currentPage = 1;
    this.element = this.getOrCreateElement();
  }

  getOrCreateElement() {
    let main = document.querySelector("main");
    if (!main) {
      main = document.createElement("main");
      const viewport = document.createElement("div");
      viewport.className = "flipbook-viewport hidden";
      viewport.setAttribute("role", "region");
      viewport.setAttribute("aria-label", "Magazine pages");

      const container = document.createElement("div");
      container.className = "container";

      const flipbook = document.createElement("div");
      flipbook.className = "flipbook";

      container.appendChild(flipbook);
      viewport.appendChild(container);
      main.appendChild(viewport);

      document.body.appendChild(main);
    }
    return main;
  }

  setupFlipbook() {
    this.generatePageHTML();
    this.initializeTurnJS();
    this.setupKeyboardNavigation();

    const viewport = this.element.querySelector(".flipbook-viewport");
    viewport.classList.remove("hidden");
    viewport.style.display = "block";

    this.emit("ready");
  }

  generatePageHTML() {
    const flipbookElement = this.element.querySelector(".flipbook");
    let tagHtml = "";

    for (let i = 1; i <= this.totalPages; i++) {
      const pageNumber = i < 10 ? "0" + i : i;
      const backgroundStyle = `background:url(image/0${pageNumber}.jpg) center center no-repeat;background-size:contain;`;

      if (i === 1) {
        tagHtml += `<div id="first" style="${backgroundStyle}"></div>`;
      } else if (i === this.totalPages) {
        tagHtml += `<div id="end" style="${backgroundStyle}"></div>`;
      } else {
        tagHtml += `<div style="${backgroundStyle}"></div>`;
      }
    }

    flipbookElement.innerHTML = tagHtml;
  }

  initializeTurnJS() {
    const flipbookElement = $(this.element.querySelector(".flipbook"));
    let w = $(window).width();
    let h = $(window).height();

    flipbookElement.width(w).height(h);

    $(window).resize(() => {
      w = $(window).width();
      h = $(window).height();
      flipbookElement.width(w).height(h);
    });

    flipbookElement.turn({
      width: w,
      height: h,
      elevation: 50,
      pages: this.totalPages,
      display: "single",
      gradients: true,
      autoCenter: true,
      duration: 1000, // Animation speed
      acceleration: true, // Hardware acceleration
      when: {
        turning: (e, page, view) => {
          this.handlePageTurning(page);
        },
        turned: (e, page, view) => {
          this.handlePageTurned(page);
        },
      },
    });

    flipbookElement.bind("turned", (event, page, view) => {
      this.currentPage = page;
      this.emit("pageTurned", { page, view });
    });
  }

  handlePageTurning(page) {
    if (page === 1) {
      $(".bottom").css("display", "none");
      $(".mark").css("display", "block");
    } else {
      $(".bottom").css("display", "block");
      $(".mark").css("display", "none");
    }

    if (page === this.totalPages) {
      $(".nextPage").css("display", "none");
    } else {
      $(".nextPage").css("display", "block");
    }

    this.emit("pageTurning", {
      page,
      isFirstPage: page === 1,
      isLastPage: page === this.totalPages,
    });
  }

  handlePageTurned(page) {
    console.log(page);
    this.currentPage = page;

    const total = $(".flipbook").turn("pages");

    if (page === 1) {
      $(".return").css("display", "none");
      $(".bottom").css("display", "none");
    } else {
      $(".return").css("display", "block");
      $(".bottom").css("display", "block");
    }

    if (page === 2) {
      $(".catalog").css("display", "block");
    } else {
      $(".catalog").css("display", "none");
    }

    $("#pageNum").val($(".flipbook").turn("page"));

    this.emit("pageTurned", {
      page,
      total,
      isFirstPage: page === 1,
      isLastPage: page === this.totalPages,
      isSecondPage: page === 2,
    });
  }

  setupKeyboardNavigation() {
    $(window).bind("keydown", (e) => {
      if (e.keyCode === 37) {
        // Left arrow
        $(".flipbook").turn("previous");
      } else if (e.keyCode === 39) {
        // Right arrow
        $(".flipbook").turn("next");
      }
    });
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      $(".flipbook").turn("page", page);
    }
  }

  nextPage() {
    $(".flipbook").turn("next");
  }

  previousPage() {
    $(".flipbook").turn("previous");
  }

  goToFirst() {
    $(".flipbook").turn("page", 1);
  }

  goToLast() {
    $(".flipbook").turn("page", this.totalPages);
  }

  getCurrentPage() {
    return $(".flipbook").turn("page");
  }

  addPage(pageContent, book) {
    const element = $('<div class="page-container"></div>');

    if (
      pageContent.includes(".jpg") ||
      pageContent.includes(".png") ||
      pageContent.includes(".jpeg")
    ) {
      const img = $("<img />");
      img.attr("src", pageContent);
      element.append(img);
    } else {
      element.html(pageContent);
    }

    element.attr("data-page-number", book.turn("pages") + 1);
    book.turn("addPage", element, book.turn("pages") + 1);
  }
}
