/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {Player} from '@remotion/player';
import {BounceToHello} from './remotion/BounceToHello';
import {BOUNCE_CONFIG} from './remotion/constants';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800 relative">
        <Player
          component={BounceToHello}
          durationInFrames={BOUNCE_CONFIG.durationInFrames}
          compositionWidth={BOUNCE_CONFIG.width}
          compositionHeight={BOUNCE_CONFIG.height}
          fps={BOUNCE_CONFIG.fps}
          controls
          loop
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-mono text-white/60 pointer-events-none">
          Bounce to Hello - 9:16
        </div>
      </div>
    </div>
  );
}

