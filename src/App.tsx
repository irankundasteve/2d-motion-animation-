/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {Player} from '@remotion/player';
import {FiverrPromo} from './remotion/FiverrPromo';
import {FIVERR_PROMO_CONFIG} from './remotion/constants';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800 relative">
        <Player
          component={FiverrPromo}
          durationInFrames={FIVERR_PROMO_CONFIG.durationInFrames}
          compositionWidth={FIVERR_PROMO_CONFIG.width}
          compositionHeight={FIVERR_PROMO_CONFIG.height}
          fps={FIVERR_PROMO_CONFIG.fps}
          controls
          loop
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-mono text-white/60 pointer-events-none">
          Fiverr Promo - 9:16
        </div>
      </div>
    </div>
  );
}

