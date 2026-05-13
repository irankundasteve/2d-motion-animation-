import {Sequence} from 'remotion';
import {TRANSCRIPT, FPS} from './constants';
import {Scene} from './Scene';

export const Video = () => {
  return (
    <div style={{flex: 1, backgroundColor: '#001a2c', color: 'white'}}>
      {TRANSCRIPT.map((segment) => {
        const startFrame = Math.round(segment.start * FPS);
        const durationInFrames = Math.round((segment.end - segment.start) * FPS);

        return (
          <Sequence
            key={segment.id}
            from={startFrame}
            durationInFrames={durationInFrames}
          >
            <Scene segment={segment} />
          </Sequence>
        );
      })}
    </div>
  );
};
