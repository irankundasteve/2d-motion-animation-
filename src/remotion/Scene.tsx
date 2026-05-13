import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from 'remotion';
import {VideoSegment, FPS} from './constants';
import * as Icons from 'lucide-react';
import React from 'react';

export const Scene: React.FC<{segment: VideoSegment}> = ({segment}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, 5, (segment.end - segment.start) * FPS - 5, (segment.end - segment.start) * FPS],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const scale = spring({
    frame,
    fps: FPS,
    config: {stiffness: 100},
  });

  const renderVisual = () => {
    const visualLower = segment.visual.toLowerCase();
    
    // Simple mapping based on keywords in visual description
    if (visualLower.includes('wave') || visualLower.includes('ocean')) {
      return <Icons.Waves size={300} color="#00a8ff" style={{transform: `scale(${scale})` }} />;
    }
    if (visualLower.includes('globe')) {
      return <Icons.Globe size={400} color="#00d2ff" style={{transform: `scale(${scale * 1.2})` }} />;
    }
    if (visualLower.includes('beast') || visualLower.includes('eye')) {
      return <Icons.Eye size={300} color="#ff4757" style={{transform: `scale(${scale})` }} />;
    }
    if (visualLower.includes('ship')) {
      return <Icons.Ship size={300} color="#f1f2f6" style={{transform: `scale(${scale})` }} />;
    }
    if (visualLower.includes('map') || visualLower.includes('label')) {
      return <Icons.Map size={400} color="#2ed573" style={{transform: `scale(${scale})` }} />;
    }
    if (visualLower.includes('house') || visualLower.includes('people')) {
      return <Icons.Users size={300} color="#ffa502" style={{transform: `scale(${scale})` }} />;
    }
    if (visualLower.includes('compass')) {
      return (
        <div className="flex gap-8">
          <Icons.Compass size={200} color="#ffffff" />
          <Icons.Building size={200} color="#ffffff" />
          <Icons.Dices size={200} color="#ffffff" />
        </div>
      );
    }
    if (visualLower.includes('search') || visualLower.includes('wait')) {
      return <Icons.Search size={300} color="#ffffff" style={{transform: `scale(${scale})` }} />;
    }
    if (visualLower.includes('comment')) {
      return <Icons.MessageSquare size={300} color="#ffffff" style={{transform: `scale(${scale})` }} />;
    }

    return null;
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        opacity,
        height: '100%',
        width: '100%',
        textAlign: 'center',
        position: 'relative'
      }}
    >
      <div style={{marginBottom: 80, zIndex: 10}}>
        {renderVisual()}
      </div>
      
      <h1
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: segment.text.length > 50 ? 60 : 90,
          fontWeight: 800,
          lineHeight: 1.2,
          textTransform: 'uppercase',
          maxWidth: width - 120,
          color: '#ffffff',
          textShadow: '0 4px 12px rgba(0,0,0,0.5)',
          zIndex: 20
        }}
      >
        {segment.text}
      </h1>
      
      {segment.visual.includes('morph') && (
         <div style={{
           position: 'absolute',
           bottom: 200,
           fontSize: 120,
           fontWeight: 'black',
           color: '#ff4757',
           zIndex: 30
         }}>
           OCEAN ≠ SEA
         </div>
      )}
    </div>
  );
};
