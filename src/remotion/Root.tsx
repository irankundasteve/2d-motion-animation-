import {Composition} from 'remotion';
import {Video} from './Video';
import {
  FPS,
  WIDTH,
  HEIGHT,
  DURATION_IN_FRAMES,
} from './constants';
import {loadFont} from '@remotion/google-fonts/Inter';

loadFont();

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
