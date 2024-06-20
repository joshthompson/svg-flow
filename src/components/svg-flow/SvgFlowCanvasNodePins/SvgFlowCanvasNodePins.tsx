import { type Component, Index } from 'solid-js';

import { SvgFlowNode, SvgFlowResourceID } from '../../../models/canvas';
import { useSvgFlowContext } from '../../../context/SvgFlowContext';
import { getNodePinPosition } from '../../../utils/node';
import { SvgFlowPinSide } from '../../../context/SvgFlowContextConnectionMutations';

const SvgFlowCanvasNodePins: Component<{ node: SvgFlowNode }> = props => {
  const { svgFlow, setSvgFlow, connectionsWithDetails } = useSvgFlowContext();

  const pins = () => {
    const connections = connectionsWithDetails();
    const nodeConnections = connections.filter(connection => connection.from === props.node.id);
    const pins = nodeConnections.map(connection =>
      getNodePinPosition(props.node, connection.fromPinSide, connection.fromPinSideIndex, connection.fromPinSideTotal),
    );
    const nodePins = props.node.pins ?? 0;
    if (nodePins > pins.length) {
      const lastBottomConnection = nodeConnections.findLast(connection => connection.fromPinSide === SvgFlowPinSide.Bottom);
      let lastIndex = lastBottomConnection?.fromPinSideIndex ?? -1;
      const total = lastBottomConnection?.fromPinSideTotal ?? nodePins;
      while (nodePins > pins.length) {
        pins.push(getNodePinPosition(props.node, SvgFlowPinSide.Bottom, ++lastIndex, total));
      }
    }
    return pins;
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
