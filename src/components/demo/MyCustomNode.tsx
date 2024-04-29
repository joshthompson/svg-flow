import { Component } from 'solid-js';
import { SvgFlowNode } from '../../models/canvas';

const MyCustomNode: Component<{ node: SvgFlowNode }> = props => {
  return (
    <div style='background: white; color: blue; border: 1px dashed black'>
      node {props.node.id}
    </div>
  );
}

export default MyCustomNode;