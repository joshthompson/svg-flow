import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'solid-testing-library';
import SvgFlowCanvasControls from './SvgFlowCanvasControls';
import SvgFlowContextProvider, { useSvgFlowContext } from '../../context/SvgFlowContext';

const TestingComponent = () => {
  const { svgFlow } = useSvgFlowContext();
  return (
    <>
      <SvgFlowCanvasControls />
      <span data-testid='zoom-value'>{svgFlow.canvas.zoom}</span>
    </>
  );
};

describe('SvgFlowCanvasControls', () => {
  let result: ReturnType<typeof render>;

  beforeEach(() => {
    cleanup();
    result = render(() => (
      <SvgFlowContextProvider>
        <TestingComponent />
      </SvgFlowContextProvider>
    ));
  });

  it('should create', () => {
    expect(result).toBeTruthy();
  });

  it('should zoom in and out when clicked', async () => {
    expect(result.getByTestId('zoom-value').textContent).toEqual('1');
    result.getByTestId('zoom-in').click();
    expect(result.getByTestId('zoom-value').textContent).toEqual('1.1');
    result.getByTestId('zoom-out').click();
    expect(result.getByTestId('zoom-value').textContent).toEqual('1');
  });
});
