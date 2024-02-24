'use client';

import { AppHero } from '../ui/ui-layout';


export default function DashboardFeature() {
  return (
    <div className = "w-full flex h-full justify-center p-20">
      {/* <AppHero title="Auction Space" subtitle="Maximize Your Advertising Spend" /> */}

      <div className="mockup-browser border border-base-300">
        <div className="mockup-browser-toolbar">
          <div className="input border border-base-300">https://daisyui.com</div>
        </div>
        <div className="flex justify-center px-4 py-16 border-t border-base-300">Hello!</div>
      </div>
    </div>
  );
}
