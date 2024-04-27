import { type Component } from 'solid-js';

import styles from './App.module.css';
import SvgFlowCanvas from './components/svg-flow/SvgFlowCanvas';
import SvgFlowContextProvider from './context/SvgFlowContext';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <h1>SVG Flow</h1>
      <SvgFlowContextProvider>
        <SvgFlowCanvas />
      </SvgFlowContextProvider>
    </div>
  );
};

export default App;
