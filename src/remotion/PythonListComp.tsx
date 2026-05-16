import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  Series,
} from 'remotion';
import React from 'react';
import {
  HardHat,
  Zap,
  Repeat,
  Code,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import {PYTHON_COMP_CONFIG} from './constants';

const Montserrat = 'Montserrat, sans-serif';
const Inter = 'Inter, sans-serif';

// Validated pop easing as per v5.3
const v5Pop = (t: number) => Easing.bezier(0.16, 1, 0.3, 1)(t);

const getMotionBlur = (frame: number, start: number, duration: number, fromVal: number, toVal: number) => {
  if (frame < start || frame > start + duration) return 0;
  
  const t = (frame - start) / duration;
  const nextT = (frame + 1 - start) / duration;
  
  const pos = interpolate(v5Pop(t), [0, 1], [fromVal, toVal]);
  const nextPos = interpolate(v5Pop(nextT), [0, 1], [fromVal, toVal]);
  
  const velocity = Math.abs(nextPos - pos);
  return Math.min(velocity * 0.15, 40); 
};

const KineticElement: React.FC<{
  children?: React.ReactNode;
  startFrame: number;
  durationInFrames: number;
  from: {x: number; y: number; scale?: number; rotate?: number};
  to: {x: number; y: number; scale?: number; rotate?: number};
  style?: React.CSSProperties;
  principles?: {squash?: number; stretch?: number};
  exit?: {type: 'fade' | 'slide-left' | 'slide-up' | 'slide-down'; duration: number; startFrame: number; to?: {x: number; y: number}};
}> = ({children, startFrame, durationInFrames, from, to, style, principles, exit}) => {
  const frame = useCurrentFrame();
  
  const t = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  const speed = distance / durationInFrames;
  const ex = (100 + (speed * 5)) / 100;
  const followOffset = Math.ceil(durationInFrames * 0.08);
  
  const animatedProgress = interpolate(v5Pop(t), [0, 0.7, 1], [0, ex, 1]);

  let x = interpolate(animatedProgress, [0, 1], [from.x, to.x]);
  let y = interpolate(animatedProgress, [0, 1], [from.y, to.y]);
  let scaleX = interpolate(animatedProgress, [0, 1], [from.scale ?? 1, to.scale ?? 1]);
  let scaleY = scaleX;
  let rotate = interpolate(animatedProgress, [0, 1], [from.rotate ?? 0, to.rotate ?? 0]);
  
  let opacity = interpolate(t, [0, 0.1], [0, 1], {extrapolateLeft: 'clamp'});

  const blurX = getMotionBlur(frame, startFrame, durationInFrames, from.x, to.x);
  const blurY = getMotionBlur(frame, startFrame, durationInFrames, from.y, to.y);
  const blur = Math.max(blurX, blurY);

  if (principles?.squash || principles?.stretch) {
    const sq = (principles.squash ?? 95) / 100;
    const st = (principles.stretch ?? 105) / 100;
    scaleX *= interpolate(v5Pop(t), [0, 0.5, 1], [1, st, 1]);
    scaleY *= interpolate(v5Pop(t), [0, 0.5, 1], [1, sq, 1]);
  }

  if (t === 1 && frame < startFrame + durationInFrames + followOffset) {
    const followT = interpolate(frame, [startFrame + durationInFrames, startFrame + durationInFrames + followOffset], [0, 1]);
    const bounce = Math.sin(followT * Math.PI) * 0.01; 
    scaleX += bounce;
    scaleY += bounce;
  }

  if (exit && frame >= exit.startFrame) {
    const exitT = interpolate(frame, [exit.startFrame, exit.startFrame + exit.duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    if (exit.type === 'fade') {
      opacity *= (1 - exitT);
    } else if (exit.type === 'slide-left' || exit.type === 'slide-up' || exit.type === 'slide-down') {
      const exitToX = exit.to?.x ?? from.x;
      const exitToY = exit.to?.y ?? (exit.type === 'slide-up' ? -140 : 2070);
      x = interpolate(v5Pop(exitT), [0, 1], [to.x, exitToX]);
      y = interpolate(v5Pop(exitT), [0, 1], [to.y, exitToY]);
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `translate(-50%, -50%) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
        filter: blur > 1.5 ? `blur(${blur}px)` : 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Screen01: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: PYTHON_COMP_CONFIG.colors.bg}}>
      {/* Icon Hardway */}
      <KineticElement
        startFrame={10}
        durationInFrames={7}
        from={{x: 1230, y: 480, scale: 0.85}}
        to={{x: 540, y: 480, scale: 1}}
        exit={{type: 'fade', duration: 8, startFrame: 77}}
        principles={{squash: 97, stretch: 102}}
      >
        <HardHat color="#FFFFFF" size={200} />
      </KineticElement>

      {/* Icon Oneline */}
      <KineticElement
        startFrame={23}
        durationInFrames={7}
        from={{x: -150, y: 720, scale: 0.9}}
        to={{x: 540, y: 720, scale: 1}}
        exit={{type: 'slide-left', duration: 8, startFrame: 84, to: {x: -150, y: 720}}}
        principles={{squash: 96, stretch: 103}}
      >
        <Zap color={PYTHON_COMP_CONFIG.colors.brand} size={200} />
      </KineticElement>
    </AbsoluteFill>
  );
};

const Screen02: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: PYTHON_COMP_CONFIG.colors.bg}}>
      {/* Icon Loop */}
      <KineticElement
        startFrame={10}
        durationInFrames={8}
        from={{x: 1230, y: 760, scale: 0.9}}
        to={{x: 378, y: 760, scale: 1}}
        exit={{type: 'fade', duration: 6, startFrame: 90}}
        principles={{squash: 98, stretch: 101}}
      >
        <Repeat color="#FFFFFF" size={200} />
      </KineticElement>

      {/* Icon Brackets */}
      <KineticElement
        startFrame={15}
        durationInFrames={8}
        from={{x: -150, y: 960, scale: 0.9}}
        to={{x: 702, y: 960, scale: 1}}
        exit={{type: 'fade', duration: 6, startFrame: 95}}
        principles={{squash: 95, stretch: 104}}
      >
        <Code color="#FFFFFF" size={200} />
      </KineticElement>

      {/* Icon Check */}
      <KineticElement
        startFrame={108}
        durationInFrames={8}
        from={{x: 540, y: 2070, scale: 0.85}}
        to={{x: 540, y: 1120, scale: 1}}
        exit={{type: 'slide-up', duration: 8, startFrame: 161, to: {x: 540, y: -140}}}
        principles={{squash: 97, stretch: 102}}
      >
        <CheckCircle2 color={PYTHON_COMP_CONFIG.colors.brand} size={180} />
      </KineticElement>
    </AbsoluteFill>
  );
};

const Screen03: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: PYTHON_COMP_CONFIG.colors.bg}}>
      {/* Icon Lightning */}
      <KineticElement
        startFrame={10}
        durationInFrames={7}
        from={{x: 1230, y: 640, scale: 0.9}}
        to={{x: 540, y: 640, scale: 1}}
        exit={{type: 'fade', duration: 6, startFrame: 83}}
        principles={{squash: 96, stretch: 103}}
      >
        <Zap color={PYTHON_COMP_CONFIG.colors.brand} size={200} />
      </KineticElement>

      {/* Icon Edit */}
      <KineticElement
        startFrame={96}
        durationInFrames={7}
        from={{x: -150, y: 800, scale: 0.9}}
        to={{x: 540, y: 800, scale: 1}}
        exit={{type: 'slide-down', duration: 8, startFrame: 148, to: {x: 540, y: 2070}}}
        principles={{squash: 97, stretch: 102}}
      >
        <Pencil color="#FFFFFF" size={200} />
      </KineticElement>
    </AbsoluteFill>
  );
};

export const PythonListComp: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={96}><Screen01 /></Series.Sequence>
        <Series.Sequence durationInFrames={165}><Screen02 /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><Screen03 /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
