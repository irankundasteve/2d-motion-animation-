import {Audio, Sequence} from 'remotion';
import {TRANSCRIPT, FPS} from './constants';

const SOUNDS = {
  ambient: 'https://actions.google.com/sounds/v1/water/crashing_waves_on_beach.ogg',
  swoosh: 'https://actions.google.com/sounds/v1/cartoon/swoosh.ogg',
  pop: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg',
  impact: 'https://actions.google.com/sounds/v1/impacts/deep_thud.ogg',
  beast: 'https://actions.google.com/sounds/v1/animals/lion_growl_single.ogg',
};

export const SoundEffects = () => {
  return (
    <>
      {/* Background Ambient Ocean */}
      <Audio src={SOUNDS.ambient} volume={0.3} placeholder="" />

      {/* Programmatic sound triggers based on segment content */}
      {TRANSCRIPT.map((segment) => {
        const startFrame = Math.round(segment.start * FPS);
        const visual = segment.visual.toLowerCase();
        
        let soundSrc = '';
        if (visual.includes('pop') || visual.includes('icon') || visual.includes('dot')) {
          soundSrc = SOUNDS.pop;
        } else if (visual.includes('flash') || visual.includes('beast')) {
          soundSrc = SOUNDS.beast;
        } else if (visual.includes('massive') || visual.includes('deep')) {
          soundSrc = SOUNDS.impact;
        } else {
          soundSrc = SOUNDS.swoosh;
        }

        return (
          <Sequence key={`sound-${segment.id}`} from={startFrame} durationInFrames={30}>
            <Audio src={soundSrc} volume={0.8} placeholder="" />
          </Sequence>
        );
      })}
    </>
  );
};
