import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

interface AnimatedBackgroundProps {
  variant?: 'neural' | 'circuit' | 'particles';
  interactive?: boolean;
  className?: string;
}

const AnimatedBackground = ({ 
  variant = 'neural', 
  interactive = true, 
  className = '' 
}: AnimatedBackgroundProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const nodeCount = variant === 'particles' ? 60 : 25;
    
    // Initialize nodes
    const initialNodes: Node[] = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * containerRect.width,
      y: Math.random() * containerRect.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [],
    }));

    setNodes(initialNodes);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [variant, interactive]);

  useEffect(() => {
    if (nodes.length === 0) return;

    const animate = () => {
      setNodes(prevNodes => 
        prevNodes.map(node => {
          const container = containerRef.current;
          if (!container) return node;

          const containerRect = container.getBoundingClientRect();
          let { x, y, vx, vy } = node;

          // Update position
          x += vx;
          y += vy;

          // Bounce off walls
          if (x <= 0 || x >= containerRect.width) vx *= -1;
          if (y <= 0 || y >= containerRect.height) vy *= -1;

          // Keep within bounds
          x = Math.max(0, Math.min(containerRect.width, x));
          y = Math.max(0, Math.min(containerRect.height, y));

          // Mouse interaction
          if (interactive) {
            const dx = mousePos.x - x;
            const dy = mousePos.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const force = (100 - distance) / 100;
              vx += (dx / distance) * force * 0.01;
              vy += (dy / distance) * force * 0.01;
            }
          }

          // Calculate connections for neural network
          const connections: number[] = [];
          if (variant === 'neural') {
            prevNodes.forEach(otherNode => {
              if (otherNode.id !== node.id) {
                const dist = Math.sqrt((x - otherNode.x) ** 2 + (y - otherNode.y) ** 2);
                if (dist < 120) {
                  connections.push(otherNode.id);
                }
              }
            });
          }

          return { ...node, x, y, vx, vy, connections };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes.length, mousePos, variant, interactive]);

  const renderNeuralNetwork = () => (
    <svg className="absolute inset-0 w-full h-full">
      {/* Connections */}
      {nodes.map(node => 
        node.connections.map(connectionId => {
          const connectedNode = nodes.find(n => n.id === connectionId);
          if (!connectedNode) return null;

          const distance = Math.sqrt(
            (node.x - connectedNode.x) ** 2 + (node.y - connectedNode.y) ** 2
          );
          const opacity = Math.max(0.1, 1 - distance / 120);

          return (
            <motion.line
              key={`${node.id}-${connectionId}`}
              x1={node.x}
              y1={node.y}
              x2={connectedNode.x}
              y2={connectedNode.y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary/30"
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              transition={{ duration: 0.3 }}
            />
          );
        })
      )}
      
      {/* Nodes */}
      {nodes.map(node => (
        <motion.circle
          key={node.id}
          cx={node.x}
          cy={node.y}
          r="3"
          fill="currentColor"
          className="text-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.5, fill: "currentColor" }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </svg>
  );

  const renderCircuitPattern = () => (
    <div className="absolute inset-0 opacity-10">
      <svg className="w-full h-full">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path 
              d="M20 20h60v60h-60z M20 50h20 M60 50h20 M50 20v20 M50 60v20" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              className="text-primary"
            />
            <circle cx="20" cy="20" r="3" fill="currentColor" className="text-primary" />
            <circle cx="80" cy="20" r="3" fill="currentColor" className="text-primary" />
            <circle cx="20" cy="80" r="3" fill="currentColor" className="text-primary" />
            <circle cx="80" cy="80" r="3" fill="currentColor" className="text-primary" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
      
      {/* Animated pulses */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary rounded-full"
          style={{
            left: `${20 + (i % 4) * 20}%`,
            top: `${20 + Math.floor(i / 4) * 40}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );

  const renderParticles = () => (
    <div className="absolute inset-0">
      {nodes.map(node => (
        <motion.div
          key={node.id}
          className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
          style={{
            left: node.x,
            top: node.y,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 1,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Floating geometric shapes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {i % 3 === 0 ? (
            <div className="w-6 h-6 border border-primary transform rotate-45" />
          ) : i % 3 === 1 ? (
            <div className="w-6 h-6 border border-primary rounded-full" />
          ) : (
            <div className="w-6 h-6 border border-primary" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      
      {variant === 'neural' && renderNeuralNetwork()}
      {variant === 'circuit' && renderCircuitPattern()}
      {variant === 'particles' && renderParticles()}
      
      {/* Interactive glow effect */}
      {interactive && (
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(var(--primary), 0.1) 0%, transparent 70%)',
            left: mousePos.x - 64,
            top: mousePos.y - 64,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
};

export default AnimatedBackground;
