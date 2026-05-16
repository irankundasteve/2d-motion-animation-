import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
  Series,
} from 'remotion';
import {DIAMOND_RAIN_CONFIG} from './constants';
import React, {useMemo} from 'react';
import {Diamond, Atom, Zap, Boxes} from 'lucide-react';

const Particle: React.FC<{
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
}> = ({x, y, size, opacity, rotation}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        backgroundColor: DIAMOND_RAIN_CONFIG.colors.brand,
        opacity,
        transform: `rotate(${rotation}deg)`,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      }}
    />
  );
};

const DiamondBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  
  const particles = useMemo(() => {
    return Array.from({length: 40}).map((_, i) => ({
      id: i,
      x: Math.random() * width,
      initialY: Math.random() * height * 2 - height,
      speed: Math.random() * 5 + 5,
      size: Math.random() * 20 + 10,
      rotationSpeed: Math.random() * 2 - 1,
    }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{backgroundColor: DIAMOND_RAIN_CONFIG.colors.bg}}>
      {particles.map((p) => {
        const y = (p.initialY + frame * p.speed) % (height * 1.5) - height * 0.25;
        const rotation = frame * p.rotationSpeed * 5;
        return (
          <Particle
            key={p.id}
            x={p.x}
            y={y}
            size={p.size}
            opacity={0.3}
            rotation={rotation}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const TextElement: React.FC<{
  text: string;
  y: [number, number];
  startFrame: number;
  durationInFrames: number;
  fontSize: number;
  color?: string;
  weight?: number;
  pop?: boolean;
  blur?: number;
  tracking?: number;
  shadow?: string;
}> = ({text, y, startFrame, durationInFrames, fontSize, color, weight, pop, blur, tracking, shadow}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {stiffness: 100, damping: 15},
  });

  const translateY = interpolate(progress, [0, 1], [y[0], y[1]]);
  const opacity = interpolate(progress, [0, 0.5], [0, 1]);
  const scale = pop ? interpolate(progress, [0, 0.8, 1], [0.8, 1.1, 1]) : 1;
  const blurVal = blur ? interpolate(progress, [0, 1], [blur, 0]) : 0;

  // Exit animation
  const exitStart = durationInFrames - 10;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
     extrapolateLeft: 'clamp',
     extrapolateRight: 'clamp'
  });

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        top: translateY,
        textAlign: 'center',
        fontFamily: weight ? 'Montserrat' : 'Inter',
        fontWeight: weight || 500,
        fontSize,
        color: color || DIAMOND_RAIN_CONFIG.colors.text,
        opacity: opacity * exitOpacity,
        transform: `scale(${scale})`,
        filter: `blur(${blurVal}px)`,
        letterSpacing: tracking ? `${tracking}px` : 'normal',
        textShadow: shadow || 'none',
      }}
    >
      {text}
    </div>
  );
};

const IconElement: React.FC<{
  icon: React.ReactNode;
  x: number;
  y: [number, number];
  startFrame: number;
  size: number;
  color: string;
  principles?: any;
}> = ({icon, x, y, startFrame, size, color, principles}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: {stiffness: 100, damping: 12},
  });

  const opacity = interpolate(progress, [0, 0.3], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [y[0], y[1]]);
  
  let scaleX = progress;
  let scaleY = progress;
  
  if (principles?.squash && principles?.stretch) {
    const s1 = principles.squash / 100;
    const s2 = principles.stretch / 100;
    scaleY = interpolate(progress, [0, 0.5, 1], [0, s2, 1]);
    scaleX = interpolate(progress, [0, 0.5, 1], [0, s1, 1]);
  }

  const rotate = principles?.rotate ? interpolate(progress, [0, 1], [0, principles.rotate]) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: translateY,
        transform: `translate(-50%, -50%) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
        opacity,
        color,
      }}
    >
      {React.cloneElement(icon as React.ReactElement, { size })}
    </div>
  );
};

const Screen01: React.FC = () => {
  return (
    <AbsoluteFill>
      <DiamondBackground />
      <IconElement
        icon={<Diamond />}
        x={540}
        y={[400, 400]}
        startFrame={15}
        size={120}
        color={DIAMOND_RAIN_CONFIG.colors.brand}
        principles={{squash: 90, stretch: 110, exaggerate: 115}}
      />
      <TextElement
        text="It rains DIAMONDS"
        y={[700, 650]}
        startFrame={24}
        durationInFrames={120}
        fontSize={96}
        weight={800}
        pop
        blur={10}
        tracking={-2}
        shadow="0 4px 20px rgba(0,212,255,0.5)"
      />
      <TextElement
        text="On Uranus and Neptune"
        y={[1100, 1050]}
        startFrame={75}
        durationInFrames={120}
        fontSize={48}
        color={DIAMOND_RAIN_CONFIG.colors.brand}
        blur={5}
      />
    </AbsoluteFill>
  );
};

const Screen02: React.FC = () => {
  return (
    <AbsoluteFill>
       <DiamondBackground />
       <IconElement
        icon={<Boxes />}
        x={540}
        y={[700, 650]}
        startFrame={10}
        size={100}
        color={DIAMOND_RAIN_CONFIG.colors.brand}
        principles={{squash: 95, stretch: 105, exaggerate: 115}}
      />
       <TextElement
        text="1. Methane + Pressure"
        y={[400, 400]}
        startFrame={0}
        durationInFrames={135}
        fontSize={72}
        weight={800}
        color={DIAMOND_RAIN_CONFIG.colors.brand}
        pop
        blur={8}
      />
      <TextElement
        text="Millions x Earth's pressure"
        y={[950, 900]}
        startFrame={36}
        durationInFrames={135}
        fontSize={56}
        pop
        blur={4}
      />
    </AbsoluteFill>
  );
};

const Screen03: React.FC = () => {
  return (
    <AbsoluteFill>
      <DiamondBackground />
      <IconElement
        icon={<Atom />}
        x={540}
        y={[960, 960]}
        startFrame={30}
        size={240}
        color={DIAMOND_RAIN_CONFIG.colors.text}
        principles={{rotate: 180, exaggerate: 120}}
      />
      <TextElement
        text="Carbon → Diamonds"
        y={[1200, 1150]}
        startFrame={60}
        durationInFrames={120}
        fontSize={64}
        weight={800}
        pop
      />
    </AbsoluteFill>
  );
};

const Screen04: React.FC = () => {
  return (
    <AbsoluteFill>
      <DiamondBackground />
      <IconElement
        icon={<Zap />}
        x={540}
        y={[800, 800]}
        startFrame={5}
        size={100}
        color={DIAMOND_RAIN_CONFIG.colors.brand}
      />
      <TextElement
        text="Recreated on Earth with lasers"
        y={[960, 960]}
        startFrame={0}
        durationInFrames={105}
        fontSize={64}
        weight={800}
        pop
        blur={6}
        tracking={-1}
      />
    </AbsoluteFill>
  );
};

export const DiamondRain: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={120}>
        <Screen01 />
      </Series.Sequence>
      <Series.Sequence durationInFrames={135}>
        <Screen02 />
      </Series.Sequence>
      <Series.Sequence durationInFrames={120}>
        <Screen03 />
      </Series.Sequence>
      <Series.Sequence durationInFrames={105}>
        <Screen04 />
      </Series.Sequence>
    </Series>
  );
};
