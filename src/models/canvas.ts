export interface SvgFlow {
  data: SvgFlowData;
  canvas: SvgFlowCanvas;
  state: SvgFlowState;
  config: Required<SvgFlowConfig>;
}

export interface SvgFlowData<T = undefined> {
  nodes: SvgFlowNode<T>[];
  connections: SvgFlowConnection[];
}

export interface SvgFlowState {
  width: number;
  height: number;
  hoverNode?: SvgFlowResourceID;
  draggingNode?: SvgFlowResourceID;
}

export type SvgFlowNode<T = undefined> = {
  id: SvgFlowResourceID;
  x: number;
  y: number;
  width: number;
  height: number;
  pins?: number;
} & (T extends undefined ? {} : { data: T })

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
  background?: string;
  grid?: 'dots' | 'lines' | 'none';
  autoNodeHeight?: boolean;
  snapTo?: number;
  resizeOnInit?: boolean;
  stroke?: string;
  strokeWidth?: number;
  showControls?: boolean;
  width?: string;
  height?: string;
}

export type SvgFlowResourceID = number | string;
