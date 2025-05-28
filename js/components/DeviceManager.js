class DeviceManager {
  constructor() {
    this.userAgent = navigator.userAgent;
    this.deviceType = this.detectDevice();
    this.init();
  }

  detectDevice() {
    if (
      this.userAgent.indexOf("Android") > -1 ||
      this.userAgent.indexOf("Linux") > -1
    ) {
      return "android";
    } else if (this.userAgent.indexOf("iPhone") > -1) {
      return "ios";
    } else if (this.userAgent.indexOf("Windows Phone") > -1) {
      return "windows";
    }
    return "desktop";
  }

  init() {
    if (this.deviceType === "ios") {
      // Prevent elastic bouncing on iOS devices
      this.disableIOSBounce();
    }
  }

  disableIOSBounce() {
    $(window)
      .on("scroll.elasticity", function (e) {
        e.preventDefault();
      })
      .on("touchmove.elasticity", function (e) {
        e.preventDefault();
      });
  }

  getDeviceType() {
    return this.deviceType;
  }
}
