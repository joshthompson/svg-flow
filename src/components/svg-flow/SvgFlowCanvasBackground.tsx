import { Component, Index, Show } from 'solid-js';
import { useSvgFlowContext } from '../../context/SvgFlowContext';

const SvgFlowCanvasBackground: Component = () => {
  const { svgFlow } = useSvgFlowContext();

  const gridSize = () => {
    const size = Math.max(svgFlow.state.width, svgFlow.state.height) / svgFlow.canvas.zoom;
    const target = 10;
    const minGridSize = 25;
    const nearestPowerOf2 = 1 << 31 - Math.clz32(Math.max(size / (target * minGridSize), 1));
    const gridSize = nearestPowerOf2 * minGridSize;
    return gridSize;
  };

  const dots = () => {
    let dots: { x: number, y: number }[] = [];
    const size = gridSize();
    const startX = Math.floor(svgFlow.canvas.x / size) * size;
    const startY = Math.floor(svgFlow.canvas.y / size) * size;
    const maxX = svgFlow.canvas.x + svgFlow.state.width / svgFlow.canvas.zoom;
    const maxY = svgFlow.canvas.y + svgFlow.state.height / svgFlow.canvas.zoom;
    for (let x = startX; x <= maxX; x += size) {
      for (let y = startY; y <= maxY; y += size) {
        dots.push({ x, y });
      }
    }
    return dots;
  }

  const lines = () => {
    const size = gridSize();
    const startX = Math.ceil(svgFlow.canvas.x / size) * size;
    const startY = Math.ceil(svgFlow.canvas.y / size) * size;
    const maxX = svgFlow.canvas.x + svgFlow.state.width / svgFlow.canvas.zoom;
    const maxY = svgFlow.canvas.y + svgFlow.state.height / svgFlow.canvas.zoom;
    let path: string[] = [];
    for (let x = startX; x <= maxX; x += size) {
      path.push(`M${x} ${svgFlow.canvas.y}`)
      path.push(`L${x} ${svgFlow.canvas.y + svgFlow.state.height / svgFlow.canvas.zoom}`);
    }
    for (let y = startY; y <= maxY; y += size) {
      path.push(`M${svgFlow.canvas.x} ${y}`)
      path.push(`L${svgFlow.canvas.x + svgFlow.state.width / svgFlow.canvas.zoom} ${y}`);
    }
    return <path d={path.join('')} stroke={stroke} stroke-width={2 / svgFlow.canvas.zoom} />;
  }
  
  const canvasBox = () => {
    const { x, y } = svgFlow.canvas;
    const width = svgFlow.state.width / svgFlow.canvas.zoom;
    const height = svgFlow.state.height / svgFlow.canvas.zoom;
    return { x, y, width, height };
  }

  const stroke = 'rgba(0, 0, 0, 0.02)'
  const fill = 'rgba(0, 0, 0, 0.02)';
  const baseRadius = 4;
  const radius = () => baseRadius / svgFlow.canvas.zoom;

  return (
    <g>
      <rect {...canvasBox()} fill={svgFlow.config.background}/>
      <Show when={svgFlow.config.grid === 'dots'}>
        <Index each={dots()}>
          {dot => <circle cx={dot().x} cy={dot().y} r={radius()} fill={fill} />}
        </Index>
      </Show>
      <Show when={svgFlow.config.grid === 'lines'}>
        {lines()}
      </Show>
    </g>
  );
};

export default SvgFlowCanvasBackground;
