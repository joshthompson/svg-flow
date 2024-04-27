import { createSignal, type Component } from 'solid-js';

import { SvgFlowNode } from '../../models/canvas';
import SvgFlowCanvasNodeContent from './SvgFlowCanvasNodeContent';
import { Dynamic } from 'solid-js/web';
import SvgFlowCanvasNodePins from './SvgFlowCanvasNodePins';
import { useSvgFlowContext } from '../../context/SvgFlowContext';

const SvgFlowCanvasNode: Component<{
  node: SvgFlowNode,
  nodeComponent?: typeof SvgFlowCanvasNodeContent,
}> = props => {
  const { svgFlow, setSvgFlow } = useSvgFlowContext();

  const [dragging, setDragging] = createSignal(false);
  const [mousePosition, setMousePosition] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });

  const onMouseDown = (event: MouseEvent) => {
    setDragging(true);
    setMousePosition({ x: event.x, y: event.y });
  };
  const onMouseMove = (event: MouseEvent) => {
    if (dragging()) {
      setSvgFlow('nodes', node => node.id === props.node.id, 'x', prev => prev + event.x - mousePosition().x);
      setSvgFlow('nodes', node => node.id === props.node.id, 'y', prev => prev + event.y - mousePosition().y);
      setMousePosition({ x: event.x, y: event.y });
    };
  };
  const onMouseUp = () => setDragging(false);
  const onMouseLeave = () => setDragging(false);

  return (
    <g>
      <foreignObject
        x={props.node.x}
        y={props.node.y}
        width={props.node.width}
        height={props.node.height}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <Dynamic
          component={props.nodeComponent ?? SvgFlowCanvasNodeContent}
          node={props.node}
        />
      </foreignObject>
      <SvgFlowCanvasNodePins node={props.node} flow={svgFlow} />
      {/* <text x={props.node.x + props.node.width + 10} y={props.node.y + props.node.height / 2 + 5}>
        { JSON.stringify(state()) }
      </text> */}
    </g>
  );
};

export default SvgFlowCanvasNode;
