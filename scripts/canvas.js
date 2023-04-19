const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function resizeCanvas() {
  canvas.height = document.body.offsetHeight;
  canvas.width = document.body.offsetWidth;
}

window.addEventListener("resize", resizeCanvas);
