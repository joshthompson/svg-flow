import { type Component } from 'solid-js';

import { SvgFlowNode } from '../../../models/canvas';
import { useSvgFlowContext } from '../../../context/SvgFlowContext';

const SvgFlowCanvasNodeContent: Component<{ node: SvgFlowNode }> = props => {
  const { svgFlow } = useSvgFlowContext();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'white',
      border: `1px solid ${svgFlow.config.stroke}`,
      'box-sizing': 'border-box',
      'border-radius': '8px',
      display: 'grid',
      'place-items': 'center',
    }}>
      Node: {props.node.id}
    </div>
  );
};

export default SvgFlowCanvasNodeContent;
