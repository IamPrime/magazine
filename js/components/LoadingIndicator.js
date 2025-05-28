class LoadingIndicator {
  constructor() {
    this.element = document.querySelector(".shade");
    if (!this.element) {
      this.element = this.createElement();
      document.body.appendChild(this.element);
    }
  }

  createElement() {
    const shade = document.createElement("div");
    shade.className = "shade";
    shade.setAttribute("aria-hidden", "true");

    const spinner = document.createElement("div");
    spinner.className = "sk-fading-circle";
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-label", "Loading");

    for (let i = 1; i <= 12; i++) {
      const circle = document.createElement("div");
      circle.className = `sk-circle${i} sk-circle`;
      spinner.appendChild(circle);
    }

    const numberDiv = document.createElement("div");
    numberDiv.className = "number";
    numberDiv.textContent = "0%";

    shade.appendChild(spinner);
    shade.appendChild(numberDiv);

    return shade;
  }

  show() {
    this.element.style.display = "block";
  }

  hide() {
    this.element.style.display = "none";
  }

  updateProgress(percentage) {
    const numberElement = this.element.querySelector(".number");
    if (numberElement) {
      numberElement.textContent = percentage + "%";
    }
  }
}
