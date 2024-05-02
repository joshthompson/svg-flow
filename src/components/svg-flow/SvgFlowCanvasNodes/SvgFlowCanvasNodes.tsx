

import { type Component, For } from 'solid-js';

import { useSvgFlowContext } from '../../../context/SvgFlowContext';
import SvgFlowCanvasNode from '../SvgFlowCanvasNode/SvgFlowCanvasNode';
import SvgFlowCanvasNodeContent from '../SvgFlowCanvasNodeContent/SvgFlowCanvasNodeContent';

const SvgFlowCanvasNodes: Component<{ nodeComponent?: typeof SvgFlowCanvasNodeContent }> = props => {
  const { svgFlow } = useSvgFlowContext();
  const sortedNodes = () => svgFlow.data.nodes.toSorted((a, b) => {
    if (a.id === svgFlow.state.draggingNode) return 1;
    if (b.id === svgFlow.state.draggingNode) return -1;
    return 0;
  });

  return (
    <g class='nodes'>
      <For each={sortedNodes()}>
        {node => <SvgFlowCanvasNode node={node} nodeComponent={props.nodeComponent} />}
      </For>
    </g>
  );
}

export default SvgFlowCanvasNodes;
