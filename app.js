document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".pipeline-step");
  const arrows = document.querySelectorAll(".pipeline-arrow");

  let index = 0;

  function nextStep() {
    steps.forEach(s => s.classList.remove("active"));
    arrows.forEach(a => a.classList.remove("active"));

    steps[index].classList.add("active");
    if (arrows[index]) arrows[index].classList.add("active");

    index++;
    if (index >= steps.length) index = 0;
  }

  // Start animation loop
  nextStep();
  setInterval(nextStep, 1500);
});
