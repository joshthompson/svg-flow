import { type Component, createSignal, onMount, onCleanup, Show } from 'solid-js';

import SvgFlowCanvasDefs from './SvgFlowCanvasDefs';
import { useSvgFlowContext } from '../../context/SvgFlowContext';
import SvgFlowCanvasNodeContent from './SvgFlowCanvasNodeContent';
import SvgFlowCanvasBackground from './SvgFlowCanvasBackground';
import SvgFlowDebug from './SvgFlowDebug';
import { snapNode } from '../../utils/node';
import { SvgFlowConfig, SvgFlowData } from '../../models/canvas';
import SvgFlowCanvasControls from './SvgFlowCanvasControls';
import SvgFlowCanvasConnections from './SvgFlowCanvasConnections';
import SvgFlowCanvasNodes from './SvgFlowCanvasNodes';

const SvgFlowCanvas: Component<{
  nodeComponent?: typeof SvgFlowCanvasNodeContent,
  data?: SvgFlowData,
  config?: SvgFlowConfig,
}> = props => {
  const { svgFlow, setSvgFlow, canvas: { zoom, zoomToFit } } = useSvgFlowContext();
  if (props.data) setSvgFlow('data', props.data);
  if (props.config) setSvgFlow('config', prev => ({ ...prev, ...props.config }));

  let svgRef: SVGSVGElement | undefined;
  let containerRef: HTMLDivElement | undefined;

  const containerResizeObserver = new ResizeObserver(() => setSvgSize());
  const setSvgSize = () => {
    if (containerRef) {
      setSvgFlow('state', 'width', containerRef.clientWidth);
      setSvgFlow('state', 'height', containerRef.clientHeight);
    }
  };

  let [initialOverscroll] = createSignal(document.documentElement.style.overscrollBehavior);
  onMount(() => {
    document.documentElement.style.overscrollBehavior = 'contain';
    if (containerRef) {
      containerResizeObserver.observe(containerRef);
      setSvgSize();
    }
    if (svgFlow.config.resizeOnInit && svgFlow.data.nodes.length > 1) {
      zoomToFit();
    }
    svgRef?.addEventListener('touchmove', onTouchMove, { passive: false });
  });
  onCleanup(() => document.documentElement.style.overscrollBehavior = initialOverscroll());

  const viewBox = () => {
    const { x, y } = svgFlow.canvas;
    const width = svgFlow.state.width / svgFlow.canvas.zoom;
    const height = svgFlow.state.height / svgFlow.canvas.zoom;
    return `${x} ${y} ${width} ${height}`;
  }

  const containerStyle = () => ({
    position: 'relative' as const,
    width: svgFlow.config.width,
    height: svgFlow.config.height,
    margin: '0 auto',
    background: 'gray',
  });

  const svgStyle = () => ({
    display: svgFlow.state.width && svgFlow.state.height ? 'block' : 'none',
    width: `${svgFlow.state.width}px`,
    height: `${svgFlow.state.height}px`,
    cursor: dragging() ? 'grabbing' : 'initial'
  });

  const [dragging, setDragging] = createSignal(false);
  const [mousePosition, setMousePosition] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });

  const onMouseDown = (event: MouseEvent) => {
    event.preventDefault();
    const hoverNode = svgFlow.data.nodes.find(node => node.id === svgFlow.state.hoverNode);
    if (hoverNode) {
      setSvgFlow('state', 'draggingNode', hoverNode.id);
    }
    setDragging(true);
    setMousePosition({ x: event.x, y: event.y });
  };

  const onMouseMove = (event: MouseEvent) => {
    if (dragging()) {
      const draggingNode = svgFlow.data.nodes.find(node => node.id === svgFlow.state.draggingNode);
      if (draggingNode) {
        setSvgFlow('data', 'nodes', node => node.id === draggingNode.id, prev => ({
          x: prev.x + (event.x - mousePosition().x) / svgFlow.canvas.zoom,
          y: prev.y + (event.y - mousePosition().y) / svgFlow.canvas.zoom,
        }));
      } else {
        setSvgFlow('canvas', 'x', prev => prev + (mousePosition().x - event.x) / svgFlow.canvas.zoom);
        setSvgFlow('canvas', 'y', prev => prev + (mousePosition().y - event.y) / svgFlow.canvas.zoom);
      }
      setMousePosition({ x: event.x, y: event.y });
    };
  };

  const endDrag = () => {
    setDragging(false);
    setSvgFlow(
      'data',
      'nodes',
      node => node.id === svgFlow.state.draggingNode,
      prev => snapNode(prev, svgFlow.config.snapTo),
    );
    setSvgFlow('state', 'draggingNode', undefined);
  }

  document.documentElement.addEventListener('mousemove', event => onMouseMove(event));
  document.documentElement.addEventListener('mouseup', () => endDrag());

  const onScroll = (event: WheelEvent) => {
    event.preventDefault();
    if (event.ctrlKey || event.shiftKey || event.metaKey) {
      const x = event.offsetX / svgFlow.state.width;
      const y = event.offsetY / svgFlow.state.height;
      zoom(1 - event.deltaY * 0.005, x, y);
    } else {
      setSvgFlow('canvas', 'x', prev => prev + event.deltaX + mousePosition().x);
      setSvgFlow('canvas', 'y', prev => prev + event.deltaY + mousePosition().y);
    }
  };

  let prevTouches: TouchList | undefined = undefined;
  const touchCenter = (touches: Touch[]) => {
    if (svgRef) {
      const svgRect = svgRef.getBoundingClientRect();
      const sumX = touches.map(touch => touch.pageX).reduce((a, b) => a + b, 0);
      const sumY = touches.map(touch => touch.pageY).reduce((a, b) => a + b, 0);
      return {
        x: (sumX / touches.length - svgRect.x) / svgRect.width,
        y: (sumY / touches.length - svgRect.y) / svgRect.height,
      };
    }
    return { x: 0.5, y: 0.5 };
  }
  const onTouchEnd = () => prevTouches = undefined;
  const onTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    if (prevTouches?.length === event.touches.length) {
      if (event.touches.length === 1) {
        const deltaX = event.touches[0].pageX - prevTouches[0].pageX;
        const deltaY = event.touches[0].pageY - prevTouches[0].pageY;
        setSvgFlow('canvas', 'x', prev => prev - deltaX / svgFlow.canvas.zoom);
        setSvgFlow('canvas', 'y', prev => prev - deltaY / svgFlow.canvas.zoom);
      }
      if (event.touches.length === 2) {
        const prevDist = Math.sqrt(
          (prevTouches[0].pageX - prevTouches[1].pageX) ** 2 +
          (prevTouches[0].pageY - prevTouches[1].pageY) ** 2
        );
        const dist = Math.sqrt(
          (event.touches[0].pageX - event.touches[1].pageX) ** 2 +
          (event.touches[0].pageY - event.touches[1].pageY) ** 2
        );
        const center = touchCenter([...event.touches]);
        zoom(dist / prevDist, center.x, center.y);
      }
    }
    prevTouches = event.touches;
  }

  return (
    <div ref={containerRef} style={containerStyle()}>
      <SvgFlowCanvasControls />
      <svg
        ref={svgRef}
        xmlns='http://www.w3.org/2000/svg'
        viewBox={viewBox()}
        style={svgStyle()}
        onMouseDown={onMouseDown}
        onWheel={onScroll}
        onTouchEnd={onTouchEnd}
      >
        <SvgFlowCanvasBackground />
        <SvgFlowCanvasDefs />
        <SvgFlowCanvasConnections />
        <SvgFlowCanvasNodes nodeComponent={props.nodeComponent} />
      </svg>
      <Show when={svgFlow.config.showDebug}>
        <SvgFlowDebug />
      </Show>
    </div>
  );
};

export default SvgFlowCanvas;
