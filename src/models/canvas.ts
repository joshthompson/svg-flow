export interface SvgFlow {
  nodes: SvgFlowNode[];
  connections: SvgFlowConnection[];
  canvas: SvgFlowCanvas;
  config: SvgFlowConfig;
}

export interface SvgFlowNode {
  id: SvgFlowResourceID;
  x: number;
  y: number;
  width: number;
  height: number;
  pins?: number;
}

export interface SvgFlowConnection {
  id: SvgFlowResourceID;
  from: SvgFlowResourceID;
  to: SvgFlowResourceID;
  pin: number;
}

export interface SvgFlowCanvas {
  zoom: number;
  x: number;
  y: number;
}

export interface SvgFlowConfig {
  background: string;
  width: number;
  height: number;

  // styles: {
  //   canvas?: SvgFlowCanvasStyle;
  //   pin?: SvgFlowCanvasPinStyle;
  //   connection?: SvgFlowCanvasConnectionStyle;
  // }

  stroke: string;
  strokeWidth: number;
}

export type SvgFlowResourceID = number | string;
