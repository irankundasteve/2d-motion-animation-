import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from 'remotion';
import {BOUNCE_HELLO_V3} from './constants';
import React from 'react';

export const BounceToHelloV3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // --- BALL PHYSICS (Y Position) ---
  // Frame 0-18: Drop -200 -> 1400 (ease-in)
  // Frame 18-30: Bounce Up 1400 -> 900 (ease-out)
  // Frame 30-40: Bounce Down 900 -> 1400 (ease-in)
  // Frame 40-49: Bounce Up 1400 -> 1150 (ease-out)
  // Frame 49-56: Bounce Down 1150 -> 1400 (ease-in)
  // Frame 62-77: Move 1400 -> 960 (cubic-bezier)

  const getY = () => {
    if (frame <= 18) {
      return interpolate(frame, [0, 18], [-200, 1400], {
        easing: Easing.in(Easing.quad),
        extrapolateRight: 'clamp',
      });
    }
    if (frame <= 30) {
      return interpolate(frame, [18, 30], [1400, 900], {
        easing: Easing.out(Easing.quad),
        extrapolateRight: 'clamp',
      });
    }
    if (frame <= 40) {
      return interpolate(frame, [30, 40], [900, 1400], {
        easing: Easing.in(Easing.quad),
        extrapolateRight: 'clamp',
      });
    }
    if (frame <= 49) {
      return interpolate(frame, [40, 49], [1400, 1150], {
        easing: Easing.out(Easing.quad),
        extrapolateRight: 'clamp',
      });
    }
    if (frame <= 56) {
      return interpolate(frame, [49, 56], [1150, 1400], {
        easing: Easing.in(Easing.quad),
        extrapolateRight: 'clamp',
      });
    }
    if (frame >= 62 && frame <= 77) {
      return interpolate(frame, [62, 77], [1400, 960], {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      });
    }
    if (frame > 77) return 960;
    return 1400; // Hold at floor between bounces
  };

  const y = getY();

  // --- MORPHING ---
  // Morph Frame 62-77
  const morphProgress = interpolate(frame, [62, 77], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const width = interpolate(morphProgress, [0, 1], [180, 600]);
  const height = interpolate(morphProgress, [0, 1], [180, 200]);
  const borderRadius = interpolate(morphProgress, [0, 1], [90, 20]);

  // Rectangle Exit (Frame 89-98)
  const rectOpacity = interpolate(frame, [89, 98], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- TEXT ---
  // Text Entry (Frame 89-98)
  const textSpring = spring({
    frame: frame - 89,
    fps,
    config: {
      stiffness: 100,
      damping: 10,
    },
  });

  const textOpacity = interpolate(textSpring, [0, 1], [0, 1]);
  const textScale = interpolate(textSpring, [0, 1], [0.8, 1]);
  
  // Text Exit (Frame 125-135)
  const finalOpacity = interpolate(frame, [125, 135], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#1E2226'}}>
      {/* Morphing Shape */}
      {frame < 98 && (
        <div
          style={{
            position: 'absolute',
            left: 540,
            top: y,
            width,
            height,
            backgroundColor: BOUNCE_HELLO_V3.ballColor,
            borderRadius: `${borderRadius}px`,
            transform: 'translate(-50%, -50%)',
            opacity: rectOpacity,
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
          opacity: textOpacity * finalOpacity,
          color: BOUNCE_HELLO_V3.textColor,
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
