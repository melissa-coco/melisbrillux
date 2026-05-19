export function exportSVG(svgElement) {
  const clone = svgElement.cloneNode(true);
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(clone);
  const blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + source], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pattern.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPNG(svgElement, width, height) {
  const clone = svgElement.cloneNode(true);
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(clone);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);
    canvas.toBlob(pngBlob => {
      const pngUrl = URL.createObjectURL(pngBlob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'pattern.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');
  };
  img.src = url;
}
