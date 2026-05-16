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
import React from 'react';

// --- HELPERS ---

const Watermark: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        right: 40,
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 700,
        zIndex: 100,
        opacity: 0.8,
        fontFamily: 'Montserrat',
      }}
    >
      fiverr®
    </div>
  );
};

const KineticText: React.FC<{
  text: string;
  startFrame: number;
  durationInFrames?: number;
  from?: {x?: number; y?: number; scale?: number; opacity?: number; blur?: number; rotate?: number};
  to?: {x?: number; y?: number; scale?: number; opacity?: number; blur?: number; rotate?: number};
  style?: React.CSSProperties;
  easing?: (t: number) => number;
  pop?: boolean;
}> = ({text, startFrame, durationInFrames, from, to, style, easing, pop}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const progress = interpolate(frame, [startFrame, startFrame + (durationInFrames || 15)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easing || Easing.bezier(0.16, 1, 0.3, 1),
  });

  const x = from?.x !== undefined ? interpolate(progress, [0, 1], [from.x, to?.x ?? from.x]) : (to?.x ?? 540);
  const y = from?.y !== undefined ? interpolate(progress, [0, 1], [from.y, to?.y ?? from.y]) : (to?.y ?? 960);
  
  // Handling the "pop" logic for specifically requested scale curves
  let scale = 1;
  if (pop) {
    scale = interpolate(progress, [0, 0.5, 1], [from?.scale ?? 0.85, 1.15, to?.scale ?? 1]);
  } else {
    scale = interpolate(progress, [0, 1], [from?.scale ?? 1, to?.scale ?? 1]);
  }

  const opacity = interpolate(progress, [0, 0.3, 1], [from?.opacity ?? 0, 1, to?.opacity ?? 1]);
  const blur = interpolate(progress, [0, 1], [from?.blur ?? 0, to?.blur ?? 0]);
  const rotate = interpolate(progress, [0, 1], [from?.rotate ?? 0, to?.rotate ?? 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
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
  const transition = interpolate(frame, [65, 85], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rotateOut = transition * -90;
  const xOut = transition * -340; // towards 200 from 540 approx

  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand, transform: `rotate(${rotateOut}deg) translateX(${xOut}px)`, transformOrigin: '200px 960px'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.1) 100%)'}} />
      
      <KineticText
        text="WANT TO"
        startFrame={10}
        durationInFrames={11}
        from={{x: 1188, y: 576, scale: 3, blur: 12}}
        to={{x: 702, y: 576, scale: 1, blur: 0}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 84, color: '#FFFFFF'}}
      />
      <KineticText
        text="INCREASE"
        startFrame={21}
        durationInFrames={14}
        from={{x: -200, y: 922, blur: 20}}
        to={{x: 702, y: 922, blur: 0}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 210, color: '#FFFFFF'}}
      />
      <KineticText
        text="YOUR"
        startFrame={35}
        durationInFrames={15}
        from={{x: 1188, y: 1306, blur: 8}}
        to={{x: 702, y: 1306, blur: 0}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 84, color: '#1E2228'}}
      />
      <KineticText
        text="SALES"
        startFrame={35}
        durationInFrames={30}
        from={{y: 1500, scale: 0.85}}
        to={{y: 1306, scale: 1}}
        pop
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 210, color: '#FFFFFF'}}
      />
      
      {/* Exclamation */}
      {frame >= 65 && (
        <div style={{
          position: 'absolute',
          left: 972,
          top: 1100,
          width: 24,
          height: 160,
          border: '4px solid #1E2228',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 0'
        }}>
          <div style={{width: 12, height: 100, backgroundColor: '#1E2228', opacity: interpolate(frame, [65, 70], [0, 1])}} />
          <div style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: '#1E2228', opacity: interpolate(frame, [71, 75], [0, 1])}} />
        </div>
      )}
    </AbsoluteFill>
  );
};

