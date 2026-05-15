import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
  Audio,
  Sequence,
} from 'remotion';
import {BOUNCE_HELLO_V4} from './constants';
import * as SFX from '@remotion/sfx';
import React from 'react';

export const BounceToHelloV4: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // --- POSITION AND SCALE LOGIC ---
  let y = 1400;
  let x = 540;
  let scaleX = 1;
  let scaleY = 1;

  if (frame < 18) {
    // 0-18f: Drop with slight arc (P7)
    y = interpolate(frame, [0, 18], [-200, 1400], {
      easing: Easing.in(Easing.quad),
      extrapolateRight: 'clamp',
    });
    x = interpolate(frame, [0, 9, 18], [540, 545, 540]);
  } else if (frame < 30) {
    // 18-30f: Bounce 1 Up
    // Anticipation (P2): Slight squash at 18
    const bounceProgress = interpolate(frame, [18, 30], [0, 1], {
      easing: Easing.out(Easing.quad),
    });
    y = interpolate(bounceProgress, [0, 1], [1400, 900]);
    
    // Squash and Stretch (P1): 90% squash at hit, 110% stretch in air
    scaleY = interpolate(frame, [18, 20, 24, 30], [0.85, 0.9, 1.1, 1.1]);
    scaleX = interpolate(frame, [18, 20, 24, 30], [1.2, 1.1, 0.9, 0.9]);
  } else if (frame < 40) {
    // 30-40f: Bounce 1 Down
    const bounceProgress = interpolate(frame, [30, 40], [0, 1], {
      easing: Easing.in(Easing.quad),
    });
    y = interpolate(bounceProgress, [0, 1], [900, 1400]);
    scaleY = interpolate(frame, [30, 36, 40], [1.1, 1.1, 0.9]);
    scaleX = interpolate(frame, [30, 36, 40], [0.9, 0.9, 1.1]);
  } else if (frame < 49) {
    // 40-49f: Bounce 2 Up
    const bounceProgress = interpolate(frame, [40, 49], [0, 1], {
      easing: Easing.out(Easing.quad),
    });
    y = interpolate(bounceProgress, [0, 1], [1400, 1150]);
    scaleY = interpolate(frame, [40, 42, 49], [0.92, 0.95, 1.05]);
    scaleX = interpolate(frame, [40, 42, 49], [1.08, 1.05, 0.95]);
  } else if (frame < 56) {
    // 49-56f: Bounce 2 Down
    const bounceProgress = interpolate(frame, [49, 56], [0, 1], {
      easing: Easing.in(Easing.quad),
    });
    y = interpolate(bounceProgress, [0, 1], [1150, 1400]);
    
    // Follow Through (P5): Settle scale
    scaleY = interpolate(frame, [49, 56], [1.05, 1]);
    scaleX = interpolate(frame, [49, 56], [0.95, 1]);
  } else if (frame < 62) {
    y = 1400;
    scaleX = 1;
    scaleY = 1;
  } else if (frame < 77) {
    // 62-77f: Morph Movement
    // Anticipation (P2): pause/prep before morph
    y = interpolate(frame, [62, 77], [1400, 960], {
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  } else {
    y = 960;
  }

  // --- MORPHING PARAMETERS ---
  const morphProgress = interpolate(frame, [62, 77], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const width = interpolate(morphProgress, [0, 1], [180, 600]);
  const height = interpolate(morphProgress, [0, 1], [180, 200]);
  const borderRadius = interpolate(morphProgress, [0, 1], [90, 20]);

  // Rectangle Exit (89-98f)
  const rectOpacity = interpolate(frame, [89, 98], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // --- TEXT ANIMATION ---
  const textSpring = spring({
    frame: frame - 89,
    fps,
    config: {stiffness: 100, damping: 12, mass: 0.8},
  });

  // Exaggeration (P10): Pop to 1.15
  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);
  const textScale = interpolate(textSpring, [0, 0.8, 1], [0.8, 1.15, 1]);
  const textBlur = interpolate(textSpring, [0, 1], [8, 0]);

  // Text Exit (125-135f)
  const textExitOpacity = interpolate(frame, [125, 135], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BOUNCE_HELLO_V4.bgColor}}>
      {/* Audio Cue */}
      <Sequence from={18} durationInFrames={30}>
        <Audio src={SFX.ding} volume={0.8} />
      </Sequence>

      {/* Morphing Shape */}
      {frame < 98 && (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width,
            height,
            backgroundColor: BOUNCE_HELLO_V4.brandColor,
            borderRadius: `${borderRadius}px`,
            transform: `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`,
            opacity: rectOpacity,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}
        />
      )}

      {/* Hello World Text */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: 960,
          transform: `translate(-50%, -50%) scale(${textScale})`,
          opacity: textOpacity * textExitOpacity,
          filter: `blur(${textBlur}px)`,
          color: BOUNCE_HELLO_V4.textColor,
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: 800,
          fontSize: 84,
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        HELLO WORLD
      </div>
    </AbsoluteFill>
  );
};
