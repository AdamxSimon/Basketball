class Hoop {
  constructor(court) {
    this.court = court;

    this.hoopWidth = 80;

    this.boardHeight = 120;
    this.boardWidth = 200;
    this.boardOffset = 30;
    this.boardColor = "white";

    this.poleWidth = 20;
    this.poleColor = "black";

    this.isScoring = false;
    this.points = 0;
  }

  getRims() {
    const { xCenter, yCenter } = this.court.getCanvasCenter();

    const halfHoopWidth = Math.floor(this.hoopWidth / 2);

    const left = [xCenter - halfHoopWidth, yCenter];
    const right = [xCenter + halfHoopWidth, yCenter];

    return { left, right };
  }

  registerPoint() {
    if (this.points < 99) {
      this.points += 1;
    }
  }

  drawPole() {
    const { context } = this.court;
    const { xCenter, yCenter } = this.court.getCanvasCenter();

    const halfPoleWidth = Math.floor(this.poleWidth / 2);

    context.beginPath();
    context.rect(
      xCenter - halfPoleWidth,
      yCenter,
      this.poleWidth,
      this.court.height - yCenter
    );
    context.fillStyle = this.poleColor;
    context.fill();
  }

  drawBoard() {
    const { context } = this.court;
    const { xCenter, yCenter } = this.court.getCanvasCenter();

    const halfBoardWidth = Math.floor(this.boardWidth / 2);
    const halfBoardHeight = Math.floor(this.boardHeight / 2);

    context.beginPath();
    context.roundRect(
      xCenter - halfBoardWidth,
      yCenter - halfBoardHeight - this.boardOffset,
      this.boardWidth,
      this.boardHeight,
      [10]
    );
    context.fillStyle = this.boardColor;
    context.fill();
    context.stroke();

    const pointsAsString =
      this.points < 10 ? `0${this.points}` : `${this.points}`;

    context.font = "48px helvetica";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.fillText(pointsAsString, xCenter, yCenter - 25);
  }

  drawHoop() {
    const { context } = this.court;
    const { xCenter, yCenter } = this.court.getCanvasCenter();

    const halfHoopWidth = Math.floor(this.hoopWidth / 2);

    context.beginPath();
    context.moveTo(xCenter - halfHoopWidth, yCenter);
    context.lineTo(xCenter + halfHoopWidth, yCenter);
    context.stroke();
  }
}
