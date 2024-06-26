import { Component, JSX, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { SvgFlow } from '../models/canvas';
import SvgFlowContextCanvasMutations from './SvgFlowContextCanvasMutations';
import SvgFlowContextNodeMutations from './SvgFlowContextNodeMutations';
import SvgFlowContextConnectionMutations from './SvgFlowContextConnectionMutations';

export const DefaultSvgFlowConfig: SvgFlow['config'] = {
  background: '#FDFDFD',
  stroke: '#DEDEDE',
  strokeWidth: 1,
  style: 'dots',
  snapTo: 0,
  autoNodeHeight: true,
  resizeOnInit: true,
  showControls: true,
  showDebug: false,
  width: '800px',
  height: '500px',
  allowConnectionEdit: true,
  allowNodeMove: true,
};

function useProvideValue() {
  const [svgFlow, setSvgFlow] = createStore<SvgFlow>({
    data: {
      nodes: [],
      connections: [],
    },
    state: {
      width: 1,
      height: 1,
    },
    canvas: {
      zoom: 1,
      x: 0,
      y: 0,
    },
    config: DefaultSvgFlowConfig,
  });
  
  return { svgFlow, setSvgFlow };
}

export const SvgFlowContext = createContext<ReturnType<typeof useProvideValue>>(useProvideValue());

export const SvgFlowContextProvider: Component<{ children: JSX.Element }> = props => {
  return (
    <SvgFlowContext.Provider value={useProvideValue()}>
      {props.children}
    </SvgFlowContext.Provider>
  );
}

export const useSvgFlowContext = () => {
  const { svgFlow, setSvgFlow } = useContext(SvgFlowContext);
  return {
    svgFlow,
    setSvgFlow,
    ...SvgFlowContextNodeMutations(svgFlow, setSvgFlow),
    ...SvgFlowContextCanvasMutations(svgFlow, setSvgFlow),
    ...SvgFlowContextConnectionMutations(svgFlow),
  };
};

export default SvgFlowContextProvider;
