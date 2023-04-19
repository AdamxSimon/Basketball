class Ball {
  constructor(config = {}) {
    this.court = config.court;

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

    this.court.canvas.addEventListener("mousedown", (event) =>
      this.holdBall(event)
    );
    this.court.canvas.addEventListener("touchstart", (event) =>
      this.holdBall(event)
    );
    this.court.canvas.addEventListener("mouseup", () => this.dropBall());
    this.court.canvas.addEventListener("touchend", () => this.dropBall());
  }

  isInsideCircle(xPoint, yPoint, xCircle, yCircle, radius) {
    return (xPoint - xCircle) ** 2 + (yPoint - yCircle) ** 2 <= radius ** 2;
  }

  holdBall(event) {
    const touch = event.touches?.[0];

    this.isHeld = true;
    this.court.canvas.addEventListener("mousemove", (event) =>
      this.moveBall(event)
    );
    this.court.canvas.addEventListener("touchmove", (event) =>
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

  dropBall() {
    if (this.isHeld) {
      this.isHeld = false;
      this.court.canvas.removeEventListener("mousemove", (event) =>
        this.moveBall(event)
      );
      this.court.canvas.removeEventListener("touchmove", (event) =>
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
      rightCollisionPoint: this.court.width - this.radius,
      topCollisionPoint: this.radius,
      bottomCollisionPoint: this.court.height - this.radius,
    };
  }

  getCollisionPosition(xOutside, yOutside) {
    const deltaX = xOutside - this.x;
    const deltaY = yOutside - this.y;

    const angle = Math.atan2(yOutside - this.y, xOutside - this.x);

    return {
      xNewCenter: xOutside - this.radius * Math.cos(angle),
      yNewCenter: yOutside - this.radius * Math.sin(angle),
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

    const {
      leftRim: [xLeftRim, yLeftRim],
      rightRim: [xRightRim, yRightRim],
    } = this.court.hoop.getRims();

    const leftRimCollision = this.isInsideCircle(
      xLeftRim,
      yLeftRim,
      nextX,
      nextY,
      this.radius
    );

    const rightRimCollision = this.isInsideCircle(
      xRightRim,
      yRightRim,
      nextX,
      nextY,
      this.radius
    );

    if (leftRimCollision) {
      const { xNewCenter, yNewCenter } = this.getCollisionPosition(
        xLeftRim,
        yLeftRim
      );

      this.x = xNewCenter;
      this.y = yNewCenter;

      const xPositionDifference = this.x - xLeftRim;
      const yPositionDifference = this.y - yLeftRim;

      const totalPositionDifference =
        Math.abs(xPositionDifference) + Math.abs(yPositionDifference);

      const speedProportions = {
        x: xPositionDifference / totalPositionDifference,
        y: yPositionDifference / totalPositionDifference,
      };

      const totalSpeed = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);

      this.xSpeed = totalSpeed * speedProportions.x;
      this.ySpeed = totalSpeed * speedProportions.y;
    }

    if (rightRimCollision) {
      const { xNewCenter, yNewCenter } = this.getCollisionPosition(
        xRightRim,
        yRightRim
      );

      this.x = xNewCenter;
      this.y = yNewCenter;

      const xPositionDifference = this.x - xRightRim;
      const yPositionDifference = this.y - yRightRim;

      const totalPositionDifference =
        Math.abs(xPositionDifference) + Math.abs(yPositionDifference);

      const speedProportions = {
        x: xPositionDifference / totalPositionDifference,
        y: yPositionDifference / totalPositionDifference,
      };

      const totalSpeed = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);

      this.xSpeed = totalSpeed * speedProportions.x;
      this.ySpeed = totalSpeed * speedProportions.y;
    }

    if (!leftRimCollision && !rightRimCollision) {
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
  }

  draw() {
    this.court.context.beginPath();
    this.court.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.court.context.fillStyle = this.color;
    this.court.context.fill();
    this.court.context.stroke();
  }
}
