import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
  Series,
} from 'remotion';
import React from 'react';
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

const KineticText: React.FC<{
  text: string;
  startFrame: number;
  durationInFrames: number;
  from: {x: number; y: number; scale?: number; rotate?: number};
  to: {x: number; y: number; scale?: number; rotate?: number};
  style?: React.CSSProperties;
  principles?: {squash?: number; stretch?: number};
  exit?: {type: 'fade' | 'slide-left' | 'slide-up' | 'slide-down'; duration: number; startFrame: number; to?: {x: number; y: number}};
}> = ({text, startFrame, durationInFrames, from, to, style, principles, exit}) => {
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
      const exitToY = exit.to?.y ?? (exit.type === 'slide-up' ? -100 : 2000);
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
      {text}
    </div>
  );
};

const Screen01: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: PYTHON_COMP_CONFIG.colors.bg}}>
      <KineticText 
        text="loops the HARD way 😬" 
        startFrame={10} 
        durationInFrames={8} 
        from={{x: 1659, y: 480, scale: 0.9}} 
        to={{x: 540, y: 480, scale: 1}} 
        exit={{type: 'fade', duration: 9, startFrame: 78}}
        principles={{squash: 96, stretch: 103}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 84, color: '#FFFFFF'}} 
      />
      <KineticText 
        text="Python List Comprehensions" 
        startFrame={23} 
        durationInFrames={8} 
        from={{x: -386, y: 640, scale: 0.95}} 
        to={{x: 540, y: 640, scale: 1}} 
        exit={{type: 'slide-left', duration: 9, startFrame: 85, to: {x: -386, y: 640}}}
        principles={{squash: 97, stretch: 102}}
        style={{fontFamily: Inter, fontWeight: 500, fontSize: 56, color: PYTHON_COMP_CONFIG.colors.brand}} 
      />
    </AbsoluteFill>
  );
};

const Screen02: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: PYTHON_COMP_CONFIG.colors.bg}}>
      <KineticText 
        text="for loop → append" 
        startFrame={10} 
        durationInFrames={9} 
        from={{x: 1361, y: 800}} 
        to={{x: 378, y: 800}} 
        exit={{type: 'fade', duration: 8, startFrame: 90}}
        principles={{squash: 98, stretch: 101}}
        style={{fontFamily: Inter, fontWeight: 500, fontSize: 48, color: '#FFFFFF'}} 
      />
      <KineticText 
        text="[x for x in list]" 
        startFrame={15} 
        durationInFrames={10} 
        from={{x: -482, y: 960}} 
        to={{x: 702, y: 960}} 
        exit={{type: 'fade', duration: 8, startFrame: 96}}
        principles={{squash: 96, stretch: 103}}
        style={{fontFamily: Inter, fontWeight: 500, fontSize: 48, color: PYTHON_COMP_CONFIG.colors.brand}} 
      />
      <KineticText 
        text="✅ Same output. Less code." 
        startFrame={108} 
        durationInFrames={8} 
        from={{x: 540, y: 2002}} 
        to={{x: 540, y: 1120}} 
        exit={{type: 'slide-up', duration: 9, startFrame: 165, to: {x: 540, y: -82}}}
        principles={{squash: 97, stretch: 102}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 64, color: '#FFFFFF'}} 
      />
    </AbsoluteFill>
  );
};

const Screen03: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: PYTHON_COMP_CONFIG.colors.bg}}>
      <KineticText 
        text="PRO TIP: Readability first" 
        startFrame={10} 
        durationInFrames={7} 
        from={{x: 1616, y: 640}} 
        to={{x: 540, y: 640}} 
        exit={{type: 'fade', duration: 8, startFrame: 84}}
        principles={{squash: 95, stretch: 104}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 60, color: '#FFFFFF'}} 
      />
      <KineticText 
        text="Try it → rewrite your loop" 
        startFrame={96} 
        durationInFrames={8} 
        from={{x: -470, y: 800}} 
        to={{x: 540, y: 800}} 
        exit={{type: 'slide-down', duration: 9, startFrame: 156, to: {x: 540, y: 2002}}}
        principles={{squash: 96, stretch: 103}}
        style={{fontFamily: Inter, fontWeight: 500, fontSize: 56, color: PYTHON_COMP_CONFIG.colors.brand}} 
      />
    </AbsoluteFill>
  );
};

export const PythonListComp: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={105}><Screen01 /></Series.Sequence>
        <Series.Sequence durationInFrames={180}><Screen02 /></Series.Sequence>
        <Series.Sequence durationInFrames={165}><Screen03 /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
