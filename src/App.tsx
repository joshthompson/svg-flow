import { type Component } from 'solid-js';

import styles from './App.module.css';
import SvgFlowCanvas from './components/svg-flow/SvgFlowCanvas';
import SvgFlowContextProvider from './context/SvgFlowContext';
import { SvgFlowConfig, SvgFlowData } from './models/canvas';

const App: Component = () => {

  const svgFlowData: SvgFlowData = {
    nodes: [
      { id: 0, x: 35, y: 35, width: 250, height: 70, pins: 2 },
      { id: 1, x: 35, y: 165, width: 250, height: 70, pins: 1 },
      { id: 2, x: 400, y: 165, width: 250, height: 70, pins: 2 },
      { id: 3, x: 235, y: 295, width: 250, height: 70, pins: 1 },
      { id: 4, x: 565, y: 295, width: 250, height: 70, pins: 1 },
      { id: 5, x: 235, y: 425, width: 250, height: 70, pins: 1 },
      { id: 6, x: 565, y: 425, width: 250, height: 70, pins: 1 },
    ],
    connections: [
      { id: 0, from: 0, to: 1, pin: 0 },
      { id: 1, from: 0, to: 2, pin: 1 },
      { id: 2, from: 2, to: 3, pin: 0 },
      { id: 3, from: 2, to: 4, pin: 1 },
      { id: 4, from: 3, to: 5, pin: 0 },
      { id: 5, from: 4, to: 6, pin: 0 },
    ],
  };

  const svgFlowConfig: SvgFlowConfig = {
    width: 'min(800px, calc(100vw - 2 * var(--spacing-large)))',
    height: 'min(500px, calc(100svh - 80px - 2 * var(--spacing-large)))',
  };

  return (
    <div class={styles.App}>
      <header>
        <h1>SVG<em>FLOW</em></h1>
        <p><em>A Solid.js experiment (future library?)</em></p>
      </header>
      <SvgFlowContextProvider>
        <SvgFlowCanvas
          data={svgFlowData}
          config={svgFlowConfig}
        />
      </SvgFlowContextProvider>
    </div>
  );
};

export default App;
