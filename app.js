document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".pipeline-step");
  const arrows = document.querySelectorAll(".pipeline-arrow");
  const tooltip = document.getElementById("pipeline-tooltip");

  if (steps.length === 0) {
    return;
  }

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

  if (!tooltip) {
    return;
  }

  steps.forEach(step => {
    step.addEventListener("mouseenter", () => {
      const text = step.getAttribute("data-info");
      tooltip.textContent = text;
      tooltip.style.opacity = "1";
    });

    step.addEventListener("mousemove", e => {
      tooltip.style.left = `${e.pageX}px`;
      tooltip.style.top = `${e.pageY - 20}px`;
    });

    step.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  });
});
