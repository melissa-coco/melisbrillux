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
    div.appendChild(input);
  } else {
    const row = document.createElement('div');
    row.className = 'control-row';
    input = document.createElement('input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    if (step !== undefined) input.step = step;
    row.appendChild(input);
    const val = document.createElement('span');
    val.className = 'control-value';
    row.appendChild(val);
    div.appendChild(row);

    const updateVal = () => { val.textContent = input.value };
    input.addEventListener('input', updateVal);
    setTimeout(updateVal, 0);
  }

  input.name = name;
  input.dataset.name = name;
  section.appendChild(div);
  return input;
}

export function createPanel(container, params, onChange) {
  const canvasTitle = document.createElement('h2');
  canvasTitle.textContent = 'Canvas';
  container.appendChild(canvasTitle);
  createControl(container, 'Larghezza', 'canvasWidth', 'range', 100, 5000);
  createControl(container, 'Altezza', 'canvasHeight', 'range', 100, 5000);

  const shapeTitle = document.createElement('h2');
  shapeTitle.textContent = 'Forma base';
  container.appendChild(shapeTitle);
  createControl(container, 'Semi-larghezza', 'baseWidth', 'range', 10, 500);
  createControl(container, 'Semi-altezza', 'baseHeight', 'range', 10, 500);
  createControl(container, 'Piccolo (%)', 'scaleSmall', 'range', 10, 100);
  createControl(container, 'Medio (%)', 'scaleMedium', 'range', 50, 200);
  createControl(container, 'Grande (%)', 'scaleLarge', 'range', 110, 300);

  const gridTitle = document.createElement('h2');
  gridTitle.textContent = 'Griglia';
  container.appendChild(gridTitle);
  createControl(container, 'Colonne', 'cols', 'range', 1, 100);
  createControl(container, 'Righe', 'rows', 'range', 1, 100);
  createControl(container, 'Gap orizzontale', 'gapH', 'range', -200, 200);
  createControl(container, 'Gap verticale', 'gapV', 'range', -200, 200);

  const marginTitle = document.createElement('h2');
  marginTitle.textContent = 'Margini';
  container.appendChild(marginTitle);
  createControl(container, 'Superiore', 'marginTop', 'range', 0, 500);
  createControl(container, 'Destro', 'marginRight', 'range', 0, 500);
  createControl(container, 'Inferiore', 'marginBottom', 'range', 0, 500);
  createControl(container, 'Sinistro', 'marginLeft', 'range', 0, 500);

  const styleTitle = document.createElement('h2');
  styleTitle.textContent = 'Stile';
  container.appendChild(styleTitle);
  createControl(container, 'Spessore linee', 'strokeWidth', 'range', 0, 50);

  const colorTitle = document.createElement('h3');
  colorTitle.textContent = 'Colori';
  container.appendChild(colorTitle);
  function makeColorControl(label, name, noName) {
    const div = document.createElement('div');
    div.className = 'control';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    div.appendChild(lbl);
    const row = document.createElement('div');
    row.className = 'control-row';
    const input = document.createElement('input');
    input.type = 'color';
    input.name = name;
    input.dataset.name = name;
    row.appendChild(input);
    const btn = document.createElement('button');
    btn.className = 'no-fill-btn';
    btn.textContent = 'Nessuno';
    btn.type = 'button';
    row.appendChild(btn);
    div.appendChild(row);
    container.appendChild(div);

    const state = { active: params[noName] };
    if (state.active) btn.classList.add('active');
    btn.addEventListener('click', () => {
      state.active = !state.active;
      btn.classList.toggle('active', state.active);
      params[noName] = state.active;
      onChange();
    });
    return input;
  }

  makeColorControl('Linee', 'strokeColor', 'noStroke');
  makeColorControl('Riempimento', 'fillColor', 'noFill');

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