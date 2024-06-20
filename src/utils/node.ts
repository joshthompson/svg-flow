import { SvgFlowPinSide } from "../context/SvgFlowContextConnectionMutations";
import { Point, SvgFlowNode } from "../models/canvas";

export const snapNode = (node: SvgFlowNode, snapTo?: number): SvgFlowNode => ({
  ...node,
  x: snapTo ? Math.round(node.x / snapTo) * snapTo : node.x,
  y: snapTo ? Math.round(node.y / snapTo) * snapTo : node.y,
});

export const getNodePinPosition = (
  node: SvgFlowNode,
  pinSide: SvgFlowPinSide,
  pinIndex: number,
  pins: number,
): Point => {
  switch (pinSide) {
    case SvgFlowPinSide.Bottom:
      return {
        x: node.x + (1 + pinIndex) * node.width / (1 + pins),
        y: node.y + node.height,
      };
    case SvgFlowPinSide.Top:
      return {
        x: node.x + (1 + pinIndex) * node.width / (1 + pins),
        y: node.y,
      };
    case SvgFlowPinSide.Left:
      return {
        x: node.x,
        y: node.y + (1 + pinIndex) * node.height / (1 + pins),
      };
    case SvgFlowPinSide.Right:
      return {
        x: node.x + node.width,
        y: node.y + (1 + pinIndex) * node.height / (1 + pins),
      };
  }
};