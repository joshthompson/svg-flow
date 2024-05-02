import { type Component, Index } from 'solid-js';

import { SvgFlowNode, SvgFlowResourceID } from '../../../models/canvas';
import { useSvgFlowContext } from '../../../context/SvgFlowContext';

const SvgFlowCanvasNodePins: Component<{ node: SvgFlowNode }> = props => {
  const { svgFlow, setSvgFlow } = useSvgFlowContext();
  const pins = () => {
    const total = props.node.pins ?? 0;
    return Array(total).fill(null).map((_, n) => ({
      x: props.node.x + (n + 1) * props.node.width / (total + 1),
      y: props.node.y + props.node.height,
    }));
  };

  const hoverPinId = (pin: number): `${SvgFlowResourceID}.${number}` => `${props.node.id}.${pin}`;
  const onMouseOver = (pin: number) =>
    setSvgFlow('state', 'hoverPin', hoverPinId(pin));
  const onMouseLeave = (pin: number) =>
    setSvgFlow('state', 'hoverPin', prev => prev === hoverPinId(pin) ? undefined : prev);

  return (
    <g class='pins'>
      <Index each={pins()}>
        {(pin, index) => <circle
          cx={pin().x}
          cy={pin().y}
          r='5'
          fill='#F6F6F6'
          stroke={svgFlow.config.stroke}
          onMouseOver={() => onMouseOver(index)}
          onMouseLeave={() => onMouseLeave(index)}
        />}
      </Index>
    </g>
  );
};

export default SvgFlowCanvasNodePins;
