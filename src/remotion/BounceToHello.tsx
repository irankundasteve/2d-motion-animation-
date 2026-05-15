import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';
import {BOUNCE_CONFIG} from './constants';
import React from 'react';

export const BounceToHello: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // 1. Drop Physics
  const dropProgress = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });
  
  // Bounce Logic
  // Frame 0-12: Drop 300 -> 1400
  // Frame 12-18: Bounce Up 1400 -> 1100
  // Frame 18-24: Bounce Down 1100 -> 1400
  
  let y = interpolate(frame, [0, 12], [300, 1400], {
     extrapolateRight: 'clamp'
  });
  
  if (frame > 12 && frame <= 18) {
    y = interpolate(frame, [12, 18], [1400, 1100], {
      extrapolateRight: 'clamp'
    });
  } else if (frame > 18) {
     y = interpolate(frame, [18, 24], [1100, 1400], {
       extrapolateRight: 'clamp'
     });
  }

  // 2. Morph Logic (Start at 2400ms / 30fps = Frame 72)
  const morphProgress = spring({
    frame: frame - 72,
    fps,
    config: {stiffness: 100, damping: 15},
  });

  const ballRadius = 80;
  const rectWidth = 200;
  const rectHeight = 80;
  
  const currentWidth = interpolate(morphProgress, [0, 1], [ballRadius * 2, rectWidth]);
  const currentHeight = interpolate(morphProgress, [0, 1], [ballRadius * 2, rectHeight]);
  const currentBorderRadius = interpolate(morphProgress, [0, 1], [50, 8]); // 50% to 8px (relative to element)

  // 3. Text Logic (Start at 2700ms / 30fps = Frame 81)
  const textProgress = spring({
    frame: frame - 81,
    fps,
    config: {stiffness: 160, damping: 10},
  });

  const textOpacity = interpolate(textProgress, [0, 1], [0, 1]);
  const textScale = interpolate(textProgress, [0, 1], [0.6, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: '#f8fafc'}}>
      {/* The Shape */}
      <div
        style={{
          position: 'absolute',
          left: 540,
          top: y,
          width: currentWidth,
          height: currentHeight,
          backgroundColor: BOUNCE_CONFIG.ballColor,
          borderRadius: `${currentBorderRadius}%`,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
         {/* The Text */}
         <div
            style={{
               fontFamily: 'monospace',
               fontWeight: 800,
               fontSize: 32,
               color: BOUNCE_CONFIG.textColor,
               opacity: textOpacity,
               transform: `scale(${textScale})`,
               whiteSpace: 'nowrap'
            }}
         >
            HELLO WORLD
         </div>
      </div>
    </AbsoluteFill>
  );
};
