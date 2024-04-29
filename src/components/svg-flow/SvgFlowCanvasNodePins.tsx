import { type Component, Index } from 'solid-js';

import { SvgFlowNode } from '../../models/canvas';
import { useSvgFlowContext } from '../../context/SvgFlowContext';

const SvgFlowCanvasNodePins: Component<{ node: SvgFlowNode }> = props => {
  const { svgFlow } = useSvgFlowContext();
  const pins = () => {
    const total = props.node.pins ?? 0;
    return Array(total).fill(null).map((_, n) => ({
      x: props.node.x + (n + 1) * props.node.width / (total + 1),
      y: props.node.y + props.node.height,
    }));
  };

  return (
    <g class='pins'>
      <Index each={pins()}>
        {pin => <circle
          cx={pin().x}
          cy={pin().y}
          r='5'
          fill='#F6F6F6'
          stroke={svgFlow.config.stroke}
        />}
      </Index>
    </g>
  );
};

export default SvgFlowCanvasNodePins;
