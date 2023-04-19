class Ball {
  constructor(config = {}) {
    this.canvas = config.canvas;
    this.context = config.context;

    this.physics = config.physics;

    this.isHeld = false;

    this.size = config.size || 50;
    this.radius = this.size / 2;

    this.color = config.color || "orange";

    this.x = config.x || this.radius;
    this.y = config.y || this.radius;

    this.holdX = 0;
    this.holdY = 0;

    this.lastHeldX = 0;
    this.lastHeldY = 0;

    this.xSpeed = 0;
    this.ySpeed = 0;

    this.maxSpeed = 1;

    this.canvas.addEventListener("mousedown", (event) => this.holdBall(event));
    this.canvas.addEventListener("touchstart", (event) => this.holdBall(event));
    this.canvas.addEventListener("mouseup", () => this.dropBall());
    this.canvas.addEventListener("touchend", () => this.dropBall());
  }

  isColliding(x, y) {
    return (x - this.x) ** 2 + (y - this.y) ** 2 <= this.radius ** 2;
  }

  holdBall(event) {
    const touch = event.touches?.[0];
    const isColliding = touch
      ? this.isColliding(touch.clientX, touch.clientY)
      : this.isColliding(event.clientX, event.clientY);

    if (isColliding) {
      this.isHeld = true;
      this.canvas.addEventListener("mousemove", (event) =>
        this.moveBall(event)
      );
      this.canvas.addEventListener("touchmove", (event) =>
        this.moveBall(event)
      );

      if (touch) {
        this.holdX = touch.clientX;
        this.holdY = touch.clientY;
      } else {
        this.holdX = event.clientX;
        this.holdY = event.clientY;
      }

      this.xSpeed = 0;
      this.ySpeed = 0;
    }
  }

  dropBall() {
    if (this.isHeld) {
      this.isHeld = false;
      this.canvas.removeEventListener("mousemove", (event) =>
        this.moveBall(event)
      );
      this.canvas.removeEventListener("touchmove", (event) =>
        this.moveBall(event)
      );
    }
  }

  moveBall(event) {
    const touch = event.touches?.[0];
    if (touch) {
      this.holdX = touch.clientX;
      this.holdY = touch.clientY;
    } else {
      this.holdX = event.clientX;
      this.holdY = event.clientY;
    }
  }

  getCollisionPoints() {
    return {
      leftCollisionPoint: this.radius,
      rightCollisionPoint: this.canvas.width - this.radius,
      topCollisionPoint: this.radius,
      bottomCollisionPoint: this.canvas.height - this.radius,
    };
  }

  update() {
    if (this.isHeld) {
      this.x = this.holdX;
      this.y = this.holdY;

      this.xSpeed = this.x - this.lastHeldX;
      this.ySpeed = this.y - this.lastHeldY;

      this.lastHeldX = this.x;
      this.lastHeldY = this.y;
      return;
    }

    const nextX = this.x + this.xSpeed;
    const nextY = this.y + this.ySpeed;

    const {
      leftCollisionPoint,
      rightCollisionPoint,
      topCollisionPoint,
      bottomCollisionPoint,
    } = this.getCollisionPoints();

    if (nextX > leftCollisionPoint && nextX < rightCollisionPoint) {
      this.x = nextX;
    } else if (nextX <= leftCollisionPoint) {
      this.x = leftCollisionPoint;
    } else if (nextX >= rightCollisionPoint) {
      this.x = rightCollisionPoint;
    }

    if (nextY > topCollisionPoint && nextY < bottomCollisionPoint) {
      this.y = nextY;
    } else if (nextY <= topCollisionPoint) {
      this.y = topCollisionPoint;
    } else if (nextY >= bottomCollisionPoint) {
      this.y = bottomCollisionPoint;
    }

    if (this.x === leftCollisionPoint || this.x === rightCollisionPoint) {
      this.xSpeed = -this.xSpeed;
    }

    if (this.y === bottomCollisionPoint) {
      if (this.xSpeed > this.physics.friction) {
        this.xSpeed -= this.physics.friction;
      } else if (this.xSpeed < -this.physics.friction) {
        this.xSpeed += this.physics.friction;
      } else {
        this.xSpeed = 0;
      }
    }

    if (this.y > topCollisionPoint && this.y < bottomCollisionPoint) {
      this.ySpeed += this.physics.gravity;
    } else {
      this.ySpeed = -(this.ySpeed - this.physics.loss);
    }
  }

  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
    this.context.fillStyle = this.color;
    this.context.fill();
    this.context.stroke();
  }
}

const ball = new Ball({ canvas, context, physics });
