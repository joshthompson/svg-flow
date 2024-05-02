import { SetStoreFunction } from 'solid-js/store';
import { SvgFlow, SvgFlowNode, SvgFlowResourceID } from '../models/canvas';

const SvgFlowContextNodeMutations = (
  _svgFlow: SvgFlow,
  setSvgFlow: SetStoreFunction<SvgFlow>,
) => {
  
  const setNode = (
    nodeId: SvgFlowResourceID | undefined,
    update: Partial<SvgFlowNode> | ((prev: SvgFlowNode) => Partial<SvgFlowNode>),
  ) => {
    setSvgFlow('data', 'nodes', node => node.id === nodeId, update);
  }

  return {
    setNode,
  };
}

export default SvgFlowContextNodeMutations;
