import { SvgFlowNode } from "../models/canvas";

export const snapNode = (node: SvgFlowNode, snapTo?: number): SvgFlowNode => ({
  ...node,
  x: snapTo ? Math.round(node.x / snapTo) * snapTo : node.x,
  y: snapTo ? Math.round(node.y / snapTo) * snapTo : node.y,
});
