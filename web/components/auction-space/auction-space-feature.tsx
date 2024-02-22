'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useAuctionSpaceProgram } from './auction-space-data-access';
import { AuctionSpaceCreate, AuctionSpaceList } from './auction-space-ui';

export default function AuctionSpaceFeature() {
  const { publicKey } = useWallet();
  const { programId } = useAuctionSpaceProgram();

  return publicKey ? (
    <div>
      <AppHero
        title="AuctionSpace"
        subtitle={
          'You can create a new counter by clicking the "Create" button. The state of a counter is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
        </p>
        <AuctionSpaceCreate />
      </AppHero>
      <AuctionSpaceList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
