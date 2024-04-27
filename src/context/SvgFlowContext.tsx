import { Component, JSX, createContext, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { SvgFlow } from '../models/canvas';

function useProvideValue() {
  const [svgFlow, setSvgFlow] = createStore<SvgFlow>({
    nodes: [
      { id: 0, x: 10, y: 10, width: 250, height: 70, pins: 2 },
      { id: 1, x: 50, y: 140, width: 250, height: 70, pins: 1 },
      { id: 2, x: 350, y: 140, width: 250, height: 70, pins: 0 },
    ],
    connections: [
      { id: 0, from: 0, to: 1, pin: 0 },
      { id: 1, from: 0, to: 2, pin: 1 },
    ],
    canvas: {
      zoom: 1,
      x: 0,
      y: 0,
    },
    config: {
      background: '#FDFDFD',
      width: 800,
      height: 500,
      stroke: '#DEDEDE',
      strokeWidth: 1,
    },
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

export const useSvgFlowContext = () => useContext(SvgFlowContext);

export default SvgFlowContextProvider;
