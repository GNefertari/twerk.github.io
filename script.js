let stepInterval;
let sequence = [];
let userInput = [];

function getRandomColor() {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FFD700", "#FF69B4", "#40E0D0"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateAndStart() {
  clearInterval(stepInterval);
  document.getElementById("currentStep").innerText = "";
  document.getElementById("gifContainer").innerHTML = "";
  document.getElementById("memoryButtons").innerHTML = "";
  document.getElementById("memoryResult").innerText = "";
  document.getElementById("memoryButtons").style.display = "none";

  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  const selectedSteps = Array.from(checkboxes).map(cb => cb.value.toLowerCase());
  const count = parseInt(document.getElementById('stepCount').value);
  const delay = parseInt(document.getElementById('stepDelay').value) * 1000;
  const memoryMode = document.getElementById("memoryMode").checked;
  const output = document.getElementById('output');

  if (selectedSteps.length === 0) {
    output.innerHTML = "Selecciona al menos un paso.";
    return;
  }

  sequence = [];
  for (let i = 0; i < count; i++) {
    const rand = selectedSteps[Math.floor(Math.random() * selectedSteps.length)];
    sequence.push(rand);
  }

  output.innerHTML = `<strong>Secuencia:</strong><br>${sequence.join(', ')}`;

  const currentStepDiv = document.getElementById("currentStep");
  const gifContainer = document.getElementById("gifContainer");
  const beat = document.getElementById("beatSound");
  let index = 0;

  stepInterval = setInterval(() => {
    if (index < sequence.length) {
      const step = sequence[index];
      currentStepDiv.innerText = step.charAt(0).toUpperCase() + step.slice(1);
      currentStepDiv.style.color = getRandomColor();
      gifContainer.innerHTML = `<img src="gifs/${step}.gif" alt="${step}">`;
      beat.currentTime = 0;
      beat.play();
      index++;
    } else {
      clearInterval(stepInterval);
      if (memoryMode) {
        startMemoryMode(selectedSteps);
      } else {
        currentStepDiv.innerText = "¡Listo!";
        gifContainer.innerHTML = "";
      }
    }
  }, delay);
}

function startMemoryMode(availableSteps) {
  document.getElementById("currentStep").innerText = "Repite la secuencia";
  document.getElementById("gifContainer").innerHTML = "";
  document.getElementById("memoryButtons").style.display = "flex";
  userInput = [];

  availableSteps.forEach(step => {
    const btn = document.createElement("button");
    btn.innerText = step.charAt(0).toUpperCase() + step.slice(1);
    btn.onclick = () => checkMemoryStep(step);
    document.getElementById("memoryButtons").appendChild(btn);
  });
}

function checkMemoryStep(step) {
  userInput.push(step);
  const index = userInput.length - 1;
  if (userInput[index] !== sequence[index]) {
    document.getElementById("memoryResult").innerText = "❌ ¡Incorrecto! Intenta de nuevo.";
    document.getElementById("memoryButtons").style.display = "none";
    return;
  }

  if (userInput.length === sequence.length) {
    document.getElementById("memoryResult").innerText = "✅ ¡Secuencia correcta!";
    document.getElementById("memoryButtons").style.display = "none";
  }
}