import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
  Series,
} from 'remotion';
import {FIVERR_PROMO_CONFIG} from './constants';
import React, {useMemo} from 'react';

// --- HELPERS ---

const Watermark: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        right: 40,
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 800,
        zIndex: 100,
        opacity: 0.9,
        fontFamily: 'Montserrat',
      }}
    >
      fiverr®
    </div>
  );
};

interface AnimationPrinciples {
  squash?: number; // percentage, e.g. 95
  stretch?: number; // percentage, e.g. 105
  anticipate?: number; // ms
  follow?: number; // ms
  exaggerate?: number; // percentage, e.g. 115
  arc?: 'straight' | 'curve';
}

const v4Pop = (t: number, exaggerate: number = 115) => {
  const ex = exaggerate / 100;
  return interpolate(t, [0, 0.7, 1], [0, ex, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
};

const KineticText: React.FC<{
  text: string;
  startFrame: number;
  durationInFrames: number;
  from?: {x?: number; y?: number; scale?: number; opacity?: number; blur?: number; rotate?: number};
  to?: {x?: number; y?: number; scale?: number; opacity?: number; blur?: number; rotate?: number};
  style?: React.CSSProperties;
  easing?: (t: number) => number;
  principles?: AnimationPrinciples;
  exit?: {
    type: 'zoom-out' | 'rotate' | 'fade' | 'slide-up' | 'slide-down' | 'none';
    duration: number;
    startFrame: number;
  };
}> = ({text, startFrame, durationInFrames, from, to, style, easing, principles, exit}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Entrance
  const t = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const animatedProgress = easing ? easing(t) : v4Pop(t, principles?.exaggerate);

  // Exit
  let exitProgress = 0;
  if (exit && frame >= exit.startFrame) {
    exitProgress = interpolate(frame, [exit.startFrame, exit.startFrame + exit.duration], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }

  // Values
  const startX = from?.x ?? 540;
  const endX = to?.x ?? 540;
  const startY = from?.y ?? 960;
  const endY = to?.y ?? 960;
  
  let x = interpolate(animatedProgress, [0, 1], [startX, endX]);
  let y = interpolate(animatedProgress, [0, 1], [startY, endY]);
  
  let opacity = interpolate(animatedProgress, [0, 0.2, 1], [from?.opacity ?? 0, 1, 1]);
  let blur = interpolate(animatedProgress, [0, 1], [from?.blur ?? 0, 0]);
  let scaleX = interpolate(animatedProgress, [0, 1], [from?.scale ?? 1, 1]);
  let scaleY = scaleX;
  let rotate = interpolate(animatedProgress, [0, 1], [from?.rotate ?? 0, to?.rotate ?? from?.rotate ?? 0]);

  // Apply Principles: Squash and Stretch
  if (principles?.squash || principles?.stretch) {
    const sq = (principles.squash ?? 100) / 100;
    const st = (principles.stretch ?? 100) / 100;
    // Simple squash/stretch during arrival
    scaleX *= interpolate(animatedProgress, [0, 0.5, 1], [1, st, 1]);
    scaleY *= interpolate(animatedProgress, [0, 0.5, 1], [1, sq, 1]);
  }

  // Handle Exit animations
  if (exitProgress > 0) {
    if (exit?.type === 'zoom-out') {
      const exitScale = interpolate(exitProgress, [0, 1], [1, 0.5]);
      scaleX *= exitScale;
      scaleY *= exitScale;
      opacity *= (1 - exitProgress);
    } else if (exit?.type === 'rotate') {
      rotate += interpolate(exitProgress, [0, 1], [0, -90]);
      opacity *= (1 - exitProgress * 0.3); // End opacity 70% per script
    } else if (exit?.type === 'fade') {
      opacity *= (1 - exitProgress);
    } else if (exit?.type === 'slide-up') {
      y -= exitProgress * 50;
      opacity = interpolate(exitProgress, [0, 1], [1, 0.4]);
    } else if (exit?.type === 'slide-down') {
      y += exitProgress * 50;
      opacity = interpolate(exitProgress, [0, 1], [1, 0.4]);
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
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// --- SCREENS ---

const Screen01: React.FC = () => {
  const frame = useCurrentFrame();
  const exitStart = 85 - 20;

  return (
    <AbsoluteFill style={{backgroundColor: '#FFD000'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.15) 100%)'}} />
      
      <KineticText
        text="WANT TO"
        startFrame={10}
        durationInFrames={11}
        from={{x: 1188, y: 576, scale: 3, blur: 12}}
        to={{x: 702, y: 576, scale: 1}}
        principles={{stretch: 300, squash: 0, exaggerate: 115}}
        exit={{type: 'rotate', duration: 20, startFrame: exitStart}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 84, color: '#FFFFFF'}}
      />
      
      <KineticText
        text="INCREASE"
        startFrame={21}
        durationInFrames={14}
        from={{x: -200, y: 922, blur: 20}}
        to={{x: 702, y: 922}}
        principles={{exaggerate: 125}}
        exit={{type: 'rotate', duration: 20, startFrame: exitStart}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 210, color: '#FFFFFF'}}
      />
      
      <KineticText
        text="YOUR"
        startFrame={35}
        durationInFrames={15}
        from={{x: 1188, y: 1306, blur: 8}}
        to={{x: 702, y: 1306}}
        principles={{exaggerate: 110}}
        exit={{type: 'rotate', duration: 20, startFrame: exitStart}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 84, color: '#1E2226'}}
      />
      
      <KineticText
        text="SALES"
        startFrame={35}
        durationInFrames={30}
        from={{y: 1500, scale: 0.85, blur: 4}}
        to={{y: 1306, scale: 1}}
        principles={{squash: 95, stretch: 105, exaggerate: 115}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 210, color: '#FFFFFF'}}
        exit={{type: 'rotate', duration: 20, startFrame: exitStart}}
      />

      {/* Exclamation */}
      {frame >= 65 && (
        <KineticText
          text="!"
          startFrame={65}
          durationInFrames={10}
          from={{scale: 0}}
          to={{scale: 1}}
          style={{
            x: 972, y: 1100,
            fontFamily: 'Montserrat',
            fontWeight: 800,
            fontSize: 240,
            WebkitTextStroke: '4px #1E2226',
            color: 'transparent'
          }}
          exit={{type: 'rotate', duration: 20, startFrame: exitStart}}
        />
      )}
    </AbsoluteFill>
  );
};

const Screen02: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#FFD000'}}>
      <KineticText
        text="NEED"
        startFrame={22}
        durationInFrames={18}
        from={{scale: 1.1}}
        to={{scale: 1}}
        principles={{exaggerate: 110}}
        style={{x: 756, y: 672, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
      <KineticText
        text="AN"
        startFrame={40}
        durationInFrames={17}
        from={{x: -200, y: 960, blur: 15}}
        to={{x: 432, y: 960}}
        principles={{exaggerate: 120}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 130, color: '#FFFFFF'}}
      />
      <KineticText
        text="ANIMATED"
        startFrame={40}
        durationInFrames={17}
        from={{x: 1280, y: 960, blur: 15}}
        to={{x: 648, y: 960}}
        principles={{exaggerate: 120}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 130, color: '#1E2228'}}
      />
      <KineticText
        text="VIDEO"
        startFrame={57}
        durationInFrames={16}
        easing={t => t} // Linear typing simulation
        style={{
          x: 540,
          y: 1152,
          fontFamily: 'Montserrat',
          fontWeight: 800,
          fontSize: 170,
          color: '#FFFFFF',
          letterSpacing: 50
        }}
      />
    </AbsoluteFill>
  );
};