const Screen02: React.FC = () => {
  const frame = useCurrentFrame();
  
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="NEED"
        startFrame={22}
        durationInFrames={18}
        from={{scale: 1.1}}
        to={{scale: 1}}
        pop
        style={{x: 756, y: 672, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
      <KineticText
        text="AN"
        startFrame={40}
        durationInFrames={17}
        from={{x: -200, y: 960, blur: 15}}
        to={{x: 432, y: 960, blur: 0}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 130, color: '#FFFFFF'}}
      />
      <KineticText
        text="ANIMATED"
        startFrame={40}
        durationInFrames={17}
        from={{x: 1280, y: 960, blur: 15}}
        to={{x: 648, y: 960, blur: 0}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 130, color: '#1E2228'}}
      />
      <KineticText
        text="VIDEO"
        startFrame={57}
        durationInFrames={16}
        style={{
          left: 540,
          top: 1152,
          fontFamily: 'Montserrat',
          fontWeight: 800,
          fontSize: 170,
          color: '#FFFFFF',
          letterSpacing: 20
        }}
      />
    </AbsoluteFill>
  );
};

const Screen03: React.FC = () => {
  const frame = useCurrentFrame();
  const transition = interpolate(frame, [80, 96], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rotate = transition * 20;
  const scale = 1 + transition * 0.3;

  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand, transform: `scale(${scale}) rotate(${rotate}deg)`}}>
      <KineticText
        text="UNIQUE"
        startFrame={0}
        durationInFrames={15}
        from={{scale: 0.8, blur: 6}}
        to={{scale: 1, blur: 0}}
        style={{y: 700, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 220, color: '#FFFFFF'}}
      />
      <KineticText
        text="TYPOGRAPHY"
        startFrame={15}
        durationInFrames={20}
        from={{y: 400}}
        to={{y: 860}}
        pop
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 150, color: '#1E2226'}}
      />
      <KineticText
        text="PACK FOR YOUR"
        startFrame={35}
        durationInFrames={20}
        style={{y: 1000, fontFamily: 'Inter', fontWeight: 500, fontSize: 80, color: '#1E2226'}}
      />
      <KineticText
        text="PROJECT"
        startFrame={55}
        durationInFrames={15}
        from={{x: 1300, y: 1150, blur: 18}}
        to={{x: 540, y: 1150, blur: 0}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 190, color: '#FFFFFF'}}
      />
      
      {/* Ambient Circles */}
      {Array.from({length: 8}).map((_, i) => {
        const drift = interpolate(frame, [35, 96], [0, -150]);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: 200 + i * 100,
            top: 960 + i * 50 + drift,
            width: 20 + (i % 3) * 10,
            height: 20 + (i % 3) * 10,
            borderRadius: '50%',
            border: i % 2 === 0 ? '2px solid #FFFFFF' : 'none',
            backgroundColor: i % 2 === 1 ? '#FFFFFF' : 'transparent',
            opacity: interpolate(frame, [35, 43], [0, 0.5]),
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Screen04: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="KINETIC TYPO"
        startFrame={0}
        durationInFrames={1}
        style={{x: 324, y: 864, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 140, color: '#FFFFFF'}}
      />
      <KineticText
        text="USED TO PROMOTE"
        startFrame={18}
        durationInFrames={17}
        from={{x: 1300, y: 864, blur: 20}}
        to={{x: 700, y: 864, blur: 0}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 140, color: '#FFFFFF'}}
      />
      <KineticText
        text="YOUR"
        startFrame={35}
        durationInFrames={9}
        from={{y: 1400, rotate: 15}}
        to={{y: 1050, rotate: 0}}
        style={{x: 400, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 120, color: '#1E2226'}}
      />
      <KineticText
        text="BUSINESS"
        startFrame={44}
        durationInFrames={16}
        from={{y: 1400, rotate: 15}}
        to={{y: 1050, rotate: 0}}
        pop
        style={{x: 750, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 120, color: '#FFFFFF', letterSpacing: 10}}
      />
    </AbsoluteFill>
  );
};

