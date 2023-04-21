class Court {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");

    this.physics = new Physics();

    this.ball = new Ball(this);
    this.hoop = new Hoop(this);

    this.#addResizeListener();
  }

  #addResizeListener() {
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.height = document.body.offsetHeight;
    this.canvas.width = document.body.offsetWidth;

    this.height = this.canvas.clientHeight;
    this.width = this.canvas.clientWidth;
  }

  getCanvasCenter() {
    return {
      xCenter: Math.floor(this.width / 2),
      yCenter: Math.floor(this.height / 2),
    };
  }

  getWallCollisions(radius) {
    return {
      left: radius,
      right: this.width - radius,
      top: radius,
      bottom: this.height - radius,
    };
  }
}

const court = new Court();
