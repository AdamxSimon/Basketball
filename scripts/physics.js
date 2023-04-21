class Physics {
  constructor() {
    this.gravity = 0.6;

    this.loss = 6;

    this.friction = 0.1;
  }

  isPointInsideCircle(xPoint, yPoint, xCircle, yCircle, radius) {
    return (xPoint - xCircle) ** 2 + (yPoint - yCircle) ** 2 <= radius ** 2;
  }

  getBallCollisionPosition(xPoint, yPoint, xBall, yBall, ballRadius) {
    const angle = Math.atan2(yPoint - yBall, xPoint - xBall);

    return {
      x: xPoint - ballRadius * Math.cos(angle),
      y: yPoint - ballRadius * Math.sin(angle),
    };
  }
}
