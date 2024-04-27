import { Component } from 'solid-js';
import { SvgFlowNode } from '../../models/canvas';

const MyCustomNode: Component<{ node: SvgFlowNode }> = props => {
  return (
    <>
      node
    </>
  );
}

export default MyCustomNode;