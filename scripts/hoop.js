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
  }

  getRims() {
    const { centerX, centerY } = this.court.getCanvasCenter();

    const halfHoopWidth = Math.floor(this.hoopWidth / 2);

    const leftRim = [centerX - halfHoopWidth, centerY];
    const rightRim = [centerX + halfHoopWidth, centerY];

    return { leftRim, rightRim };
  }

  drawPole() {
    const { centerX, centerY } = this.court.getCanvasCenter();

    const halfPoleWidth = Math.floor(this.poleWidth / 2);

    this.court.context.beginPath();
    this.court.context.rect(
      centerX - halfPoleWidth,
      centerY,
      this.poleWidth,
      this.court.height - centerY
    );
    this.court.context.fillStyle = this.poleColor;
    this.court.context.fill();
  }

  drawBoard() {
    const { centerX, centerY } = this.court.getCanvasCenter();

    const halfBoardWidth = Math.floor(this.boardWidth / 2);
    const halfBoardHeight = Math.floor(this.boardHeight / 2);

    this.court.context.beginPath();
    this.court.context.roundRect(
      centerX - halfBoardWidth,
      centerY - halfBoardHeight - this.boardOffset,
      this.boardWidth,
      this.boardHeight,
      [10]
    );
    this.court.context.fillStyle = this.boardColor;
    this.court.context.fill();
    this.court.context.stroke();
  }

  drawHoop() {
    const { centerX, centerY } = this.court.getCanvasCenter();

    const halfHoopWidth = Math.floor(this.hoopWidth / 2);

    this.court.context.beginPath();
    this.court.context.moveTo(centerX - halfHoopWidth, centerY);
    this.court.context.lineTo(centerX + halfHoopWidth, centerY);
    this.court.context.stroke();
  }
}
