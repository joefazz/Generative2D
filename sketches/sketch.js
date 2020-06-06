const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 5);
  const palette = random.shuffle(random.pick(palettes).slice(0, 3));
  const char = random.shuffle([30, 61, 45, 42]);

  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        const radius = Math.PI * Math.abs(random.noise2D(u, v)) * 0.07;
        points.push({
          position: [u, v],
          color: random.pick(palette),
          radius,
          rotation: random.noise2D(u, v),
          char: random.pick(char)
        });
      }
    }

    return points;
  };

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 300;

  return ({ context, width, height, rotation }) => {
    context.fillStyle = random.pick(palette);
    context.fillRect(0, 0, width, height);

    points.forEach(({ position, radius, color, rotation, char }) => {
      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText(String.fromCharCode(char), 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
