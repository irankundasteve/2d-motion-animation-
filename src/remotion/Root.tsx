import {Composition} from 'remotion';
import {Video} from './Video';
import {BouncingBall} from './BouncingBall';
import {KineticTypography} from './KineticTypography';
import {BounceToHello} from './BounceToHello';
import {BounceToHelloV3} from './BounceToHelloV3';
import {BounceToHelloV4} from './BounceToHelloV4';
import {DiamondRain} from './DiamondRain';
import {FiverrPromo} from './FiverrPromo';
import {FiverrPromoV4} from './FiverrPromoV4';
import {FiverrPromoV5} from './FiverrPromoV5';
import {
  FPS,
  WIDTH,
  HEIGHT,
  DURATION_IN_FRAMES,
  KINETIC_CONFIG,
  BOUNCE_CONFIG,
  BOUNCE_HELLO_V3,
  BOUNCE_HELLO_V4,
  DIAMOND_RAIN_CONFIG,
  FIVERR_PROMO_CONFIG,
} from './constants';
import {loadFont} from '@remotion/google-fonts/Inter';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';

loadFont();
loadMontserrat();

export const RemotionRoot = () => {
  const kineticDuration = (24500 / 1000) * FPS;

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
        durationInFrames={150} // 5s * 30fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KineticTypography"
        component={KineticTypography}
        durationInFrames={kineticDuration}
        fps={FPS}
        width={KINETIC_CONFIG.width}
        height={KINETIC_CONFIG.height}
      />
      <Composition
        id="BounceToHello"
        component={BounceToHello}
        durationInFrames={BOUNCE_CONFIG.durationInFrames}
        fps={BOUNCE_CONFIG.fps}
        width={BOUNCE_CONFIG.width}
        height={BOUNCE_CONFIG.height}
      />
      <Composition
        id="BounceToHelloV3"
        component={BounceToHelloV3}
        durationInFrames={BOUNCE_HELLO_V3.durationInFrames}
        fps={BOUNCE_HELLO_V3.fps}
        width={BOUNCE_HELLO_V3.width}
        height={BOUNCE_HELLO_V3.height}
      />
      <Composition
        id="BounceToHelloV4"
        component={BounceToHelloV4}
        durationInFrames={BOUNCE_HELLO_V4.durationInFrames}
        fps={BOUNCE_HELLO_V4.fps}
        width={BOUNCE_HELLO_V4.width}
        height={BOUNCE_HELLO_V4.height}
      />
      <Composition
        id="DiamondRain"
        component={DiamondRain}
        durationInFrames={DIAMOND_RAIN_CONFIG.durationInFrames}
        fps={DIAMOND_RAIN_CONFIG.fps}
        width={DIAMOND_RAIN_CONFIG.width}
        height={DIAMOND_RAIN_CONFIG.height}
      />
      <Composition
        id="FiverrPromo"
        component={FiverrPromo}
        durationInFrames={FIVERR_PROMO_CONFIG.durationInFrames}
        fps={FIVERR_PROMO_CONFIG.fps}
        width={FIVERR_PROMO_CONFIG.width}
        height={FIVERR_PROMO_CONFIG.height}
      />
      <Composition
        id="FiverrPromoV4"
        component={FiverrPromoV4}
        durationInFrames={FIVERR_PROMO_CONFIG.durationInFrames}
        fps={FIVERR_PROMO_CONFIG.fps}
        width={FIVERR_PROMO_CONFIG.width}
        height={FIVERR_PROMO_CONFIG.height}
      />
      <Composition
        id="FiverrPromoV5"
        component={FiverrPromoV5}
        durationInFrames={FIVERR_PROMO_CONFIG.durationInFrames}
        fps={FIVERR_PROMO_CONFIG.fps}
        width={FIVERR_PROMO_CONFIG.width}
        height={FIVERR_PROMO_CONFIG.height}
      />
    </>
  );
};
