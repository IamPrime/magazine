class ImagePreloader extends EventEmitter {
  constructor(imageUrls) {
    super();
    this.imageUrls = imageUrls;
    this.loadedCount = 0;
    this.totalImages = imageUrls.length;
    this.startTime = this.getNowFormatDate();
  }

  load() {
    let numbers = 0;

    for (let i = 0; i < this.totalImages; i++) {
      const img = new Image();
      img.src = this.imageUrls[i];

      img.onerror = () => {
        numbers += (1 / this.totalImages) * 100;
        this.handleProgress(numbers);
      };

      img.onload = () => {
        numbers += (1 / this.totalImages) * 100;
        this.handleProgress(numbers);
      };
    }
  }

  handleProgress(numbers) {
    $(".number").html(parseInt(numbers) + "%");
    console.log(numbers);

    this.emit("progress", {
      percentage: parseInt(numbers),
      loaded: Math.round((numbers / 100) * this.totalImages),
      total: this.totalImages,
    });

    if (Math.round(numbers) === 100) {
      const endTime = this.getNowFormatDate();
      const loadingTime = endTime - this.startTime;

      this.emit("complete", {
        loadingTime,
        totalImages: this.totalImages,
      });
    }
  }

  getNowFormatDate() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const strDate = date.getDate();
    const monthStr = month >= 1 && month <= 9 ? "0" + month : month;
    const dateStr = strDate >= 0 && strDate <= 9 ? "0" + strDate : strDate;

    return (
      date.getFullYear() +
      "" +
      monthStr +
      "" +
      dateStr +
      "" +
      date.getHours() +
      "" +
      date.getMinutes() +
      "" +
      date.getSeconds()
    );
  }
}
