import { Component } from 'solid-js';
import styles from './SvgFlowDebug.module.css';
import { useSvgFlowContext } from '../../context/SvgFlowContext';

const SvgFlowDebug: Component = () => {
  const { svgFlow } = useSvgFlowContext();
  return (
    <div class={styles.SvgFlowDebug} style={{ width: svgFlow.state.width + 'px' }}>
      <div>
        <pre>state: {JSON.stringify(svgFlow.state, undefined, 2)}</pre>
        <pre>canvas: {JSON.stringify(svgFlow.canvas, undefined, 2)}</pre>
        <pre>config: {JSON.stringify(svgFlow.config, undefined, 2)}</pre>
      </div>
      <pre>nodes: {JSON.stringify(svgFlow.data.nodes, undefined, 2)}</pre>
      <pre>connections: {JSON.stringify(svgFlow.data.connections, undefined, 2)}</pre>
    </div>
  )
};

export default SvgFlowDebug;
