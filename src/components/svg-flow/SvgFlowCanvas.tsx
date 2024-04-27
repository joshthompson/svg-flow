import { Index, type Component, createSignal } from 'solid-js';

import SvgFlowCanvasNode from './SvgFlowCanvasNode';
import SvgFlowCanvasConnection from './SvgFlowCanvasConnection';
import SvgFlowCanvasDefs from './SvgFlowCanvasDefs';
import { useSvgFlowContext } from '../../context/SvgFlowContext';
import SvgFlowCanvasNodeContent from './SvgFlowCanvasNodeContent';

const SvgFlowCanvas: Component<{
  nodeComponent?: typeof SvgFlowCanvasNodeContent,
}> = props => {
  const { svgFlow, setSvgFlow } = useSvgFlowContext();

  const canvasBox = () => {
    const { x, y } = svgFlow.canvas;
    const width = svgFlow.config.width / svgFlow.canvas.zoom;
    const height = svgFlow.config.height / svgFlow.canvas.zoom;
    return { x, y, width, height };
  }

  const viewBox = () => {
    const { x, y, width, height } = canvasBox();
    return `${x} ${y} ${width} ${height}`;
  }

  const zoomStep = 1.1;
  const zoom = (amount: number, centerX = 0.5, centerY = 0.5) => {
    const originalZoom = svgFlow.canvas.zoom;
    setSvgFlow('canvas', 'zoom', originalZoom * amount);
    setSvgFlow('canvas', 'x', () => {
      const halfWidth = centerX * svgFlow.config.width / originalZoom;
      return svgFlow.canvas.x + halfWidth - (halfWidth / amount);
    });
    setSvgFlow('canvas', 'y', () => {
      const halfHeight = centerY * svgFlow.config.height / originalZoom;
      return svgFlow.canvas.y + halfHeight - (halfHeight / amount);
    });
  }

  const zoomIn = () => zoom(zoomStep);
  const zoomOut = () => zoom(1 / zoomStep);

  const [dragging, setDragging] = createSignal(false);
  const [mousePosition, setMousePosition] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });

  const onMouseDown = (event: MouseEvent) => {
    setDragging(true);
    setMousePosition({ x: event.x, y: event.y });
  };
  const onMouseMove = (event: MouseEvent) => {
    if (dragging()) {
      setSvgFlow('canvas', 'x', prev => prev - event.x + mousePosition().x);
      setSvgFlow('canvas', 'y', prev => prev - event.y + mousePosition().y);
      setMousePosition({ x: event.x, y: event.y });
    };
  };
  const onMouseUp = () => setDragging(false);
  const onMouseLeave = () => setDragging(false);

  const onScroll = (event: WheelEvent) => {
    if (event.ctrlKey || event.shiftKey || event.metaKey) {
      event.preventDefault();
      const x = event.offsetX / svgFlow.config.width;
      const y = event.offsetY / svgFlow.config.height;
      zoom(1 - event.deltaY * 0.005, x, y);
    }
  }

  return (
    <div style={{
      position: 'relative',
      width: `${svgFlow.config.width}px`,
      height: `${svgFlow.config.height}px`,
      margin: '0 auto',
    }}>
      <button style='position: absolute; top: 0; right: 10px;' onClick={zoomIn}>+</button>
      <button style='position: absolute; top: 0; right: 40px;' onClick={zoomOut}>-</button>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox={viewBox()}
        style={{
          width: `${svgFlow.config.width}px`,
          height: `${svgFlow.config.height}px`,
        }}
      >
        <rect 
          {...canvasBox()}
          fill={svgFlow.config.background}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onWheel={onScroll}
        />
        <SvgFlowCanvasDefs />
        <g class='connections'>
          <Index each={svgFlow.connections}>
            {(_, index) => <SvgFlowCanvasConnection index={index} />}
          </Index>
        </g>
        <g class='nodes'>
          <Index each={svgFlow.nodes}>
            {node => <SvgFlowCanvasNode node={node()} nodeComponent={props.nodeComponent} />}
          </Index>
        </g>
      </svg>
    </div>
  );
};

export default SvgFlowCanvas;