const Screen03: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const circles = useMemo(() => {
    return Array.from({length: 8}).map((_, i) => ({
      id: i,
      x: 200 + Math.random() * (width - 400),
      y: 1500 + Math.random() * 400,
      size: 10 + Math.random() * 30,
      isOutline: Math.random() > 0.5,
    }));
  }, [width]);

  const exitStart = 96 - 26;

  return (
    <AbsoluteFill style={{backgroundColor: '#FFD000'}}>
      <KineticText
        text="UNIQUE"
        startFrame={0}
        durationInFrames={15}
        from={{scale: 0.8, blur: 6}}
        to={{scale: 1}}
        principles={{exaggerate: 110}}
        exit={{type: 'zoom-in', duration: 26, startFrame: exitStart}}
        style={{x: 540, y: 700, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 220, color: '#FFFFFF'}}
      />
      <KineticText
        text="TYPOGRAPHY"
        startFrame={15}
        durationInFrames={20}
        from={{y: 400}}
        to={{y: 860}}
        principles={{squash: 80, stretch: 100, exaggerate: 115, anticipate: 50}}
        exit={{type: 'zoom-in', duration: 26, startFrame: exitStart}}
        style={{x: 540, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 150, color: '#1E2226'}}
      />
      <KineticText
        text="PACK FOR YOUR"
        startFrame={35}
        durationInFrames={20}
        from={{opacity: 0}}
        to={{opacity: 1}}
        exit={{type: 'zoom-in', duration: 26, startFrame: exitStart}}
        style={{x: 540, y: 1000, fontFamily: 'Inter', fontWeight: 500, fontSize: 80, color: '#1E2226'}}
      />
      <KineticText
        text="PROJECT"
        startFrame={55}
        durationInFrames={15}
        from={{x: 1300, y: 1150, blur: 18}}
        to={{x: 540, y: 1150}}
        principles={{exaggerate: 120}}
        exit={{type: 'zoom-in', duration: 26, startFrame: exitStart}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 190, color: '#FFFFFF'}}
      />

      {/* Ambient Circles Screen 3 */}
      {circles.map(c => {
        const t = interpolate(frame, [35, 96], [0, 1], {extrapolateLeft: 'clamp'});
        const drift = t * -200;
        const opacity = interpolate(t, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0]);
        return (
          <div key={c.id} style={{
            position: 'absolute',
            left: c.x,
            top: c.y + drift,
            width: c.size,
            height: c.size,
            borderRadius: '50%',
            backgroundColor: c.isOutline ? 'transparent' : '#FFFFFF',
            border: c.isOutline ? '2px solid #FFFFFF' : 'none',
            opacity,
            zIndex: 29
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Screen04: React.FC = () => {
  const frame = useCurrentFrame();
  const circles = useMemo(() => {
    return Array.from({length: 14}).map((_, i) => ({
      id: i,
      x: 800 + Math.random() * 280,
      y: 1600 + Math.random() * 320,
      size: 20,
      isOutline: Math.random() > 0.5,
      speed: 1 + Math.random() * 2,
    }));
  }, []);

  return (
    <AbsoluteFill style={{backgroundColor: '#FFD000'}}>
      <KineticText
        text="KINETIC TYPO"
        startFrame={0}
        durationInFrames={1}
        style={{x: 324, y: 864, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 130, color: '#FFFFFF'}}
      />
      <KineticText
        text="USED TO PROMOTE"
        startFrame={18}
        durationInFrames={17}
        from={{x: 1300, y: 864, blur: 20}}
        to={{x: 700, y: 864}}
        principles={{exaggerate: 115}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 130, color: '#FFFFFF'}}
      />
      <KineticText
        text="YOUR"
        startFrame={35}
        durationInFrames={9}
        from={{y: 1400, rotate: 15}}
        to={{y: 1050, rotate: 0}}
        principles={{exaggerate: 110}}
        style={{x: 400, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 120, color: '#1E2226'}}
      />
      <KineticText
        text="BUSINESS"
        startFrame={44}
        durationInFrames={16}
        from={{y: 1400, rotate: 15}}
        to={{y: 1050, rotate: 0}}
        principles={{exaggerate: 115, follow: 60}}
        style={{x: 750, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 120, color: '#FFFFFF', letterSpacing: 20}}
      />

      {/* Screen 4 Circles */}
      {circles.map(c => {
        const driftT = interpolate(frame, [60, 102], [0, 1], {extrapolateLeft: 'clamp'});
        const y = c.y - driftT * 1300 * (c.speed / 2);
        const x = c.x - driftT * 200;
        const opacity = interpolate(driftT, [0, 0.1, 0.9, 1], [0, 0.6, 0.6, 0]);
        return (
          <div key={c.id} style={{
            position: 'absolute',
            left: x,
            top: y,
            width: c.size,
            height: c.size,
            borderRadius: '50%',
            backgroundColor: c.isOutline ? 'transparent' : '#FFFFFF',
            border: c.isOutline ? '2px solid #FFFFFF' : 'none',
            opacity,
            zIndex: 39
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Screen05: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{backgroundColor: '#FFD000'}}>
      <div style={{
        position: 'absolute',
        left: 540,
        top: 1000,
        width: 800,
        height: 120,
        border: '4px solid #1E2226',
        transform: `translate(-50%, -50%) scaleX(${interpolate(frame, [5, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
        transformOrigin: 'center'
      }} />
      <KineticText
        text="TITLES ANIMATION GRAPHIC PACK"
        startFrame={14}
        durationInFrames={9}
        from={{opacity: 0}}
        to={{opacity: 1}}
        style={{x: 540, y: 920, fontFamily: 'Inter', fontWeight: 500, fontSize: 40, color: '#1E2226', letterSpacing: 4}}
      />
      <KineticText
        text="STYLISH ANIMATED TITLES"
        startFrame={25}
        durationInFrames={35}
        easing={t => t}
        style={{x: 540, y: 1000, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 64, color: '#FFFFFF'}}
      />
      {/* Pulse line */}
      <div style={{
        position: 'absolute',
        left: 540,
        top: 1080,
        width: 800,
        height: 2,
        backgroundColor: '#FFFFFF',
        opacity: interpolate(frame % 30, [0, 15, 30], [1, 0.6, 1]),
        transform: 'translateX(-50%)'
      }} />
    </AbsoluteFill>
  );
};

const Screen06: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#E07A4F'}}>
      <KineticText
        text="CUSTOM"
        startFrame={14}
        durationInFrames={21}
        from={{opacity: 0}}
        to={{opacity: 1}}
        style={{x: 540, y: 850, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
      <KineticText
        text="COLORS"
        startFrame={35}
        durationInFrames={21}
        from={{scale: 1.2, opacity: 0}}
        to={{scale: 1, opacity: 1}}
        principles={{exaggerate: 115, follow: 117}}
        style={{x: 540, y: 1050, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF', letterSpacing: 20}}
      />
    </AbsoluteFill>
  );
};

const Screen07: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#6A9BC1'}}>
      <KineticText
        text="CUSTOM FONTS"
        startFrame={15}
        durationInFrames={20}
        from={{scale: 3, blur: 30, opacity: 0}}
        to={{scale: 1, blur: 0, opacity: 1}}
        principles={{exaggerate: 125}}
        style={{x: 540, y: 960, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

const Screen08: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#DDB34A'}}>
      <KineticText
        text="FULL HD"
        startFrame={10}
        durationInFrames={21}
        from={{scale: 1.5, opacity: 0}}
        to={{scale: 1, opacity: 1}}
        principles={{exaggerate: 120}}
        style={{x: 540, y: 960, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 220, color: '#1E2226'}}
      />
    </AbsoluteFill>
  );
};

const Screen09: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{backgroundColor: '#FFD000'}}>
      <KineticText
        text="YOUR"
        startFrame={5}
        durationInFrames={9}
        from={{opacity: 0}}
        to={{opacity: 1}}
        exit={{type: 'slide-up', duration: 15, startFrame: 65}}
        style={{x: 540, y: 750, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 100, color: '#FFFFFF'}}
      />
      <KineticText
        text="SCRIPTS"
        startFrame={14}
        durationInFrames={15}
        from={{scale: 1.2, opacity: 0}}
        to={{scale: 1, opacity: 1}}
        principles={{exaggerate: 115}}
        exit={{type: 'slide-down', duration: 15, startFrame: 65}}
        style={{x: 540, y: 950, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF', textShadow: '0 4px 10px rgba(0,0,0,0.2)'}}
      />
      <KineticText
        text="TURNED"
        startFrame={65}
        durationInFrames={21}
        from={{scale: 0.8, opacity: 0}}
        to={{scale: 1, opacity: 1}}
        principles={{exaggerate: 110}}
        style={{x: 540, y: 850, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 140, color: '#1E2226'}}
      />
      <KineticText
        text="INTO AMAZING"
        startFrame={104}
        durationInFrames={21}
        from={{scale: 0.8, opacity: 0}}
        to={{scale: 1, opacity: 1}}
        principles={{exaggerate: 110}}
        style={{x: 540, y: 900, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 160, color: '#FFFFFF'}}
      />
      <KineticText
        text="VIDEOS"
        startFrame={120}
        durationInFrames={15}
        from={{scale: 0.9, opacity: 0}}
        to={{scale: 1, opacity: 1}}
        principles={{exaggerate: 110}}
        style={{x: 540, y: 1100, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

const Screen10: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#FFD000'}}>
      <KineticText
        text="EXCLUSIVELY"
        startFrame={10}
        durationInFrames={21}
        from={{x: -200, opacity: 0}}
        to={{x: 540, opacity: 1}}
        principles={{exaggerate: 120}}
        exit={{type: 'fade', duration: 10, startFrame: 60}}
        style={{y: 850, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 150, color: '#1E2226'}}
      />
      <KineticText
        text="ON"
        startFrame={40}
        durationInFrames={21}
        from={{opacity: 0}}
        to={{scale: 1.05, opacity: 1}}
        exit={{type: 'zoom-out', duration: 20, startFrame: 70}}
        style={{x: 540, y: 1050, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 140, color: '#1E2226'}}
      />
    </AbsoluteFill>
  );
};

const Screen11: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const circleProgress = spring({frame, fps, config: {stiffness: 100, damping: 12}});
  const circleScale = interpolate(circleProgress, [0, 0.8, 1], [0, 1.05, 1]);
  const logoOpacity = interpolate(frame, [20, 30], [0, 1], {extrapolateLeft: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#FFD000'}}>
      <div style={{
        position: 'absolute',
        left: 540,
        top: 960,
        width: 378,
        height: 378,
        backgroundColor: '#000000',
        borderRadius: '50%',
        transform: `translate(-50%, -50%) scale(${circleScale})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          color: '#FFFFFF',
          fontFamily: 'Inter',
          fontSize: 64,
          fontWeight: 800,
          opacity: logoOpacity
        }}>
          fiverr®
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FiverrPromoV4: React.FC = () => {
  return (
    <AbsoluteFill>
      <Watermark />
      <Series>
        <Series.Sequence durationInFrames={85}><Screen01 /></Series.Sequence>
        <Series.Sequence durationInFrames={89}><Screen02 /></Series.Sequence>
        <Series.Sequence durationInFrames={96}><Screen03 /></Series.Sequence>
        <Series.Sequence durationInFrames={102}><Screen04 /></Series.Sequence>
        <Series.Sequence durationInFrames={129}><Screen05 /></Series.Sequence>
        <Series.Sequence durationInFrames={69}><Screen06 /></Series.Sequence>
        <Series.Sequence durationInFrames={48}><Screen07 /></Series.Sequence>
        <Series.Sequence durationInFrames={54}><Screen08 /></Series.Sequence>
        <Series.Sequence durationInFrames={144}><Screen09 /></Series.Sequence>
        <Series.Sequence durationInFrames={96}><Screen10 /></Series.Sequence>
        <Series.Sequence durationInFrames={148}><Screen11 /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
