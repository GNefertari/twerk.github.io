document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.selectable').forEach(el => {
    el.addEventListener('click', () => el.classList.toggle('selected'));
  });

  const arrow = document.getElementById("panelArrow");
  const panel = document.getElementById("configPanel");

  arrow.addEventListener("click", () => {
    panel.classList.toggle("closed");
    panel.classList.toggle("open");
    arrow.textContent = panel.classList.contains("closed") ? "❯" : "❮";
  });

  document.getElementById("useLevels").addEventListener("change", () => {
    document.getElementById("levelsOptions").classList.toggle("hidden");
  });

  document.getElementById("useVariations").addEventListener("change", () => {
    document.getElementById("variationOptions").classList.toggle("hidden");
  });
});

function getSelectedValues(type) {
  return Array.from(document.querySelectorAll(`.selectable[data-type='${type}'].selected`)).map(el => el.dataset.value);
}

function generateSequence() {
  const steps = getSelectedValues('step');
  const useLevels = document.getElementById("useLevels").checked;
  const levels = useLevels ? getSelectedValues('level') : [];
  const useVariations = document.getElementById("useVariations").checked;
  const variations = useVariations ? getSelectedValues('variation') : [];
  const combineSteps = document.getElementById("combineSteps").checked;
  const useConsigna = document.getElementById("useConsigna").checked;
  const sequenceLength = parseInt(document.getElementById("seqLength").value) || 6;

  if (steps.length === 0) {
    alert("Selecciona al menos un paso");
    return;
  }

  let sequence = [];
  for (let i = 0; i < sequenceLength; i++) {
    let step = steps[Math.floor(Math.random() * steps.length)];

    if (combineSteps && steps.length >= 2) {
      let second;
      do {
        second = steps[Math.floor(Math.random() * steps.length)];
      } while (second === step);
      step += "+" + second;
    }

    if (useLevels && levels.length > 0 && Math.random() < 0.5) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      step += " (" + level + ")";
    }

    if (useVariations && variations.length > 0 && Math.random() < 0.5) {
      const varPart = variations[Math.floor(Math.random() * variations.length)];
      step += " [" + varPart + "]";
    }

    sequence.push(step);
  }

  if (useConsigna) {
    sequence.unshift("🔥 ¡Haz esta secuencia con actitud y energía!");
  }

  document.getElementById("sequenceOutput").innerText = sequence.join("\n");

  const firstStep = sequence.find(s => !s.includes("🔥"));
  if (firstStep) {
    const gifName = firstStep.split(/[\s(+]/)[0].toLowerCase();
    document.getElementById("gifContainer").innerHTML = `<img src="gifs/${gifName}.gif" alt="${gifName}">`;
  }
}