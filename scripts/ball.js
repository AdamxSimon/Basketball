class Ball {
  constructor(court) {
    this.court = court;

    this.isHeld = false;

    this.size = 50;
    this.radius = this.size / 2;

    this.color = "orange";

    this.x = this.radius;
    this.y = this.radius;

    this.xHolding = 0;
    this.yHolding = 0;

    this.xLastHeld = 0;
    this.yLastHeld = 0;

    this.xSpeed = 0;
    this.ySpeed = 0;

    this.maxSpeed = 48;

    this.#addBallInteractionListeners();
  }

  #addBallInteractionListeners() {
    const { canvas } = this.court;

    canvas.addEventListener("mousedown", (event) => this.#holdBall(event));
    canvas.addEventListener("touchstart", (event) => this.#holdBall(event));

    canvas.addEventListener("mouseup", () => this.#releaseBall());
    canvas.addEventListener("touchend", () => this.#releaseBall());
  }

  #holdBall(event) {
    const touch = event.touches?.[0];

    this.isHeld = true;

    const { canvas } = this.court;

    canvas.addEventListener("mousemove", (event) => this.#moveBall(event));
    canvas.addEventListener("touchmove", (event) => this.#moveBall(event));

    if (touch) {
      this.xHolding = touch.clientX;
      this.yHolding = touch.clientY;
    } else {
      this.xHolding = event.clientX;
      this.yHolding = event.clientY;
    }

    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  #releaseBall() {
    if (this.isHeld) {
      this.isHeld = false;

      const { canvas } = this.court;

      canvas.removeEventListener("mousemove", (event) => this.moveBall(event));
      canvas.removeEventListener("touchmove", (event) => this.moveBall(event));
    }
  }

  #moveBall(event) {
    const touch = event.touches?.[0];

    if (touch) {
      this.xHolding = touch.clientX;
      this.yHolding = touch.clientY;
    } else {
      this.xHolding = event.clientX;
      this.yHolding = event.clientY;
    }
  }

  update() {
    if (this.isHeld) {
      this.x = this.xHolding;
      this.y = this.yHolding;

      this.xSpeed = this.x - this.xLastHeld;
      this.ySpeed = this.y - this.yLastHeld;

      this.xLastHeld = this.x;
      this.yLastHeld = this.y;
      return;
    }

    const xNext = this.x + this.xSpeed;
    const yNext = this.y + this.ySpeed;

    const { hoop, physics } = this.court;

    const {
      left: [xLeft, yLeft],
      right: [xRight, yRight],
    } = hoop.getRims();

    const isCollidingWithLeftRim = physics.isPointInsideCircle(
      xLeft,
      yLeft,
      xNext,
      yNext,
      this.radius
    );

    const isCollidingWithRightRim = physics.isPointInsideCircle(
      xRight,
      yRight,
      xNext,
      yNext,
      this.radius
    );

    const { friction, gravity, loss } = physics;

    if (isCollidingWithLeftRim) {
      const { x, y } = physics.getBallCollisionPosition(
        xLeft,
        yLeft,
        this.x,
        this.y,
        this.radius
      );

      this.x = x;
      this.y = y;

      const xPositionDifference = this.x - xLeft;
      const yPositionDifference = this.y - yLeft;

      const totalPositionDifference =
        Math.abs(xPositionDifference) + Math.abs(yPositionDifference);

      const speedProportions = {
        x: xPositionDifference / totalPositionDifference,
        y: yPositionDifference / totalPositionDifference,
      };

      const totalSpeed = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);

      this.xSpeed = totalSpeed * speedProportions.x;
      this.ySpeed = totalSpeed * speedProportions.y + gravity;
    }

    if (isCollidingWithRightRim) {
      const { x, y } = physics.getBallCollisionPosition(
        xRight,
        yRight,
        this.x,
        this.y,
        this.radius
      );

      this.x = x;
      this.y = y;

      const xPositionDifference = this.x - xRight;
      const yPositionDifference = this.y - yRight;

      const totalPositionDifference =
        Math.abs(xPositionDifference) + Math.abs(yPositionDifference);

      const speedProportions = {
        x: xPositionDifference / totalPositionDifference,
        y: yPositionDifference / totalPositionDifference,
      };

      const totalSpeed = Math.abs(this.xSpeed) + Math.abs(this.ySpeed);

      this.xSpeed = totalSpeed * speedProportions.x;
      this.ySpeed = totalSpeed * speedProportions.y + gravity;
    }

    const { left, right, top, bottom } = this.court.getWallCollisions(
      this.radius
    );

    if (!isCollidingWithLeftRim && !isCollidingWithRightRim) {
      const { xCenter, yCenter } = this.court.getCanvasCenter();

      if (this.y > yCenter && hoop.isScoring) {
        hoop.isScoring = false;
      }

      const shouldRegisterPoint =
        !hoop.isScoring &&
        this.y < yCenter &&
        physics.isPointInsideCircle(
          xCenter,
          yCenter + this.radius,
          xNext,
          yNext,
          this.radius
        );

      if (shouldRegisterPoint) {
        hoop.isScoring = true;
        hoop.registerPoint();
      }

      if (xNext > left && xNext < right) {
        this.x = xNext;
      } else if (xNext <= left) {
        this.x = left;
      } else if (xNext >= right) {
        this.x = right;
      }

      if (yNext > top && yNext < bottom) {
        this.y = yNext;
      } else if (yNext <= top) {
        this.y = top;
      } else if (yNext >= bottom) {
        this.y = bottom;
      }

      if (this.x === left || this.x === right) {
        const directionFlag = this.xSpeed >= 0 ? 1 : -1;
        this.xSpeed = -(this.xSpeed - loss * directionFlag);
      }

      if (this.y === bottom) {
        if (this.xSpeed > friction) {
          this.xSpeed -= friction;
        } else if (this.xSpeed < -friction) {
          this.xSpeed += friction;
        } else {
          this.xSpeed = 0;
        }
      }

      if (this.y > top && this.y < bottom) {
        this.ySpeed += gravity;
      } else {
        this.ySpeed = -(this.ySpeed - loss + gravity);
      }
    }

    this.xSpeed =
      this.xSpeed >= 0
        ? Math.min(this.xSpeed, this.maxSpeed)
        : Math.max(this.xSpeed, -this.maxSpeed);
    this.ySpeed =
      this.ySpeed >= 0
        ? Math.min(this.ySpeed, this.maxSpeed)
        : Math.max(this.ySpeed, -this.maxSpeed);
  }

  draw() {
    const { context } = this.court;

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
  }
}
