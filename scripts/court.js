class Court {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");

    this.physics = new Physics();

    this.ball = new Ball({ court: this, physics: this.physics });
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
      centerX: Math.floor(this.width / 2),
      centerY: Math.floor(this.height / 2),
    };
  }
}

const court = new Court();
