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
 * v5.3 Rule: Blur precisely matched to speed range
 */
const getMotionBlur = (frame: number, start: number, duration: number, fromVal: number, toVal: number) => {
  if (frame < start || frame > start + duration) return 0;
  
  const end = start + duration;
  const t = (frame - start) / duration;
  const nextT = (frame + 1 - start) / duration;
  
  // Use v5Pop for velocity calculation
  const pos = interpolate(v5Pop(t), [0, 1], [fromVal, toVal]);
  const nextPos = interpolate(v5Pop(nextT), [0, 1], [fromVal, toVal]);
  
  const velocity = Math.abs(nextPos - pos);
  return Math.min(velocity * 0.15, 40); // 0.15 scale factor for visible blur
};

const KineticText: React.FC<{
  text: string;
  startFrame: number;
  durationInFrames: number;
  from: {x: number; y: number; scale?: number};
  to: {x: number; y: number; scale?: number};
  style?: React.CSSProperties;
  principles?: {squash?: number; stretch?: number};
  exit?: {type: 'fade'; duration: number; startFrame: number};
}> = ({text, startFrame, durationInFrames, from, to, style, principles, exit}) => {
  const frame = useCurrentFrame();
  
  // Progress (0-1)
  const t = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3c SPEED calculation (px/frame)
  const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
  const speed = distance / durationInFrames;

  // Rule: exaggerate = 100 + speed * 5
  const exaggeratePercent = 100 + (speed * 5);
  const ex = exaggeratePercent / 100;

  // Rule: follow = duration * 0.08
  const followOffset = Math.ceil(durationInFrames * 0.08);
  
  // Animated progress with pop casing and exaggeration
  const animatedProgress = interpolate(v5Pop(t), [0, 0.7, 1], [0, ex, 1]);

  let x = interpolate(animatedProgress, [0, 1], [from.x, to.x]);
  let y = interpolate(animatedProgress, [0, 1], [from.y, to.y]);
  let scaleX = interpolate(animatedProgress, [0, 1], [from.scale ?? 1, to.scale ?? 1]);
  let scaleY = scaleX;
  
  // Fade in
  let opacity = interpolate(t, [0, 0.1], [0, 1], {extrapolateLeft: 'clamp'});

  // v5.3 Blur matched to speed range
  const blurX = getMotionBlur(frame, startFrame, durationInFrames, from.x, to.x);
  const blurY = getMotionBlur(frame, startFrame, durationInFrames, from.y, to.y);
  const blur = Math.max(blurX, blurY);

  // Squash/Stretch (Rule: squash=95% stretch=105% template)
  if (principles?.squash || principles?.stretch) {
    const sq = (principles.squash ?? 95) / 100;
    const st = (principles.stretch ?? 105) / 100;
    scaleX *= interpolate(v5Pop(t), [0, 0.5, 1], [1, st, 1]);
    scaleY *= interpolate(v5Pop(t), [0, 0.5, 1], [1, sq, 1]);
  }

  // Follow timing settlement (Rule: follow = duration * 0.08)
  if (t === 1 && frame < startFrame + durationInFrames + followOffset) {
    const followT = interpolate(frame, [startFrame + durationInFrames, startFrame + durationInFrames + followOffset], [0, 1]);
    const bounce = Math.sin(followT * Math.PI) * 0.01; 
    scaleX += bounce;
    scaleY += bounce;
  }

  // EXIT phase
  if (exit && frame >= exit.startFrame) {
    const exitT = interpolate(frame, [exit.startFrame, exit.startFrame + exit.duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    if (exit.type === 'fade') opacity *= (1 - exitT);
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `scale(${scaleX}, ${scaleY})`, // Anchor=left (no translate(-50%))
        filter: blur > 1.5 ? `blur(${blur}px)` : 'none',
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
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      {/* want_to: f10-f21 speed 2.51, exit f66-f75 (approx based on holding 1500ms) */}
      <KineticText text="WANT TO" startFrame={10} durationInFrames={11} from={{x: 1306, y: 560, scale: 1}} to={{x: 378, y: 560, scale: 1}} exit={{type: 'fade', duration: 10, startFrame: 73}} principles={{squash: 98, stretch: 102}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 84, color: '#FFFFFF'}} />
      
      {/* increase: Start=25f, Dur=14f, speed 1.77, exit f93-f103 */}
      <KineticText text="INCREASE" startFrame={25} durationInFrames={14} from={{x: -434, y: 800}} to={{x: 378, y: 800}} exit={{type: 'fade', duration: 10, startFrame: 93}} principles={{squash: 99, stretch: 101}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}} />
      
      {/* your: Start=44f, Dur=15f, speed 1.7, exit f115-f125 */}
      <KineticText text="YOUR" startFrame={44} durationInFrames={15} from={{x: 1230, y: 1040}} to={{x: 378, y: 1040}} exit={{type: 'fade', duration: 10, startFrame: 115}} principles={{squash: 98, stretch: 102}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 84, color: '#FFFFFF'}} />
      
      {/* sales: Start=64f, Dur=15f, speed 1.54, exit f137-f147 */}
      <KineticText text="SALES" startFrame={64} durationInFrames={15} from={{x: 378, y: 2050}} to={{x: 378, y: 1280}} exit={{type: 'fade', duration: 10, startFrame: 137}} principles={{squash: 99, stretch: 101}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}} />
      
      {/* exclamation: Start=83f, Dur=10f, speed 3.79, exit f153-f163 */}
      <KineticText text="!" startFrame={83} durationInFrames={10} from={{x: 810, y: -130}} to={{x: 810, y: 1160}} exit={{type: 'fade', duration: 10, startFrame: 153}} principles={{squash: 99, stretch: 101}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: FIVERR_PROMO_CONFIG.colors.brand}} />
    </AbsoluteFill>
  );
};

