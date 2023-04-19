function loop() {
  court.context.clearRect(0, 0, court.width, court.height);

  court.hoop.drawPole();
  court.hoop.drawBoard();

  court.ball.update();
  court.ball.draw();

  court.hoop.drawHoop();

  requestAnimationFrame(loop);
}
