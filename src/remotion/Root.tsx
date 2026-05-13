import {Composition} from 'remotion';
import {Video} from './Video';
import {
  FPS,
  WIDTH,
  HEIGHT,
  DURATION_IN_FRAMES,
} from './constants';
import {continueRender, delayRender, staticFile} from 'remotion';

// Import fonts if needed (Remotion way)
const waitForFont = delayRender();
import('@remotion/google-fonts/Inter').then(({loadFont}) => {
  loadFont();
  continueRender(waitForFont);
});

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="OceanVsSea"
        component={Video}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
