import { Component } from 'solid-js';
import { useSvgFlowContext } from '../../context/SvgFlowContext';

const SvgFlowCanvasDefs: Component = () => {
  const { svgFlow } = useSvgFlowContext();

  return (
    <defs>
      <marker
        id='svg-flow-connection-arrow'
        viewBox='0 0 10 10'
        refX='5'
        refY='5'
        markerWidth='10'
        markerHeight='10'
        orient='auto-start-reverse'
      >
        <path
          stroke={svgFlow.config.stroke}
          stroke-width={svgFlow.config.strokeWidth}
          fill='none'
          d='M0 0L5 5L0 10'
        />
      </marker>
    </defs>
  );
}

export default SvgFlowCanvasDefs;
