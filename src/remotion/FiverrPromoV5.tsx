import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import React from 'react';
import {FIVERR_PROMO_CONFIG} from './constants';

const Montserrat = 'Montserrat, sans-serif';

// Reusable Pop Easing from v5.0 spec: pop(0.16,1,0.3,1)
const v5Pop = (t: number) => Easing.bezier(0.16, 1, 0.3, 1)(t);

const KineticText: React.FC<{
  text: string;
  startFrame: number;
  durationInFrames: number;
  from: {x: number; y: number; scale?: number; blur?: number};
  to: {x: number; y: number; scale?: number};
  style?: React.CSSProperties;
  principles?: {squash?: number; stretch?: number; exaggerate?: number};
  exit?: {type: 'fade'; duration: number; startFrame: number};
}> = ({text, startFrame, durationInFrames, from, to, style, principles, exit}) => {
  const frame = useCurrentFrame();
  
  // Progress calculation
  const t = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Easing with exaggeration
  const ex = (principles?.exaggerate ?? 100) / 100;
  const animatedProgress = interpolate(v5Pop(t), [0, 0.7, 1], [0, ex, 1]);

  // Intermediate values
  let x = interpolate(animatedProgress, [0, 1], [from.x, to.x]);
  let y = interpolate(animatedProgress, [0, 1], [from.y, to.y]);
  let scaleX = interpolate(animatedProgress, [0, 1], [from.scale ?? 1, to.scale ?? 1]);
  let scaleY = scaleX;
  let opacity = interpolate(t, [0, 0.2], [0, 1], {extrapolateLeft: 'clamp'});
  let blur = interpolate(animatedProgress, [0, 1], [from.blur ?? 0, 0]);

  // Squash and Stretch
  if (principles?.squash || principles?.stretch) {
    const sq = (principles.squash ?? 100) / 100;
    const st = (principles.stretch ?? 100) / 100;
    scaleX *= interpolate(animatedProgress, [0, 0.5, 1], [1, st, 1]);
    scaleY *= interpolate(animatedProgress, [0, 0.5, 1], [1, sq, 1]);
  }

  // Exit Animation
  if (exit && frame >= exit.startFrame) {
    const exitT = interpolate(frame, [exit.startFrame, exit.startFrame + exit.duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    if (exit.type === 'fade') {
      opacity *= (1 - exitT);
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Helper for following screens
const interpolation = (v: number, from: number[], to: number[]) => interpolate(v, from, to);

const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame % 60, [0, 30, 60], [0.4, 0.8, 0.4]);
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        right: 40,
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 800,
        zIndex: 1000,
        opacity,
        fontFamily: Montserrat,
        pointerEvents: 'none'
      }}
    >
      fiverr®
    </div>
  );
};

const Screen01: React.FC = () => {
  const exitStart = 85 - 20;

  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      {/* want_to */}
      <KineticText
        text="WANT TO"
        startFrame={10}
        durationInFrames={11}
        from={{x: 1306, y: 560, scale: 3, blur: 12}}
        to={{x: 378, y: 560, scale: 1}}
        principles={{squash: 95, stretch: 105, exaggerate: 115}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 84, color: '#FFFFFF'}}
      />

      {/* increase */}
      <KineticText
        text="INCREASE"
        startFrame={21}
        durationInFrames={14}
        from={{x: -434, y: 800, blur: 20}}
        to={{x: 378, y: 800}}
        principles={{exaggerate: 125}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}}
      />

      {/* your_dark */}
      <KineticText
        text="YOUR"
        startFrame={35}
        durationInFrames={15}
        from={{x: 1230, y: 1040, blur: 8}}
        to={{x: 378, y: 1040}}
        principles={{exaggerate: 110}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 84, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />

      {/* sales */}
      <KineticText
        text="SALES"
        startFrame={39} // 1160+150ms stagger = frame 39
        durationInFrames={15}
        from={{x: 378, y: 2050, scale: 0.85, blur: 4}}
        to={{x: 378, y: 1280, scale: 1}}
        principles={{squash: 90, stretch: 110, exaggerate: 115}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}}
      />

      {/* exclamation */}
      <KineticText
        text="!"
        startFrame={65}
        durationInFrames={10}
        from={{x: 810, y: -130}}
        to={{x: 810, y: 1160}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{
          fontFamily: Montserrat,
          fontWeight: 800,
          fontSize: 240,
          WebkitTextStroke: `4px ${FIVERR_PROMO_CONFIG.colors.dark}`,
          color: 'transparent',
        }}
      />
    </AbsoluteFill>
  );
};

