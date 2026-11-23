import { useEffect, useMemo, useRef, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import type { Flow, FlowEdge, FlowNode } from "../data/flows";
import { useSlideRuntime } from "../engine/runtime";

type Point = { x: number; y: number };

const DEFAULT_W = 330;
const DEFAULT_H = 104;
const DECISION_W = 380;
const DECISION_H = 210;
const DIAMOND = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";

function sizeOf(node: FlowNode) {
  return {
    w: node.w ?? (node.kind === "decision" ? DECISION_W : DEFAULT_W),
    h: node.h ?? (node.kind === "decision" ? DECISION_H : DEFAULT_H),
  };
}

function edgePoints(a: FlowNode, b: FlowNode, edge: FlowEdge, flow: Flow): Point[] {
  const A = { ...sizeOf(a), x: a.x, y: a.y };
  const B = { ...sizeOf(b), x: b.x, y: b.y };
  const margin = 76;

  // explicit travel lanes: the branch leaves the side of the map and comes back in
  if (edge.route) {
    const x =
      edge.route === "left"
        ? Math.max(24, Math.min(A.x, B.x) - 110)
        : Math.min(flow.width - 30, Math.max(A.x + A.w, B.x + B.w) + 110);
    const yA = A.y + A.h / 2;
    const yB = B.y + B.h / 2;
    return [
      { x: edge.route === "left" ? A.x : A.x + A.w, y: yA },
      { x, y: yA },
      { x, y: yB },
      { x: edge.route === "left" ? B.x : B.x + B.w, y: yB },
    ];
  }

  if (edge.tone === "loop") {
    const goRight = A.x + A.w / 2 > flow.width / 2;
    if (goRight) {
      const x = Math.min(flow.width - 24, Math.max(A.x + A.w, B.x + B.w) + margin);
      return [
        { x: A.x + A.w, y: A.y + A.h / 2 },
        { x, y: A.y + A.h / 2 },
        { x, y: B.y + B.h / 2 },
        { x: B.x + B.w, y: B.y + B.h / 2 },
      ];
    }
    const x = Math.max(24, Math.min(A.x, B.x) - margin);
    return [
      { x: A.x, y: A.y + A.h / 2 },
      { x, y: A.y + A.h / 2 },
      { x, y: B.y + B.h / 2 },
      { x: B.x, y: B.y + B.h / 2 },
    ];
  }

  const below = B.y >= A.y + A.h + 6;
  const above = B.y + B.h <= A.y - 6;

  if (below || above) {
    const start = { x: A.x + A.w / 2, y: below ? A.y + A.h : A.y };
    const end = { x: B.x + B.w / 2, y: below ? B.y : B.y + B.h };
    if (Math.abs(start.x - end.x) < 2) return [start, end];
    const midY = (start.y + end.y) / 2;
    const collides = flow.nodes.some((node) => {
      if (node.id === a.id || node.id === b.id) return false;
      const s = sizeOf(node);
      return (
        node.y < midY &&
        node.y + s.h > midY &&
        Math.min(start.x, end.x) < node.x + s.w &&
        Math.max(start.x, end.x) > node.x
      );
    });
    if (collides) {
      const x = Math.max(A.x + A.w, B.x + B.w) + margin;
      return [
        { x: A.x + A.w, y: A.y + A.h / 2 },
        { x, y: A.y + A.h / 2 },
        { x, y: B.y + B.h / 2 },
        { x: B.x + B.w, y: B.y + B.h / 2 },
      ];
    }
    return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
  }

  if (B.x > A.x) {
    const start = { x: A.x + A.w, y: A.y + A.h / 2 };
    const end = { x: B.x, y: B.y + B.h / 2 };
    if (Math.abs(start.y - end.y) < 2) return [start, end];
    const midX = (start.x + end.x) / 2;
    return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
  }
  const start = { x: A.x, y: A.y + A.h / 2 };
  const end = { x: B.x + B.w, y: B.y + B.h / 2 };
  if (Math.abs(start.y - end.y) < 2) return [start, end];
  const midX = (start.x + end.x) / 2;
  return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
}

/** the label rides the middle of the longest run, never a corner */
function labelPoint(points: Point[]): Point {
  let best = 0;
  let bestLen = -1;
  for (let i = 0; i < points.length - 1; i += 1) {
    const dx = points[i + 1].x - points[i].x;
    const dy = points[i + 1].y - points[i].y;
    const len = Math.hypot(dx, dy);
    if (len > bestLen) {
      bestLen = len;
      best = i;
    }
  }
  const a = points[best];
  const b = points[best + 1] ?? a;
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function toPath(points: Point[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
}

export function FlowDiagram({
  flow,
  step,
  className = "",
  viewportW = 1720,
  viewportH = 640,
}: {
  flow: Flow;
  step: number;
  className?: string;
  viewportW?: number;
  viewportH?: number;
}) {
  const { reducedMotion } = useSlideRuntime();
  const nodeMap = useMemo(() => new Map(flow.nodes.map((node) => [node.id, node])), [flow.nodes]);
  const edgeKey = (edge: FlowEdge) => `${edge.from}->${edge.to}`;

  const visible = useMemo(() => {
    const ids = new Set<string>();
    for (let i = 0; i <= Math.min(step, flow.groups.length - 1); i += 1) {
      flow.groups[i]?.forEach((id) => ids.add(id));
    }
    return ids;
  }, [flow.groups, step]);

  const activeId = useMemo(() => {
    const group = flow.groups[Math.min(step, flow.groups.length - 1)];
    return group ? group[group.length - 1] : flow.nodes[0]?.id;
  }, [flow.groups, flow.nodes, step]);

  const activeNode = activeId ? nodeMap.get(activeId) : undefined;

  const cameraRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef(new Map<string, SVGPathElement>());
  const prevActive = useRef<string | null>(null);
  const userMoved = useRef(false);
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const scaleRef = useRef(0.92);

  // a new fragment brings the camera back to the active node
  useEffect(() => {
    userMoved.current = false;
  }, [step]);

  useEffect(() => {
    if (!activeNode || !cameraRef.current) return;
    if (userMoved.current) return;
    const scale = 0.92;
    scaleRef.current = scale;
    const cx = activeNode.x + sizeOf(activeNode).w / 2;
    const cy = activeNode.y + sizeOf(activeNode).h / 2;
    let tx = viewportW / 2 - cx * scale;
    let ty = viewportH / 2 - cy * scale;
    const minX = Math.min(0, viewportW - flow.width * scale);
    const minY = Math.min(0, viewportH - flow.height * scale);
    tx = Math.max(minX, Math.min(0, tx));
    ty = Math.max(minY, Math.min(0, ty));
    if (flow.width * scale < viewportW) tx = (viewportW - flow.width * scale) / 2;
    if (flow.height * scale < viewportH) ty = (viewportH - flow.height * scale) / 2;

    const el = cameraRef.current;
    if (reducedMotion) {
      gsap.set(el, { x: tx, y: ty, scale });
      return;
    }
    gsap.to(el, { x: tx, y: ty, scale, duration: 0.85, ease: "power3.inOut", overwrite: true });
  }, [activeNode, flow.height, flow.width, reducedMotion, viewportH, viewportW]);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball || !activeNode) return;
    const previous = prevActive.current;
    prevActive.current = activeNode.id;

    if (!previous || previous === activeNode.id) {
      // rest on the node's edge, never on top of its label
      const { w, h } = sizeOf(activeNode);
      gsap.set(ball, { x: activeNode.x + w / 2, y: activeNode.y + h, opacity: 1 });
      return;
    }

    const edge = flow.edges.find((item) => item.from === previous && item.to === activeNode.id);
    const path = edge ? pathRefs.current.get(edgeKey(edge)) : null;
    const nodeSize = sizeOf(activeNode);
    const target = { x: activeNode.x + nodeSize.w / 2, y: activeNode.y };

    if (!path || reducedMotion) {
      gsap.to(ball, {
        x: target.x,
        y: target.y,
        opacity: 1,
        duration: reducedMotion ? 0.01 : 0.35,
        ease: "power2.out",
        overwrite: true,
      });
      return;
    }

    const length = path.getTotalLength();
    const proxy = { t: 0 };
    gsap.to(proxy, {
      t: 1,
      duration: 0.85,
      ease: "power2.inOut",
      onUpdate: () => {
        const point = path.getPointAtLength(proxy.t * length);
        gsap.set(ball, { x: point.x, y: point.y });
      },
      onComplete: () => {
        const point = path.getPointAtLength(length);
        gsap.set(ball, { x: point.x, y: point.y });
      },
    });
    gsap.set(ball, { opacity: 1 });
  }, [activeNode, flow.edges, reducedMotion]);

  const stageFactor = () => {
    const root = document.querySelector<HTMLElement>("[data-stage-root]");
    return root ? root.getBoundingClientRect().width / 1920 || 1 : 1;
  };

  const onDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = cameraRef.current;
    if (!el) return;
    event.stopPropagation();
    userMoved.current = true;
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      tx: Number(gsap.getProperty(el, "x")) || 0,
      ty: Number(gsap.getProperty(el, "y")) || 0,
    };
    try {
      el.setPointerCapture?.(event.pointerId);
    } catch {
      /* synthetic or already released pointer */
    }
  };

  const onDragMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = cameraRef.current;
    if (!drag || !el) return;
    event.stopPropagation();
    const factor = stageFactor();
    const scale = scaleRef.current;
    const minX = Math.min(0, viewportW - flow.width * scale);
    const minY = Math.min(0, viewportH - flow.height * scale);
    const nx = Math.max(minX, Math.min(0, drag.tx + (event.clientX - drag.x) / factor));
    const ny = Math.max(minY, Math.min(0, drag.ty + (event.clientY - drag.y) / factor));
    gsap.set(el, { x: nx, y: ny });
  };

  const onDragEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = null;
    try {
      cameraRef.current?.releasePointerCapture?.(event.pointerId);
    } catch {
      /* pointer already released */
    }
  };

  const accent = flow.accent === "gold" ? "#b8853f" : "#0f5e58";
  const accentSoft = flow.accent === "gold" ? "#ca9c5e" : "#3f8a80";

  return (
    <div
      data-no-advance
      className={`relative cursor-grab overflow-hidden active:cursor-grabbing ${className}`}
      style={{ touchAction: "none" }}
      onPointerDown={onDragStart}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      onPointerCancel={onDragEnd}
    >
      <div
        ref={cameraRef}
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: flow.width, height: flow.height }}
      >
        <svg
          className="absolute inset-0"
          width={flow.width}
          height={flow.height}
          viewBox={`0 0 ${flow.width} ${flow.height}`}
          aria-hidden
        >
          <defs>
            <marker
              id={`arrow-${flow.id}`}
              markerWidth="12"
              markerHeight="12"
              refX="8"
              refY="6"
              orient="auto"
            >
              <path d="M 1 1 L 11 6 L 1 11 z" fill={accent} fillOpacity="0.55" />
            </marker>
          </defs>
          {flow.edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const points = edgePoints(from, to, edge, flow);
            const isVisible = visible.has(edge.from) && visible.has(edge.to);
            const d = toPath(points);
            const mid = labelPoint(points);
            const labelW = edge.label ? Math.max(96, edge.label.length * 11 + 30) : 96;
            return (
              <g key={edgeKey(edge)}>
                <motion.path
                  d={d}
                  fill="none"
                  stroke={edge.tone === "no" ? "#9aa3a0" : accent}
                  strokeOpacity={edge.tone === "no" ? 0.5 : 0.55}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd={`url(#arrow-${flow.id})`}
                  pathLength={1}
                  strokeDasharray="1"
                  initial={{ strokeDashoffset: 1, opacity: 0 }}
                  animate={{ strokeDashoffset: isVisible ? 0 : 1, opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
                {isVisible && edge.label && (
                  <g>
                    <rect
                      x={mid.x - labelW / 2}
                      y={mid.y - 20}
                      width={labelW}
                      height={40}
                      rx={20}
                      fill="#fdfaf3"
                      stroke={edge.tone === "no" ? "#c9cfcb" : accentSoft}
                      strokeOpacity={0.5}
                    />
                    <text
                      x={mid.x}
                      y={mid.y + 8}
                      textAnchor="middle"
                      fontSize={19}
                      fontFamily="Tajawal, sans-serif"
                      fill={edge.tone === "no" ? "#6b7470" : accent}
                    >
                      {edge.label}
                    </text>
                  </g>
                )}
                <path
                  ref={(el) => {
                    if (el) pathRefs.current.set(edgeKey(edge), el);
                    else pathRefs.current.delete(edgeKey(edge));
                  }}
                  d={d}
                  fill="none"
                  stroke="none"
                />
              </g>
            );
          })}
        </svg>

        {flow.nodes.map((node) => {
          const isVisible = visible.has(node.id);
          const { w, h } = sizeOf(node);
          const isDecision = node.kind === "decision";
          const isEnd = node.kind === "end";
          const isStart = node.kind === "start";
          const isTerminal = node.kind === "terminal";
          const isActive = node.id === activeId;

          return (
            <motion.div
              key={node.id}
              className="absolute flex items-center justify-center text-center"
              style={{
                left: node.x,
                top: node.y,
                width: w,
                height: h,
                zIndex: isActive ? 25 : 15,
                filter:
                  isActive && isDecision
                    ? `drop-shadow(0 16px 26px rgba(68,47,20,0.28))`
                    : undefined,
              }}
              initial={false}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.92 }}
              transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {isDecision ? (
                <>
                  <span
                    className="absolute inset-0"
                    style={{ clipPath: DIAMOND, background: isActive ? accent : `${accent}66` }}
                  />
                  <span
                    className="absolute"
                    style={{ inset: 3, clipPath: DIAMOND, background: "#fffdf8" }}
                  />
                  <span
                    className="relative z-10 font-medium text-ink"
                    style={{ fontSize: 26, lineHeight: 1.35, maxWidth: 190 }}
                  >
                    {node.label}
                  </span>
                </>
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center px-6"
                  style={{
                    borderRadius: isStart || isEnd ? 999 : 26,
                    background: isEnd
                      ? "linear-gradient(135deg,#e3cba1,#ca9c5e 45%,#b8853f)"
                      : isStart
                        ? `linear-gradient(135deg, ${accent}, ${flow.accent === "gold" ? "#ca9c5e" : "#147068"})`
                        : "#fffdf8",
                    border: isTerminal
                      ? `2px dashed ${accentSoft}`
                      : isStart || isEnd
                        ? "none"
                        : `1.6px solid ${accent}33`,
                    boxShadow: isActive
                      ? `0 18px 40px -20px ${accent}88, 0 0 0 4px ${accent}18`
                      : "0 10px 24px -18px rgba(68,47,20,.35)",
                    color: isStart || isEnd ? "#fdfaf3" : "#374151",
                  }}
                >
                  <span
                    className="font-medium"
                    style={{
                      fontSize: isStart || isEnd ? 30 : 27,
                      lineHeight: 1.35,
                      fontWeight: isStart || isEnd ? 700 : 500,
                    }}
                  >
                    {node.label}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}

        <div
          ref={ballRef}
          className="pointer-events-none absolute left-0 top-0 z-30 h-[20px] w-[20px] rounded-full opacity-0"
          style={{
            marginLeft: -10,
            marginTop: -10,
            background: "radial-gradient(circle at 35% 30%, #f9ecd4, #ca9c5e 58%, #b8853f)",
            boxShadow: "0 0 0 7px rgba(202,156,94,.16), 0 0 28px rgba(202,156,94,.7)",
          }}
        />
      </div>
    </div>
  );
}