const Screen02: React.FC = () => {
  const exitStart = 80;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="NEED" startFrame={5} durationInFrames={18} from={{x: 1346, y: 600}} to={{x: 540, y: 600}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
      <KineticText text="AN" startFrame={28} durationInFrames={17} from={{x: -128, y: 720}} to={{x: 540, y: 720}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 130, color: '#FFFFFF'}} />
      <KineticText text="ANIMATED" startFrame={50} durationInFrames={17} from={{x: 1442, y: 840}} to={{x: 540, y: 840}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 130, color: '#FFFFFF'}} />
      <KineticText text="VIDEO" startFrame={72} durationInFrames={16} from={{x: -305, y: 960}} to={{x: 540, y: 960}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 170, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen03: React.FC = () => {
  const exitStart = 80;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="UNIQUE" startFrame={5} durationInFrames={15} from={{x: 1526, y: 600}} to={{x: 540, y: 600}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 220, color: '#FFFFFF'}} />
      <KineticText text="TYPOGRAPHY" startFrame={25} durationInFrames={20} from={{x: -500, y: 720}} to={{x: 540, y: 720}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 150, color: '#FFFFFF'}} />
      <KineticText text="PACK FOR YOUR" startFrame={50} durationInFrames={15} from={{x: 1442, y: 840}} to={{x: 540, y: 840}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 80, color: '#FFFFFF'}} />
      <KineticText text="PROJECT" startFrame={70} durationInFrames={10} from={{x: -449, y: 960}} to={{x: 540, y: 960}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 190, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen04: React.FC = () => {
  const exitStart = 80;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="KINETIC TYPO" startFrame={10} durationInFrames={20} from={{x: 1634, y: 600}} to={{x: 540, y: 600}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: '#FFFFFF'}} />
      <KineticText text="USED TO PROMOTE" startFrame={35} durationInFrames={17} from={{x: -638, y: 720}} to={{x: 540, y: 720}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: '#FFFFFF'}} />
      <KineticText text="YOUR BUSINESS" startFrame={57} durationInFrames={20} from={{x: 1598, y: 840}} to={{x: 540, y: 840}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 120, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen05: React.FC = () => {
  const frame = useCurrentFrame();
  const boxReveal = interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exitT = interpolate(frame, [80, 90], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand, opacity: 1 - exitT}}>
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
      
      <KineticText text="TITLES ANIMATION" startFrame={15} durationInFrames={15} from={{x: 1374, y: 920}} to={{x: 540, y: 920}} principles={{squash: 90}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 48, color: '#FFFFFF'}} />
      <KineticText text="STYLISH ANIMATED TITLES" startFrame={35} durationInFrames={20} from={{x: -546, y: 1000}} to={{x: 540, y: 1000}} principles={{stretch: 110}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 72, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen06: React.FC = () => {
  const exitStart = 80;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.orange}}>
      <KineticText text="CUSTOM" startFrame={10} durationInFrames={20} from={{x: 540, y: 850, scale: 3}} to={{x: 540, y: 850, scale: 1}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} principles={{squash: 80}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
      <KineticText text="COLORS" startFrame={35} durationInFrames={20} from={{x: 1400, y: 1080}} to={{x: 540, y: 1080}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen07: React.FC = () => {
  const exitStart = 80;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.blue}}>
      <KineticText text="CUSTOM" startFrame={10} durationInFrames={15} from={{x: -300, y: 900}} to={{x: 540, y: 900}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} principles={{stretch: 120}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}} />
      <KineticText text="FONTS" startFrame={30} durationInFrames={15} from={{x: 1380, y: 1100}} to={{x: 540, y: 1100}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} principles={{stretch: 120}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen08: React.FC = () => {
  const exitStart = 80;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.mustard}}>
      <KineticText text="FULL HD" startFrame={15} durationInFrames={25} from={{x: 540, y: 960, scale: 0.1}} to={{x: 540, y: 960, scale: 1}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} principles={{squash: 70, stretch: 130}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 240, color: FIVERR_PROMO_CONFIG.colors.dark}} />
    </AbsoluteFill>
  );
};

