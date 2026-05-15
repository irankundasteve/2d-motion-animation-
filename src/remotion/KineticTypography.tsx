import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from 'remotion';
import {KINETIC_CONFIG} from './constants';
import React from 'react';

const TextElement: React.FC<{
  content: string;
  y: number;
  x?: number;
  size: number;
  color: string;
  delayMs: number;
  slideIn?: boolean | 'left';
  pop?: boolean;
  background?: string;
}> = ({content, y, x = 540, size, color, delayMs, slideIn, pop, background}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delayFrames = (delayMs / 1000) * fps;
  
  const progress = spring({
    frame: frame - delayFrames,
    fps,
    config: {stiffness: 100, damping: 15},
  });

  const opacity = interpolate(progress, [0, 0.2], [0, 1]);
  
  let translateX = 0;
  if (slideIn === true) {
    translateX = interpolate(progress, [0, 1], [400, 0]);
  } else if (slideIn === 'left') {
    translateX = interpolate(progress, [0, 1], [-400, 0]);
  }

  const scale = pop ? interpolate(progress, [0, 0.5, 1], [0, 1.5, 1]) : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
        opacity,
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 900,
        fontSize: size,
        color,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        padding: background ? '10px 40px' : 0,
        backgroundColor: background || 'transparent',
      }}
    >
      {content}
    </div>
  );
};

const TypographyScreen: React.FC<{screen: typeof KINETIC_CONFIG.screens[0]}> = ({screen}) => {
  return (
    <AbsoluteFill>
      {screen.elements.map((el) => (
        <TextElement
          key={el.id}
          content={el.text}
          y={el.y}
          x={el.x}
          size={el.size}
          color={el.color}
          delayMs={el.delay}
          slideIn={el.slideIn as any}
          pop={el.pop}
          background={el.background}
        />
      ))}
    </AbsoluteFill>
  );
};

export const KineticTypography: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: KINETIC_CONFIG.backgroundColor}}>
      {KINETIC_CONFIG.screens.map((screen) => {
        const startFrame = (screen.startMs / 1000) * fps;
        const durationFrames = (screen.durationMs / 1000) * fps;
        return (
          <Sequence key={screen.id} from={startFrame} durationInFrames={durationFrames}>
            <TypographyScreen screen={screen} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
