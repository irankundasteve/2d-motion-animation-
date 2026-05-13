import {Audio, Sequence} from 'remotion';
import {TRANSCRIPT, FPS} from './constants';
import * as SFX from '@remotion/sfx';

export const SoundEffects = () => {
  return (
    <>
      {/* Short form videos often don't have long ambient tracks, but let's add some transitions */}
      {TRANSCRIPT.map((segment) => {
        const startFrame = Math.round(segment.start * FPS);
        const visual = segment.visual.toLowerCase();
        const text = segment.text.toLowerCase();
        
        let soundSrc: string = SFX.whoosh; // Default transition sound
        
        if (visual.includes('pop') || visual.includes('dot')) {
          soundSrc = SFX.ding;
        } else if (visual.includes('beast') || text.includes('beast') || visual.includes('massive')) {
          soundSrc = SFX.vineBoom; // Punchy emphasis for "beast"
        } else if (visual.includes('label') || visual.includes('map')) {
          soundSrc = SFX.uiSwitch;
        } else if (visual.includes('house') || visual.includes('people')) {
          soundSrc = SFX.mouseClick;
        }

        return (
          <Sequence key={`sound-${segment.id}`} from={startFrame} durationInFrames={Math.floor(FPS * 1.5)}>
            <Audio src={soundSrc} volume={0.6} />
          </Sequence>
        );
      })}
    </>
  );
};
