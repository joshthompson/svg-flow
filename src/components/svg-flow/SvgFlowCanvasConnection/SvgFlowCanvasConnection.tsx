import { type Component } from 'solid-js';

import { useSvgFlowContext } from '../../../context/SvgFlowContext';
import { getNodePinPosition, snapNode } from '../../../utils/node';
import { SvgFlowConnectionWithPinDetails, SvgFlowPinSide } from '../../../context/SvgFlowContextConnectionMutations';


const SvgFlowCanvasConnection: Component<{ connection: SvgFlowConnectionWithPinDetails }> = props => {
  const { svgFlow } = useSvgFlowContext();

  const path = () => {
    const connection = props.connection;
    let fromNode = svgFlow.data.nodes.find(node => node.id === connection.from);
    let toNode = svgFlow.data.nodes.find(node => node.id === connection.to);
    
    if (!fromNode || !toNode) {
      return;
    }

    fromNode = snapNode(fromNode, svgFlow.config.snapTo);
    toNode = snapNode(toNode, svgFlow.config.snapTo);

    const from = getNodePinPosition(fromNode, connection.fromPinSide, connection.fromPinSideIndex, connection.fromPinSideTotal);
    const to = getNodePinPosition(toNode, connection.toPinSide, connection.toPinSideIndex, connection.toPinSideTotal);

    const xDist = to.x - from.x;
    const yDist = to.y - from.y;
    const minControlPointOffset = 30;
    
    const horizontalControlPointOffset = 30;

    switch (connection.fromPinSide) {
      case SvgFlowPinSide.Bottom:
      case SvgFlowPinSide.Top: {
        const distanceRatio = Math.max(Math.min(Math.abs(xDist / yDist), 0.4), 0);
        let controlPointOffset = yDist * (0.5 + distanceRatio);
        if (Math.abs(controlPointOffset) < minControlPointOffset) {
          controlPointOffset = yDist ? (minControlPointOffset * Math.abs(yDist)) / yDist : 0;
        }
        return `
          M${from.x} ${from.y}
          C${from.x} ${from.y + controlPointOffset}
            ${to.x} ${to.y - controlPointOffset}
            ${to.x} ${to.y}
        `;
      }
      case SvgFlowPinSide.Left:
      case SvgFlowPinSide.Right: {
        const distanceRatio = Math.max(Math.min(Math.abs(yDist / xDist), 0.4), 0);
        let controlPointOffset = xDist * (0.5 + distanceRatio);
        if (Math.abs(controlPointOffset) < minControlPointOffset) {
          controlPointOffset = xDist ? (minControlPointOffset * Math.abs(xDist)) / xDist : 0;
        }
        return `
          M${from.x} ${from.y}
          C${from.x + controlPointOffset} ${from.y}
            ${to.x - controlPointOffset} ${to.y}
            ${to.x} ${to.y}
        `;
      }
      default:
        return `M${from.x} ${from.y}L${to.x} ${to.y}`;
    }
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
