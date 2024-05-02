import { SetStoreFunction } from 'solid-js/store';
import { SvgFlow } from '../models/canvas';

const SvgFlowContextCanvasMutations = (
  svgFlow: SvgFlow,
  setSvgFlow: SetStoreFunction<SvgFlow>,
) => {
  const zoomStep = 1.1;
  const minZoom = 0.1;
  const maxZoom = 5;
  const zoom = (amount: number, centerX = 0.5, centerY = 0.5) => {
    const originalZoom = svgFlow.canvas.zoom;
    const amountClamped = Math.min(Math.max(amount, minZoom / originalZoom), maxZoom / originalZoom);
    const halfWidth = centerX * svgFlow.state.width / originalZoom;
    const halfHeight = centerY * svgFlow.state.height / originalZoom;
    setSvgFlow('canvas', 'zoom', originalZoom * amountClamped);
    setSvgFlow('canvas', 'x', svgFlow.canvas.x + halfWidth - (halfWidth / amountClamped));
    setSvgFlow('canvas', 'y', svgFlow.canvas.y + halfHeight - (halfHeight / amountClamped));
  }

  const zoomIn = () => zoom(zoomStep);
  const zoomOut = () => zoom(1 / zoomStep);
  const zoomToFit = () => {
    const padding = 10;
    const minX = Math.min(...svgFlow.data.nodes.map(node => node.x));
    const maxX = Math.max(...svgFlow.data.nodes.map(node => node.x + node.width));
    const minY = Math.min(...svgFlow.data.nodes.map(node => node.y));
    const maxY = Math.max(...svgFlow.data.nodes.map(node => node.y + node.height));
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    const zoomX = svgFlow.state.width / width;
    const zoomY = svgFlow.state.height / height;
    zoom(Math.min(zoomX, zoomY));
    setSvgFlow('canvas', 'x', (minX + maxX - svgFlow.state.width / svgFlow.canvas.zoom) / 2);
    setSvgFlow('canvas', 'y', (minY + maxY - svgFlow.state.height / svgFlow.canvas.zoom) / 2);
  };

  const canZoomIn = () => svgFlow.canvas.zoom > minZoom;
  const canZoomOut = () => svgFlow.canvas.zoom < maxZoom;

  return {
    zoom,
    zoomIn,
    zoomOut,
    zoomToFit,
    canZoomIn,
    canZoomOut,
  };
}

export default SvgFlowContextCanvasMutations;
