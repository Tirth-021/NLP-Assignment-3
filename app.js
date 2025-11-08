document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".pipeline-step");
  const arrows = document.querySelectorAll(".pipeline-arrow");
  let index = 0;

  function animatePipeline() {
    steps.forEach(s => s.classList.remove("active"));
    arrows.forEach(a => a.classList.remove("active"));

    steps[index].classList.add("active");
    if (arrows[index]) {
      arrows[index].classList.add("active");
    }

    index = (index + 1) % steps.length;
  }

  animatePipeline();
  setInterval(animatePipeline, 1300);
});
