import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  Series,
} from 'remotion';
import React from 'react';
import {FIVERR_PROMO_CONFIG} from './constants';

const Montserrat = 'Montserrat, sans-serif';

// Validated pop easing as per v5.1
const v5Pop = (t: number) => Easing.bezier(0.16, 1, 0.3, 1)(t);

/**
 * Calculates current blur based on instantaneous velocity (delta between frames)
 * v5.1 Rule: Blur matched to velocity
 */
const getMotionBlur = (frame: number, start: number, end: number, fromVal: number, toVal: number, scaleBlur: number = 0.05) => {
  if (frame < start || frame > end) return 0;
  const t = (frame - start) / (end - start);
  const nextT = (frame + 1 - start) / (end - start);
  
  const pos = interpolate(v5Pop(t), [0, 1], [fromVal, toVal]);
  const nextPos = interpolate(v5Pop(nextT), [0, 1], [fromVal, toVal]);
  
  const velocity = Math.abs(nextPos - pos);
  return Math.min(velocity * scaleBlur, 25); // Cap at 25px
};

const KineticText: React.FC<{
  text: string;
  startFrame: number;
  durationInFrames: number;
  from: {x: number; y: number; scale?: number};
  to: {x: number; y: number; scale?: number};
  style?: React.CSSProperties;
  principles?: {squash?: number; stretch?: number; exaggerate?: number};
  exit?: {type: 'fade'; duration: number; startFrame: number};
}> = ({text, startFrame, durationInFrames, from, to, style, principles, exit}) => {
  const frame = useCurrentFrame();
  
  const t = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ex = (principles?.exaggerate ?? 115) / 100;
  const animatedProgress = interpolate(v5Pop(t), [0, 0.7, 1], [0, ex, 1]);

  let x = interpolate(animatedProgress, [0, 1], [from.x, to.x]);
  let y = interpolate(animatedProgress, [0, 1], [from.y, to.y]);
  let scaleX = interpolate(animatedProgress, [0, 1], [from.scale ?? 1, to.scale ?? 1]);
  let scaleY = scaleX;
  let opacity = interpolate(t, [0, 0.1], [0, 1], {extrapolateLeft: 'clamp'});

  // Motion Blur Projection
  const blurX = getMotionBlur(frame, startFrame, startFrame + durationInFrames, from.x, to.x, 0.08);
  const blurY = getMotionBlur(frame, startFrame, startFrame + durationInFrames, from.y, to.y, 0.08);
  const blur = Math.max(blurX, blurY);

  // Squash/Stretch (volume preservation check)
  if (principles?.squash || principles?.stretch) {
    const sq = (principles.squash ?? 95) / 100;
    const st = (principles.stretch ?? 105) / 100;
    scaleX *= interpolate(animatedProgress, [0, 0.5, 1], [1, st, 1]);
    scaleY *= interpolate(animatedProgress, [0, 0.5, 1], [1, sq, 1]);
  }

  if (exit && frame >= exit.startFrame) {
    const exitT = interpolate(frame, [exit.startFrame, exit.startFrame + exit.duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    if (exit.type === 'fade') opacity *= (1 - exitT);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`,
        filter: blur > 1 ? `blur(${blur}px)` : 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 60, [0, 30, 60], [0.4, 0.8, 0.4]);
  return (
    <div style={{
      position: 'absolute', top: 40, right: 40, color: '#FFFFFF', fontSize: 24, fontWeight: 800,
      zIndex: 1000, opacity, fontFamily: Montserrat, pointerEvents: 'none'
    }}> fiverr® </div>
  );
};

const Screen01: React.FC = () => {
  const exitStart = 90 - 10;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="WANT TO" startFrame={10} durationInFrames={11} from={{x: 1306, y: 560, scale: 3}} to={{x: 378, y: 560, scale: 1}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 84, color: '#FFFFFF'}} />
      <KineticText text="INCREASE" startFrame={21} durationInFrames={14} from={{x: -434, y: 800}} to={{x: 378, y: 800}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}} />
      <KineticText text="YOUR" startFrame={35} durationInFrames={15} from={{x: 1230, y: 1040}} to={{x: 378, y: 1040}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 84, color: FIVERR_PROMO_CONFIG.colors.dark}} />
      <KineticText text="SALES" startFrame={39} durationInFrames={15} from={{x: 378, y: 2050}} to={{x: 378, y: 1280}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} principles={{squash: 90, stretch: 110}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}} />
      <KineticText text="!" startFrame={65} durationInFrames={10} from={{x: 810, y: -130}} to={{x: 810, y: 1160}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen02: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="NEED" startFrame={10} durationInFrames={18} from={{x: 1346, y: 600}} to={{x: 540, y: 600}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
      <KineticText text="AN" startFrame={25} durationInFrames={17} from={{x: -128, y: 720}} to={{x: 540, y: 720}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 130, color: '#FFFFFF'}} />
      <KineticText text="ANIMATED" startFrame={25} durationInFrames={17} from={{x: 1442, y: 840}} to={{x: 540, y: 840}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 130, color: '#FFFFFF'}} />
      <KineticText text="VIDEO" startFrame={40} durationInFrames={16} from={{x: -305, y: 960}} to={{x: 540, y: 960}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 170, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen03: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="UNIQUE" startFrame={0} durationInFrames={15} from={{x: 1526, y: 600}} to={{x: 540, y: 600}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 220, color: '#FFFFFF'}} />
      <KineticText text="TYPOGRAPHY" startFrame={15} durationInFrames={20} from={{x: -500, y: 720}} to={{x: 540, y: 720}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 150, color: '#FFFFFF'}} />
      <KineticText text="PACK FOR YOUR" startFrame={35} durationInFrames={20} from={{x: 1442, y: 840}} to={{x: 540, y: 840}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 80, color: '#FFFFFF'}} />
      <KineticText text="PROJECT" startFrame={55} durationInFrames={15} from={{x: -449, y: 960}} to={{x: 540, y: 960}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 190, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen04: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="KINETIC TYPO" startFrame={0} durationInFrames={1} from={{x: 1634, y: 600}} to={{x: 540, y: 600}} principles={{exaggerate: 115}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: '#FFFFFF'}} />
      <KineticText text="USED TO PROMOTE" startFrame={18} durationInFrames={17} from={{x: -638, y: 720}} to={{x: 540, y: 720}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: '#FFFFFF'}} />
      <KineticText text="YOUR BUSINESS" startFrame={35} durationInFrames={28} from={{x: 1598, y: 840}} to={{x: 540, y: 840}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 120, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen05: React.FC = () => {
  const frame = useCurrentFrame();
  const boxReveal = interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      {/* Rectangular stroke reveal */}
      <div style={{
        position: 'absolute',
        left: 540,
        top: 960,
        width: interpolate(boxReveal, [0, 1], [0, 900]),
        height: 180,
        border: `6px solid ${FIVERR_PROMO_CONFIG.colors.dark}`,
        transform: 'translate(-50%, -50%)',
        opacity: boxReveal,
      }} />
      
      <KineticText text="TITLES ANIMATION" startFrame={10} durationInFrames={22} from={{x: 1374, y: 920}} to={{x: 540, y: 920}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 48, color: '#FFFFFF'}} />
      <KineticText text="STYLISH ANIMATED TITLES" startFrame={30} durationInFrames={39} from={{x: -546, y: 1000}} to={{x: 540, y: 1000}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 72, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen06: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.orange}}>
      <KineticText text="CUSTOM" startFrame={10} durationInFrames={23} from={{x: 1454, y: 600}} to={{x: 540, y: 600}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
      <KineticText text="COLORS" startFrame={33} durationInFrames={23} from={{x: -374, y: 720}} to={{x: 540, y: 720}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen07: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.blue}}>
      <KineticText text="CUSTOM FONTS" startFrame={10} durationInFrames={22} from={{x: 1778, y: 600}} to={{x: 540, y: 600}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen08: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.mustard}}>
      <KineticText text="FULL HD" startFrame={10} durationInFrames={23} from={{x: 1592, y: 600}} to={{x: 540, y: 600}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 220, color: FIVERR_PROMO_CONFIG.colors.dark}} />
    </AbsoluteFill>
  );
};

const Screen09: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="YOUR SCRIPTS" startFrame={10} durationInFrames={26} from={{x: 1778, y: 600}} to={{x: 540, y: 600}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
      <KineticText text="TURNED" startFrame={36} durationInFrames={23} from={{x: -302, y: 720}} to={{x: 540, y: 720}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: '#FFFFFF'}} />
      <KineticText text="AMAZING VIDEOS" startFrame={59} durationInFrames={23} from={{x: 1886, y: 840}} to={{x: 540, y: 840}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen10: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="EXCLUSIVELY" startFrame={10} durationInFrames={23} from={{x: 1658, y: 600}} to={{x: 540, y: 600}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}} />
      <KineticText text="ON" startFrame={33} durationInFrames={23} from={{x: -134, y: 720}} to={{x: 540, y: 720}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen11: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="fiverr®" startFrame={10} durationInFrames={10} from={{x: 1245, y: 600}} to={{x: 540, y: 600}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 64, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

export const FiverrPromoV5: React.FC = () => {
  return (
    <AbsoluteFill>
      <Watermark />
      <Series>
        <Series.Sequence durationInFrames={90}><Screen01 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen02 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen03 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen04 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen05 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen06 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen07 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen08 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen09 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen10 /></Series.Sequence>
        <Series.Sequence durationInFrames={100}><Screen11 /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
