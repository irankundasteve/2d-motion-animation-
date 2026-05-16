/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {Player} from '@remotion/player';
import {PythonListComp} from './remotion/PythonListComp';
import {PYTHON_COMP_CONFIG} from './remotion/constants';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800 relative">
        <Player
          component={PythonListComp}
          durationInFrames={PYTHON_COMP_CONFIG.durationInFrames}
          compositionWidth={PYTHON_COMP_CONFIG.width}
          compositionHeight={PYTHON_COMP_CONFIG.height}
          fps={PYTHON_COMP_CONFIG.fps}
          controls
          loop
          autoPlay
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-mono text-white/60 pointer-events-none">
          Python List Comp - 9:16
        </div>
      </div>
    </div>
  );
}

