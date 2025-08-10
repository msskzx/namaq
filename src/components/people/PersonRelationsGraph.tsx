import React, { useState, useRef, useCallback } from 'react';
import type { Person } from '@/generated/prisma';
import translations from '@/components/language/translations';
import Link from 'next/link';
import type { RelationFrom, RelationTo } from '@/types/person';

interface PersonRelationsGraphProps {
  person: Person;
  relationsFrom: RelationFrom[];
  relationsTo: RelationTo[];
}

const CANVAS_SIZE = 1200;
const NODE_RADIUS = 80;
const CHILD_NODE_RADIUS = 60;
const CENTER_X = CANVAS_SIZE / 2;
const CENTER_Y = CANVAS_SIZE / 2;
const MIN_RADIUS = 180;
const MAX_RADIUS = 350;

export default function PersonRelationsGraph({ person, relationsFrom, relationsTo }: PersonRelationsGraphProps) {
  // Combine all relations for display
  const allRelations = [
    ...relationsFrom.map(rel => ({
      id: rel.id,
      name: rel.to?.name,
      type: rel.type,
      direction: 'from',
      slug: rel.to?.slug,
    })),
    ...relationsTo.map(rel => ({
      id: rel.id,
      name: rel.from?.name,
      type: rel.type,
      direction: 'to',
      slug: rel.from?.slug,
    })),
  ];

  // TODO check this or maybe remove it
  // Group relations by slug to show all types between the same two people
  const relationPairs: Record<string, { types: string[]; names: string[]; id: string; slug?: string }> = {};
  allRelations.forEach(rel => {
    if (!rel.slug) return;
    const key = [person.slug, rel.slug].sort().join('-');
    if (!relationPairs[key]) {
      relationPairs[key] = { types: [], names: [], id: rel.id, slug: rel.slug };
    }
    relationPairs[key].id = rel.id;
    relationPairs[key].slug = rel.slug;
    if (rel.type && !relationPairs[key].types.includes(rel.type)) {
      relationPairs[key].types.push(rel.type);
    }
    if (rel.name && !relationPairs[key].names.includes(rel.name)) {
      relationPairs[key].names.push(rel.name);
    }
  });
  const relationPairList = Object.entries(relationPairs);

  // Calculate dynamic radius based on number of nodes to prevent overlaps
  const calculateOptimalRadius = (nodeCount: number) => {
    if (nodeCount <= 1) return MIN_RADIUS;
    
    // Calculate minimum radius needed to fit all nodes without overlap
    // Each node needs space for its radius plus some padding
    const nodeSpacing = (CHILD_NODE_RADIUS * 2) + 20; // Node diameter + padding
    const circumference = nodeCount * nodeSpacing;
    const calculatedRadius = circumference / (2 * Math.PI);
    
    // Clamp between min and max radius
    return Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, calculatedRadius));
  };

  const radius = calculateOptimalRadius(relationPairList.length);
  const angleStep = (2 * Math.PI) / Math.max(relationPairList.length, 1);

  // Calculate positions with collision detection
  const calculateNodePositions = () => {
    const positions: Array<{ x: number; y: number; id: string }> = [];
    
    relationPairList.forEach(([, rel], i) => {
      let angle = i * angleStep - Math.PI / 2;
      let x = CENTER_X + radius * Math.cos(angle);
      let y = CENTER_Y + radius * Math.sin(angle);
      
      // Simple collision detection and adjustment
      let attempts = 0;
      const maxAttempts = 20;
      
      while (attempts < maxAttempts) {
        let hasCollision = false;
        
        // Check collision with existing nodes
        for (const pos of positions) {
          const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
          const minDistance = (CHILD_NODE_RADIUS * 2) + 15; // Minimum distance between node centers
          
          if (distance < minDistance) {
            hasCollision = true;
            break;
          }
        }
        
        // Check collision with center node
        const centerDistance = Math.sqrt((x - CENTER_X) ** 2 + (y - CENTER_Y) ** 2);
        const minCenterDistance = NODE_RADIUS + CHILD_NODE_RADIUS + 20;
        
        if (centerDistance < minCenterDistance) {
          hasCollision = true;
        }
        
        if (!hasCollision) {
          break;
        }
        
        // Adjust position if collision detected
        angle += Math.PI / 12; // Rotate by 15 degrees
        const adjustedRadius = radius + (attempts * 15); // Gradually increase radius
        x = CENTER_X + adjustedRadius * Math.cos(angle);
        y = CENTER_Y + adjustedRadius * Math.sin(angle);
        
        attempts++;
      }
      
      positions.push({ x, y, id: rel.id });
    });
    
    return positions;
  };

  const nodePositions = calculateNodePositions();

  // Use Arabic translations for relation types
  const relationTypeArabic = translations.ar.relationTypes;

  // Track which node is hovered (by id or 'center')
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Zoom and pan state
  const [transform, setTransform] = useState({ x: 100, y: 100, scale: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Zoom functionality
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, transform.scale * delta));
    
    // Get mouse position relative to SVG
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate new transform to zoom towards mouse position
    const newX = mouseX - (mouseX - transform.x) * (newScale / transform.scale);
    const newY = mouseY - (mouseY - transform.y) * (newScale / transform.scale);
    
    setTransform({ x: newX, y: newY, scale: newScale });
  }, [transform]);
  
  // Pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start dragging if clicking on the SVG background (not on nodes)
    if (e.target === svgRef.current || (e.target as Element).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setTransform(prev => ({ ...prev, x: newX, y: newY }));
  }, [isDragging, dragStart]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Reset zoom and pan
  const resetView = useCallback(() => {
    setTransform({ x: 100, y: 100, scale: 0.8 });
  }, []);

  return (
    <div className="flex flex-col items-center my-8">
      {/* Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={resetView}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm"
        >
          إعادة تعيين العرض
        </button>
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <span>تكبير: عجلة الماوس</span>
          <span>•</span>
          <span>سحب: اسحب الخلفية</span>
        </div>
      </div>
      
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <svg 
          ref={svgRef}
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE} 
          style={{ display: 'block', cursor: isDragging ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Transform group for zoom and pan */}
          <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
            {/* Render all lines first so they appear beneath the nodes */}
            {nodePositions.map((pos) => {
              return (
                <line key={pos.id + '-line'} x1={CENTER_X} y1={CENTER_Y} x2={pos.x} y2={pos.y} stroke="#888" strokeWidth={2} />
              );
            })}
        {/* Center node (the person) with hover effect */}
        {(() => {
          const isHovered = hoveredNode === 'center';
          const centerRadius = isHovered ? NODE_RADIUS + 12 : NODE_RADIUS;
          const centerFill = isHovered ? '#312e81' : '#1e1b4b'; // indigo-900 on hover, indigo-950 default
          const centerTextFill = '#fbbf24';
          const centerTextWeight = isHovered ? 900 : 700;
          if (person.slug) {
            return (
              <g onMouseEnter={() => setHoveredNode('center')} onMouseLeave={() => setHoveredNode(null)} style={{ transition: 'all 0.2s' }}>
                <Link href={`/people/${person.slug}`}>
                  <circle cx={CENTER_X} cy={CENTER_Y} r={centerRadius} fill={centerFill} style={{ cursor: 'pointer', transition: 'all 0.2s' }} />
                  <text x={CENTER_X} y={CENTER_Y} textAnchor="middle" dominantBaseline="middle" fill={centerTextFill} fontSize={22} fontWeight={centerTextWeight} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                    {person.name}
                  </text>
                </Link>
              </g>
            );
          } else {
            return (
              <g onMouseEnter={() => setHoveredNode('center')} onMouseLeave={() => setHoveredNode(null)} style={{ transition: 'all 0.2s' }}>
                <circle cx={CENTER_X} cy={CENTER_Y} r={centerRadius} fill={centerFill} style={{ transition: 'all 0.2s' }} />
                <text x={CENTER_X} y={CENTER_Y} textAnchor="middle" dominantBaseline="middle" fill={centerTextFill} fontSize={22} fontWeight={centerTextWeight} style={{ transition: 'all 0.2s' }}>
                  {person.name}
                </text>
              </g>
            );
          }
        })()}
        {/* Relation nodes */}
        {relationPairList.map(([, rel]) => {
          const position = nodePositions.find(pos => pos.id === rel.id);
          if (!position) return null;
          
          const { x, y } = position;
          const isHovered = hoveredNode === rel.id;
          const nodeRadius = isHovered ? CHILD_NODE_RADIUS + 10 : CHILD_NODE_RADIUS;
          const nodeFill = isHovered ? '#374151' : '#1f2937'; // gray-700 on hover, gray-800 default
          const textWeight = isHovered ? 900 : 700;
          return (
            <g key={rel.id} onMouseEnter={() => setHoveredNode(rel.id)} onMouseLeave={() => setHoveredNode(null)} style={{ transition: 'all 0.2s' }}>
              {/* Node as a link if slug exists; only circle and text are clickable */}
              <g>
                {rel.slug ? (
                  <Link href={`/people/${rel.slug}`}>
                    <circle cx={x} cy={y} r={nodeRadius} fill={nodeFill} style={{ cursor: 'pointer', transition: 'all 0.2s' }} />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#fbbf24" fontSize={16} fontWeight={textWeight} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                      {rel.names[0]}
                    </text>
                  </Link>
                ) : (
                  <>
                    <circle cx={x} cy={y} r={nodeRadius} fill={nodeFill} style={{ transition: 'all 0.2s' }} />
                    <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#fbbf24" fontSize={16} fontWeight={textWeight} style={{ transition: 'all 0.2s' }}>
                      {rel.names[0]}
                    </text>
                  </>
                )}
              </g>
              {/* All relation type labels under the node, reversed order */}
              {[...rel.types].reverse().map((type, idx) => {
                const labelY = y + nodeRadius + 18 + idx * 16;
                return (
                  <text key={type} x={x} y={labelY} textAnchor="middle" fill="#818cf8" fontSize={13} fontWeight="bold">
                    {relationTypeArabic[type as keyof typeof relationTypeArabic] || type}
                  </text>
                );
              })}
            </g>
          );
        })}
          </g>
        </svg>
      </div>
    </div>
  );
} 