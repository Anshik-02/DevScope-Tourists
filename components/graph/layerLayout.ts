import { Edge, Node, Position } from "reactflow";

const LAYER_WIDTH = 1200; // Increased spacing for 'Cinematic Breadth'
const NODE_WIDTH = 520;
const NODE_HEIGHT = 180;
const VERTICAL_SPACING = 350;

const LAYER_ORDER = ["folder", "api", "route", "component", "service", "function", "database", "other"];

export default function getLayerLayoutedElements(nodes: Node[], edges: Edge[], rankdir: "LR" | "TB" = "LR") {
  const groups = new Map<string, Node[]>();
  
  nodes.forEach((n) => {
    const type = n.data?.type || "other";
    const group = groups.get(type) || [];
    group.push(n);
    groups.set(type, group);
  });

  const layeredNodes: Node[] = [];
  let colIndex = 0;

  for (const layerType of LAYER_ORDER) {
    const group = groups.get(layerType);
    if (!group || group.length === 0) continue;

    const totalHeight = group.length * VERTICAL_SPACING;
    const startY = -totalHeight / 2 + (VERTICAL_SPACING / 2);

    group.forEach((n, rowIndex) => {
      layeredNodes.push({
        ...n,
        type: "custom",
        targetPosition: rankdir === "LR" ? Position.Left : Position.Top,
        sourcePosition: rankdir === "LR" ? Position.Right : Position.Bottom,
        position: {
          x: rankdir === "LR" ? colIndex * LAYER_WIDTH : startY + rowIndex * VERTICAL_SPACING - (NODE_HEIGHT / 2),
          y: rankdir === "LR" ? startY + rowIndex * VERTICAL_SPACING - (NODE_HEIGHT / 2) : colIndex * LAYER_WIDTH,
        },
        data: {
          ...n.data,
          layerCol: colIndex,
          sequence: colIndex + 1,
        },
      });
    });
    colIndex++;
  }

  // Handle remaining unknown types
  groups.forEach((group, type) => {
    if (LAYER_ORDER.includes(type)) return;
    
    const totalHeight = group.length * VERTICAL_SPACING;
    const startY = -totalHeight / 2 + (VERTICAL_SPACING / 2);

    group.forEach((n, rowIndex) => {
      layeredNodes.push({
        ...n,
        type: "custom",
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
        position: {
          x: colIndex * LAYER_WIDTH,
          y: startY + rowIndex * VERTICAL_SPACING - (NODE_HEIGHT / 2),
        },
        data: { ...n.data },
      });
    });
    colIndex++;
  });

  return { nodes: layeredNodes, edges };
}