const Screen02: React.FC = () => {
  const exitStart = 90 - 20;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="NEED"
        startFrame={10}
        durationInFrames={18}
        from={{x: 1330, y: 640}}
        to={{x: 540, y: 640}}
        principles={{exaggerate: 115}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: '#FFFFFF'}}
      />
      <KineticText
        text="AN ANIMATED"
        startFrame={25}
        durationInFrames={18}
        from={{x: -400, y: 880}}
        to={{x: 540, y: 880}}
        principles={{exaggerate: 120}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 110, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />
      <KineticText
        text="VIDEO"
        startFrame={40}
        durationInFrames={18}
        from={{x: 540, y: 1560, scale: 0.5}}
        to={{x: 540, y: 1140, scale: 1}}
        principles={{exaggerate: 125, squash: 80, stretch: 120}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

const Screen03: React.FC = () => {
  const exitStart = 90 - 20;
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="UNIQUE"
        startFrame={5}
        durationInFrames={15}
        from={{x: 540, y: 700, scale: 0.8, blur: 6}}
        to={{x: 540, y: 700, scale: 1}}
        principles={{exaggerate: 110}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
      <KineticText
        text="TYPOGRAPHY"
        startFrame={20}
        durationInFrames={20}
        from={{x: 540, y: 400}}
        to={{x: 540, y: 860}}
        principles={{exaggerate: 115, squash: 80}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 120, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />
      <KineticText
        text="PACK FOR YOUR PROJECT"
        startFrame={40}
        durationInFrames={20}
        from={{x: 540, y: 1100, opacity: 0}}
        to={{x: 540, y: 1100}}
        exit={{type: 'fade', duration: 20, startFrame: exitStart}}
        style={{fontFamily: 'Inter', fontWeight: 500, fontSize: 48, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />
    </AbsoluteFill>
  );
};

const Screen04: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="KINETIC TYPO"
        startFrame={5}
        durationInFrames={15}
        from={{x: 1330, y: 800}}
        to={{x: 540, y: 800}}
        principles={{exaggerate: 115}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 120, color: '#FFFFFF'}}
      />
      <KineticText
        text="USED TO PROMOTE"
        startFrame={20}
        durationInFrames={15}
        from={{x: -330, y: 960}}
        to={{x: 540, y: 960}}
        principles={{exaggerate: 115}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 80, color: '#FFFFFF'}}
      />
      <KineticText
        text="YOUR BUSINESS"
        startFrame={35}
        durationInFrames={20}
        from={{x: 540, y: 1560, scale: 0.9}}
        to={{x: 540, y: 1160, scale: 1}}
        principles={{exaggerate: 120, squash: 90, stretch: 110}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 100, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />
    </AbsoluteFill>
  );
};

const Screen05: React.FC = () => {
  const frame = useCurrentFrame();
  const boxReveal = interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <div style={{
        position: 'absolute',
        left: 540,
        top: 960,
        width: interpolation(boxReveal, [0, 1], [0, 900]),
        height: 160,
        border: `4px solid ${FIVERR_PROMO_CONFIG.colors.dark}`,
        transform: 'translate(-50%, -50%)',
        opacity: boxReveal
      }} />
      <KineticText
        text="STYLISH ANIMATED"
        startFrame={30}
        durationInFrames={20}
        from={{x: 540, y: 920, opacity: 0}}
        to={{x: 540, y: 920}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 64, color: '#FFFFFF'}}
      />
      <KineticText
        text="TITLES PACK"
        startFrame={45}
        durationInFrames={20}
        from={{x: 540, y: 1000, opacity: 0}}
        to={{x: 540, y: 1000}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 64, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

// Screen 06
const Screen06: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.orange}}>
      <KineticText
        text="CUSTOM"
        startFrame={10}
        durationInFrames={20}
        from={{x: 540, y: 850, scale: 3, opacity: 0}}
        to={{x: 540, y: 850, scale: 1}}
        principles={{exaggerate: 120}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
      <KineticText
        text="COLORS"
        startFrame={30}
        durationInFrames={20}
        from={{x: 540, y: 1080, scale: 0, opacity: 0}}
        to={{x: 540, y: 1080, scale: 1}}
        principles={{exaggerate: 115, follow: 60}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

const Screen07: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.blue}}>
      <KineticText
        text="CUSTOM"
        startFrame={10}
        durationInFrames={20}
        from={{x: -300, y: 900}}
        to={{x: 540, y: 900}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}}
      />
      <KineticText
        text="FONTS"
        startFrame={25}
        durationInFrames={20}
        from={{x: 1380, y: 1100}}
        to={{x: 540, y: 1100}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 160, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

const Screen08: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.mustard}}>
      <KineticText
        text="FULL HD"
        startFrame={15}
        durationInFrames={25}
        from={{x: 540, y: 960, scale: 0.1, opacity: 0}}
        to={{x: 540, y: 960, scale: 1}}
        principles={{exaggerate: 130}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 240, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />
    </AbsoluteFill>
  );
};

const Screen09: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="YOUR SCRIPTS"
        startFrame={10}
        durationInFrames={20}
        from={{x: 540, y: 750, scale: 1.2, opacity: 0}}
        to={{x: 540, y: 750, scale: 1}}
        principles={{exaggerate: 115}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 120, color: '#FFFFFF'}}
      />
      <KineticText
        text="TURNED INTO"
        startFrame={30}
        durationInFrames={20}
        from={{x: 540, y: 960, opacity: 0}}
        to={{x: 540, y: 960}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 100, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />
      <KineticText
        text="AMAZING VIDEOS"
        startFrame={50}
        durationInFrames={20}
        from={{x: 540, y: 1180, scale: 0.8, opacity: 0}}
        to={{x: 540, y: 1180, scale: 1}}
        principles={{exaggerate: 125}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 120, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

const Screen10: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="EXCLUSIVELY"
        startFrame={15}
        durationInFrames={20}
        from={{x: -400, y: 880}}
        to={{x: 540, y: 880}}
        principles={{exaggerate: 115}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />
      <KineticText
        text="ON"
        startFrame={35}
        durationInFrames={20}
        from={{x: 1480, y: 1100}}
        to={{x: 540, y: 1100}}
        principles={{exaggerate: 115}}
        style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 140, color: FIVERR_PROMO_CONFIG.colors.dark}}
      />
    </AbsoluteFill>
  );
};

const Screen11: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{
          width: 400,
          height: 400,
          backgroundColor: FIVERR_PROMO_CONFIG.colors.dark,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{fontFamily: Montserrat, fontWeight: 800, fontSize: 80, color: '#FFFFFF'}}>fiverr®</h1>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import {Series} from 'remotion';

export const FiverrPromoV5: React.FC = () => {
  return (
    <AbsoluteFill>
      <Watermark />
      <Series>
        <Series.Sequence durationInFrames={85}><Screen01 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen02 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen03 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen04 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen05 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen06 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen07 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen08 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen09 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen10 /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Screen11 /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
