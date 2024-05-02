import { type Component, onMount } from 'solid-js';

import { SvgFlowNode } from '../../../models/canvas';
import SvgFlowCanvasNodeContent from '../SvgFlowCanvasNodeContent/SvgFlowCanvasNodeContent';
import { Dynamic } from 'solid-js/web';
import SvgFlowCanvasNodePins from '../SvgFlowCanvasNodePins/SvgFlowCanvasNodePins';
import { useSvgFlowContext } from '../../../context/SvgFlowContext';
import { snapNode } from '../../../utils/node';

const SvgFlowCanvasNode: Component<{
  node: SvgFlowNode,
  nodeComponent?: typeof SvgFlowCanvasNodeContent,
}> = props => {
  const { svgFlow, setSvgFlow, setNode } = useSvgFlowContext();

  const dragging = () => props.node.id === svgFlow.state.draggingNode;
  const onMouseOver = () => setSvgFlow('state', 'hoverNode', props.node.id);
  const onMouseLeave = () => setSvgFlow('state', 'hoverNode', prev => prev === props.node.id ? undefined : prev);
  
  let nodeContentRef: SVGForeignObjectElement | undefined;
  const nodeContentResizeObserver = new ResizeObserver(() => autoResize());
  const nodeContentMutationObserver = new MutationObserver(() => autoResize());
  const autoResize = () => {
    if (svgFlow.config.autoNodeHeight && nodeContentRef) {
      const innerElement = nodeContentRef.children[0] as HTMLElement;
      const innerContentHeight = innerElement?.offsetHeight;
      setNode(props.node.id, { height: innerContentHeight });
    }
  };

  const addXMLNS = () => {
    if (nodeContentRef) {
      [...nodeContentRef.children].forEach(child => {
        child.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
      });
    }
  };
  
  onMount(() => {
    if (nodeContentRef) {
      nodeContentMutationObserver.observe(nodeContentRef, { childList: true, subtree: true });
      nodeContentResizeObserver.observe(nodeContentRef.children[0]);
      autoResize();
      addXMLNS();
    }
  });

  const snappedNode = () => snapNode(props.node, svgFlow.config.snapTo);

  return (
    <g id={dragging() ? 'dragging-node' : undefined}>
      <foreignObject
        ref={nodeContentRef}
        x={snappedNode().x}
        y={snappedNode().y}
        width={props.node.width}
        height={props.node.height}
        style={{ cursor: dragging() ? 'grabbing' : 'pointer' }}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
      >
        <Dynamic<typeof SvgFlowCanvasNodeContent>
          component={props.nodeComponent ?? SvgFlowCanvasNodeContent}
          node={props.node}
        />
      </foreignObject>
      <SvgFlowCanvasNodePins node={snappedNode()} />
    </g>
  );
};

export default SvgFlowCanvasNode;
