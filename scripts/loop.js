let previousFrameMS;

function loop(timestampMS) {
  if (previousFrameMS === undefined) {
    previousFrameMS = timestampMS;
  }

  let delta = (timestampMS - previousFrameMS) / 1000;

  while (delta >= court.frame) {
    court.context.clearRect(0, 0, court.width, court.height);

    court.hoop.drawPole();
    court.hoop.drawBoard();

    court.ball.update();
    court.ball.draw();

    court.hoop.drawHoop();

    delta -= court.frame;
  }

  previousFrameMS = timestampMS - delta * 1000;

  requestAnimationFrame(loop);
}
