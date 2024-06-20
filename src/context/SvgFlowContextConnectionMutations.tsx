import { SetStoreFunction } from 'solid-js/store';
import { Point, SvgFlow, SvgFlowConnection, SvgFlowNode, SvgFlowResourceID } from '../models/canvas';

export enum SvgFlowPinSide {
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left',
};

interface SvgFlowPinDetails {
  side: SvgFlowPinSide;
  distance: number;
  otherDistance: number;
  connection: SvgFlowConnection;
}

export interface SvgFlowConnectionWithPinDetails extends SvgFlowConnection {
  fromPinSide: SvgFlowPinSide;
  toPinSide: SvgFlowPinSide;
  fromPinSideIndex: number;
  toPinSideIndex: number;
  fromPinSideTotal: number;
  toPinSideTotal: number;
}

const OppositePinSide: Record<SvgFlowPinSide, SvgFlowPinSide> = {
  [SvgFlowPinSide.Top]: SvgFlowPinSide.Bottom,
  [SvgFlowPinSide.Right]: SvgFlowPinSide.Left,
  [SvgFlowPinSide.Bottom]: SvgFlowPinSide.Top,
  [SvgFlowPinSide.Left]: SvgFlowPinSide.Right
};

const SvgFlowContextConnectionMutations = (
  svgFlow: SvgFlow,
) => {
  
  const connectionsWithDetails = () => {
    const connections = svgFlow.data.connections
      .map((connection): SvgFlowPinDetails | undefined => {
        const fromNode = svgFlow.data.nodes.find(node => node.id === connection.from);
        const toNode = svgFlow.data.nodes.find(node => node.id === connection.to);
        let details;
        if (fromNode && toNode) {
          const leftDist = fromNode.x - (toNode.x + toNode.width);
          const rightDist = toNode.x - (fromNode.x + fromNode.width);
          const topDist = fromNode.y - (toNode.y + toNode.height);
          const bottomDist = toNode.y - (fromNode.y + fromNode.height);
          const distances = [
            { connection, side: SvgFlowPinSide.Left, distance: leftDist, otherDistance: topDist },
            { connection, side: SvgFlowPinSide.Right, distance: rightDist, otherDistance: topDist },
            { connection, side: SvgFlowPinSide.Top, distance: topDist, otherDistance: leftDist },
            { connection, side: SvgFlowPinSide.Bottom, distance: bottomDist, otherDistance: leftDist },
          ].toSorted((a, b) => b.distance - a.distance);
          details = distances[0];
        }
        return details;
      })
      .filter((details): details is SvgFlowPinDetails => Boolean(details))
      .map((details): SvgFlowConnectionWithPinDetails => ({
        ...details.connection,
        fromPinSide: details.side,
        toPinSide: OppositePinSide[details.side],
        fromPinSideIndex: -1,
        toPinSideIndex: -1,
        fromPinSideTotal: 0,
        toPinSideTotal: 0,
      }));
    
    connections.forEach(connection => {
      const sharedFromSide = connections.filter(({ id, from, fromPinSide }) =>
        id !== connection.id &&
        from === connection.from &&
        fromPinSide === connection.fromPinSide
      );
      const sharedToSide = connections.filter(({ id, to, toPinSide }) =>
        id !== connection.id &&
        to === connection.to &&
        toPinSide === connection.toPinSide
      );
      connection.fromPinSideIndex = Math.max(...sharedFromSide.map(c => c.fromPinSideIndex), -1) + 1;
      connection.toPinSideIndex = Math.max(...sharedToSide.map(c => c.toPinSideIndex), -1) + 1;
      connection.fromPinSideTotal = sharedFromSide.length + 1;
      connection.toPinSideTotal = sharedToSide.length + 1;
    });

    // Add extra "empty" pins to bottom if needed
    svgFlow.data.nodes.forEach(node => {
      const nodeConnections = connections.filter(connection => connection.from === node.id);
      if (node.pins && node.pins > nodeConnections.length) {
        nodeConnections
          .filter(connection => connection.fromPinSide === SvgFlowPinSide.Bottom)
          .forEach(connection => connection.fromPinSideTotal = connection.fromPinSideTotal + 1);
      }
    });

    return connections;
  }

  return {
    connectionsWithDetails,
  };
}

export default SvgFlowContextConnectionMutations;
