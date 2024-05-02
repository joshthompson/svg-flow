import { Component, Show } from 'solid-js';
import { useSvgFlowContext } from '../../../context/SvgFlowContext';

const SvgFlowCanvasControls: Component = () => {
  const {
    svgFlow,
    canZoomIn,
    canZoomOut,
    zoomToFit,
    zoomIn,
    zoomOut,
  } = useSvgFlowContext();
  
  return (
    <Show when={svgFlow.config.showControls}>
      <div style='position: absolute; top: 10px; right: 10px; display: flex; gap: 0.5rem;'>
        <button data-testid='zoom-fit' onClick={zoomToFit} title='Fit Content'>⛶</button>
        <button data-testid='zoom-out' onClick={zoomOut} disabled={!canZoomIn()} title='Zoom Out'>-</button>
        <button data-testid='zoom-in' onClick={zoomIn} disabled={!canZoomOut()} title='Zoom In'>+</button>
      </div>
    </Show>
  );
}

export default SvgFlowCanvasControls;