const Screen09: React.FC = () => {
  const exitStart = 80;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="YOUR SCRIPTS" startFrame={5} durationInFrames={15} from={{x: 540, y: 750, scale: 1.5}} to={{x: 540, y: 750, scale: 1}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 120, color: '#FFFFFF'}} />
      <KineticText text="TURNED INTO" startFrame={25} durationInFrames={15} from={{x: -400, y: 960}} to={{x: 540, y: 960}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 100, color: FIVERR_PROMO_CONFIG.colors.dark}} />
      <KineticText text="AMAZING VIDEOS" startFrame={45} durationInFrames={20} from={{x: 540, y: 1180, scale: 0.5}} to={{x: 540, y: 1180, scale: 1}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} principles={{squash: 80, stretch: 120}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 120, color: '#FFFFFF'}} />
    </AbsoluteFill>
  );
};

const Screen10: React.FC = () => {
  const exitStart = 80;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText text="EXCLUSIVELY" startFrame={10} durationInFrames={15} from={{x: -400, y: 880}} to={{x: 540, y: 880}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: FIVERR_PROMO_CONFIG.colors.dark}} />
      <KineticText text="ON" startFrame={30} durationInFrames={15} from={{x: 1480, y: 1100}} to={{x: 540, y: 1100}} exit={{type: 'fade', duration: 10, startFrame: exitStart}} style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: FIVERR_PROMO_CONFIG.colors.dark}} />
    </AbsoluteFill>
  );
};

const Screen11: React.FC = () => {
  const frame = useCurrentFrame();
  const exitT = interpolate(frame, [90, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand, opacity: 1 - exitT}}>
      <div style={{
        position: 'absolute',
        left: 540,
        top: 960,
        width: 400,
        height: 400,
        backgroundColor: FIVERR_PROMO_CONFIG.colors.dark,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        transform: 'translate(-50%, -50%)',
      }}>
        <h1 style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 80, color: '#FFFFFF'}}>fiverr®</h1>
      </div>
    </AbsoluteFill>
  );
};

export const FiverrPromoV5: React.FC = () => {
  return (
    <AbsoluteFill>
      <Watermark />
      <Series>
        <Series.Sequence durationInFrames={150}><Screen01 /></Series.Sequence>
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
