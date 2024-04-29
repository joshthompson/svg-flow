import { Index, type Component } from 'solid-js';

import { useSvgFlowContext } from '../../context/SvgFlowContext';
import SvgFlowCanvasConnection from './SvgFlowCanvasConnection';

const SvgFlowCanvasConnections: Component = () => {
  const { svgFlow } = useSvgFlowContext();
  return (
    <g class='connections'>
      <Index each={svgFlow.data.connections}>
        {(_, index) => <SvgFlowCanvasConnection index={index} />}
      </Index>
    </g>
  );
}

export default SvgFlowCanvasConnections;
