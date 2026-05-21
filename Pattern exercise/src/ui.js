function createControl(section, label, name, type, min, max, step) {
  const div = document.createElement('div');
  div.className = 'control';
  const lbl = document.createElement('label');
  lbl.textContent = label;
  div.appendChild(lbl);

  let input;
  if (type === 'color') {
    input = document.createElement('input');
    input.type = 'color';
  } else if (type === 'number') {
    input = document.createElement('input');
    input.type = 'number';
    input.min = min;
    input.max = max;
    if (step !== undefined) input.step = step;
  } else {
    input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    if (step !== undefined) input.step = step;
  }

  input.name = name;
  input.dataset.name = name;
  div.appendChild(input);
  section.appendChild(div);
  return input;
}

export function createPanel(container, params, onChange) {
  const canvasTitle = document.createElement('h2');
  canvasTitle.textContent = 'Canvas';
  container.appendChild(canvasTitle);
  createControl(container, 'Larghezza', 'canvasWidth', 'number', 100, 5000);
  createControl(container, 'Altezza', 'canvasHeight', 'number', 100, 5000);

  const shapeTitle = document.createElement('h2');
  shapeTitle.textContent = 'Forma base';
  container.appendChild(shapeTitle);
  createControl(container, 'Semi-larghezza', 'baseWidth', 'number', 10, 500);
  createControl(container, 'Semi-altezza', 'baseHeight', 'number', 10, 500);
  createControl(container, 'Medio (%)', 'scaleMedium', 'number', 110, 300);
  createControl(container, 'Grande (%)', 'scaleLarge', 'number', 110, 300);

  const gridTitle = document.createElement('h2');
  gridTitle.textContent = 'Griglia';
  container.appendChild(gridTitle);
  createControl(container, 'Colonne', 'cols', 'number', 1, 50);
  createControl(container, 'Righe', 'rows', 'number', 1, 50);


  const styleTitle = document.createElement('h2');
  styleTitle.textContent = 'Stile';
  container.appendChild(styleTitle);
  createControl(container, 'Spessore linee', 'strokeWidth', 'number', 0, 50);
  createControl(container, 'Colore linee', 'strokeColor', 'color');
  createControl(container, 'Colore riempimento', 'fillColor', 'color');
  createControl(container, 'Opacità', 'opacity', 'range', 0, 1, 0.01);

  const actionsTitle = document.createElement('h2');
  actionsTitle.textContent = 'Azioni';
  container.appendChild(actionsTitle);

  const svgBtn = document.createElement('button');
  svgBtn.className = 'btn';
  svgBtn.textContent = 'Esporta SVG';
  container.appendChild(svgBtn);

  const pngBtn = document.createElement('button');
  pngBtn.className = 'btn';
  pngBtn.textContent = 'Esporta PNG';
  container.appendChild(pngBtn);

  const inputs = container.querySelectorAll('input[data-name]');
  inputs.forEach(input => {
    const sync = () => {
      let val = input.type === 'color' ? input.value : parseFloat(input.value);
      if (input.name === 'opacity') val = parseFloat(input.value);
      params[input.name] = val;
      onChange();
    };
    input.addEventListener('input', sync);
    input.addEventListener('change', sync);
    if (input.type === 'color') input.value = params[input.name];
    else input.value = params[input.name];
  });

  return { svgBtn, pngBtn };
}
