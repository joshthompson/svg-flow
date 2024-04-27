import { type Component } from 'solid-js';

import { useSvgFlowContext } from '../../context/SvgFlowContext';

const SvgFlowCanvasConnection: Component<{ index: number }> = props => {
  const { svgFlow } = useSvgFlowContext();

  const path = () => {
    const connection = svgFlow.connections[props.index];
    const fromNode = svgFlow.nodes.find(node => node.id === connection.from);
    const toNode = svgFlow.nodes.find(node => node.id === connection.to);
    
    if (!fromNode || !toNode) {
      return;
    }

    const from = {
      x: fromNode.x + (1 + connection.pin) * fromNode.width / (1 + (fromNode.pins ?? 1)),
      y: fromNode.y + fromNode.height,
    };
    const to = { x: toNode.x + toNode.width / 2, y: toNode.y };

    const xDist = to.x - from.x;
    const yDist = to.y - from.y;
    const minControlPointOffset = 10;
    const distanceRatio = Math.max(Math.min(Math.abs(xDist / yDist), 0.4), 0);
    let controlPointOffset = yDist * (0.5 + distanceRatio);
    if (Math.abs(controlPointOffset) < minControlPointOffset) {
      controlPointOffset = (minControlPointOffset * Math.abs(yDist)) / yDist;
    }

    const path = `
      M${from.x} ${from.y}
      C${from.x} ${from.y + controlPointOffset}
        ${to.x} ${to.y - controlPointOffset}
        ${to.x} ${to.y}
    `;

    return path;
  }

  return (
    <>
      <path
        d={path()}
        stroke={svgFlow.config.stroke}
        stroke-width={svgFlow.config.strokeWidth}
        fill='none'
        marker-end="url(#svg-flow-connection-arrow)"
        marker-mid="url(#svg-flow-connection-arrow)"
      />
    </>
  );
};

export default SvgFlowCanvasConnection;