const Screen05: React.FC = () => {
  const frame = useCurrentFrame();
  const barWidth = interpolate(frame, [5, 25], [0, 800], {extrapolateRight: 'clamp'});
  
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <div style={{
        position: 'absolute',
        left: 540,
        top: 1000,
        width: barWidth,
        height: 120,
        border: '4px solid #1E2226',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <KineticText
          text="STYLISH ANIMATED TITLES"
          startFrame={25}
          durationInFrames={35}
          from={{opacity: 0}}
          to={{opacity: 1}}
          style={{position: 'relative', left: 0, top: 0, transform: 'none', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 42, color: '#FFFFFF'}}
        />
      </div>
      <KineticText
        text="TITLES ANIMATION GRAPHIC PACK"
        startFrame={14}
        durationInFrames={9}
        style={{y: 920, fontFamily: 'Inter', fontWeight: 500, fontSize: 40, color: '#1E2226', letterSpacing: 4}}
      />
    </AbsoluteFill>
  );
};

const Screen06: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.orange}}>
      <KineticText
        text="CUSTOM"
        startFrame={14}
        durationInFrames={21}
        style={{y: 850, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
      <KineticText
        text="COLORS"
        startFrame={35}
        durationInFrames={21}
        from={{scale: 1.2}}
        to={{scale: 1}}
        pop
        style={{y: 1050, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF', letterSpacing: 20}}
      />
    </AbsoluteFill>
  );
};

const Screen07: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1]);
  
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.blue, opacity}}>
      <KineticText
        text="CUSTOM FONTS"
        startFrame={15}
        durationInFrames={20}
        from={{scale: 3, blur: 30}}
        to={{scale: 1, blur: 0}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

const Screen08: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.mustard}}>
      <KineticText
        text="FULL HD"
        startFrame={10}
        durationInFrames={21}
        from={{scale: 1.5}}
        to={{scale: 1}}
        style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 220, color: '#1E2226'}}
      />
    </AbsoluteFill>
  );
};

const Screen09: React.FC = () => {
  const frame = useCurrentFrame();
  const pushY = frame >= 75 ? 10 : 0;

  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="YOUR"
        startFrame={5}
        durationInFrames={9}
        style={{y: 750 - pushY, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 100, color: '#FFFFFF'}}
      />
      <KineticText
        text="SCRIPTS"
        startFrame={14}
        durationInFrames={15}
        from={{scale: 1.2}}
        to={{scale: 1}}
        pop
        style={{y: 950 + pushY, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF', textShadow: '0 4px 10px rgba(0,0,0,0.2)'}}
      />
      <KineticText
        text="TURNED"
        startFrame={65}
        durationInFrames={21}
        from={{scale: 0.8}}
        to={{scale: 1}}
        pop
        style={{y: 850, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 140, color: '#1E2226'}}
      />
      <KineticText
        text="INTO AMAZING"
        startFrame={104}
        durationInFrames={21}
        style={{y: 900, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 160, color: '#FFFFFF'}}
      />
      <KineticText
        text="VIDEOS"
        startFrame={120}
        durationInFrames={15}
        style={{y: 1100, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 180, color: '#FFFFFF'}}
      />
    </AbsoluteFill>
  );
};

const Screen10: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
      <KineticText
        text="EXCLUSIVELY"
        startFrame={10}
        durationInFrames={21}
        from={{x: -200}}
        to={{x: 540}}
        style={{y: 850, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 160, color: '#1E2226'}}
      />
      <KineticText
        text="ON"
        startFrame={40}
        durationInFrames={21}
        from={{scale: 1}}
        to={{scale: 1.05}}
        style={{y: 1050, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 140, color: '#1E2226'}}
      />
    </AbsoluteFill>
  );
};

const Screen11: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const circleProgress = spring({
    frame,
    fps,
    config: {stiffness: 100, damping: 12},
  });
  
  const circleScale = interpolate(circleProgress, [0, 0.8, 1], [0, 1.05, 1]);
  const logoOpacity = interpolate(frame, [25, 35], [0, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: FIVERR_PROMO_CONFIG.colors.brand}}>
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
          fontWeight: 500,
          opacity: logoOpacity
        }}>
          fiverr®
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FiverrPromo: React.FC = () => {
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
