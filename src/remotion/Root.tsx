import {Composition} from 'remotion';
import {Video} from './Video';
import {BouncingBall} from './BouncingBall';
import {
  FPS,
  WIDTH,
  HEIGHT,
  DURATION_IN_FRAMES,
  BALL_CONFIG,
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
      <Composition
        id="BouncingBall"
        component={BouncingBall}
        durationInFrames={BALL_CONFIG.durationInFrames}
        fps={BALL_CONFIG.fps}
        width={BALL_CONFIG.width}
        height={BALL_CONFIG.height}
      />
    </>
  );
};
