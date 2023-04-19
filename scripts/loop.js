function loop() {
  context.clearRect(0, 0, canvas.clientWidth, canvas.height);
  ball.update();
  ball.draw();
  requestAnimationFrame(loop);
}
