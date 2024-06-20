import { Index, type Component } from 'solid-js';

import { useSvgFlowContext } from '../../../context/SvgFlowContext';
import SvgFlowCanvasConnection from '../SvgFlowCanvasConnection/SvgFlowCanvasConnection';

const SvgFlowCanvasConnections: Component = () => {
  const { connectionsWithDetails } = useSvgFlowContext();
  return (
    <g class='connections'>
      <Index each={connectionsWithDetails()}>
        {connection => <SvgFlowCanvasConnection connection={connection()} />}
      </Index>
    </g>
  );
}

export default SvgFlowCanvasConnections;
