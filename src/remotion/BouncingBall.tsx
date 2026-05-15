import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Audio,
  Sequence,
} from 'remotion';
import {BALL_CONFIG} from './constants';
import * as SFX from '@remotion/sfx';
import React, {useMemo} from 'react';

export const BouncingBall: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ball} = BALL_CONFIG;

  // Pre-calculate physics for every frame
  const {positions, collisions} = useMemo(() => {
    const pos = [];
    const colFrames: number[] = [];
    let x = ball.physics.startX;
    let y = ball.physics.startY;
    let vy = 0;
    let vx = ball.physics.initialVelocityX;
    
    for (let i = 0; i < BALL_CONFIG.durationInFrames; i++) {
      vy += ball.physics.gravity;
      y += vy;
      x += vx;

      // Wrap X
      if (x > BALL_CONFIG.width) x = 0;
      if (x < 0) x = BALL_CONFIG.width;

      // Floor collision
      if (y + ball.radius >= ball.physics.floorY) {
        y = ball.physics.floorY - ball.radius;
        // Check if velocity is high enough to bounce
        if (Math.abs(vy) > 1) {
          vy = -vy * ball.physics.bounciness;
          colFrames.push(i);
        } else {
          vy = 0;
        }
      }
      
      pos.push({x, y, vy});
    }
    return {positions: pos, collisions: colFrames};
  }, [ball]);

  const current = positions[frame] || positions[positions.length - 1];

  // Squash and stretch logic
  // If moving fast downwards, stretch (scaleY > 1, scaleX < 1)
  // If moving fast upwards, stretch
  // If hitting floor, squash (scaleY < 1, scaleX > 1)
  
  let scaleX = 1;
  let scaleY = 1;
  
  const impactWindow = 5; // frames
  const lastCollision = [...collisions].reverse().find(f => f <= frame && frame < f + impactWindow);
  
  if (lastCollision !== undefined) {
    // Impact squash
    const progress = (frame - lastCollision) / impactWindow;
    scaleY = interpolate(progress, [0, 0.5, 1], [0.6, 0.8, 1]);
    scaleX = interpolate(progress, [0, 0.5, 1], [1.4, 1.2, 1]);
  } else {
    // Air stretch based on velocity
    const stretchFactor = Math.min(Math.abs(current.vy) * 0.005, 0.2);
    scaleY = 1 + stretchFactor;
    scaleX = 1 - stretchFactor;
  }

  const opacity = interpolate(
    frame,
    [ball.exit.startAtFrame, ball.exit.startAtFrame + 15],
    [1, 0],
    {extrapolateRight: 'clamp'}
  );

  return (
    <div style={{flex: 1, backgroundColor: '#0f172a', position: 'relative'}}>
      {/* Floor */}
      <div 
        style={{
          position: 'absolute',
          top: ball.physics.floorY,
          width: '100%',
          height: 10,
          backgroundColor: '#334155'
        }}
      />

      {/* Ball */}
      <div
        style={{
          position: 'absolute',
          left: current.x - ball.radius,
          top: current.y - ball.radius,
          width: ball.radius * 2,
          height: ball.radius * 2,
          backgroundColor: ball.color,
          borderRadius: '50%',
          border: `${ball.strokeWidth}px solid ${ball.stroke}`,
          transform: `scale(${scaleX}, ${scaleY})`,
          transformOrigin: 'bottom center',
          opacity
        }}
      />

      {/* Collision Sounds */}
      {collisions.map((f) => (
        <Sequence key={f} from={f} durationInFrames={30}>
          <Audio src={SFX.vineBoom} volume={0.5} />
        </Sequence>
      ))}
    </div>
  );
};
