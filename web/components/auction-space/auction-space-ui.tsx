'use client';

import { Keypair, PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useAuctionSpaceProgram,
  useAuctionSpaceProgramAccount,
} from './auction-space-data-access';

export function AuctionSpaceCreate() {
  const { initPublisher } = useAuctionSpaceProgram();


  const initialize = initPublisher;// FIXME

  return (
    <button
      className="btn btn-xs lg:btn-md btn-primary"
      onClick={() => initialize.mutateAsync(Keypair.generate())}
      disabled={initialize.isPending}
    >
      Create {initialize.isPending && '...'}
    </button>
  );
}

export function AuctionSpaceList() {
  const { accounts, getProgramAccount } = useAuctionSpaceProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <AuctionSpaceCard
              key={account.publicKey.toString()}
              counter={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No AuctionSpaces</h2>
          No counters found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function AuctionSpaceCard({ counter }: { counter: PublicKey }) {
  const { account, increment, set, decrement, close } =
    useAuctionSpaceProgramAccount({
      counter,
    });

  const count = useMemo(() => account.data?.count ?? 0, [account.data?.count]);

  return account.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-bordered border-base-300 border-4 text-neutral-content">
      <div className="card-body items-center text-center">
        <div className="space-y-6">
          <h2
            className="card-title justify-center text-3xl cursor-pointer"
            onClick={() => account.refetch()}
          >
            {count}
          </h2>
          <div className="card-actions justify-around">
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => increment.mutateAsync()}
              disabled={increment.isPending}
            >
              Increment
            </button>
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => {
                const value = window.prompt(
                  'Set value to:',
                  count.toString() ?? '0'
                );
                if (
                  !value ||
                  parseInt(value) === count ||
                  isNaN(parseInt(value))
                ) {
                  return;
                }
                return set.mutateAsync(parseInt(value));
              }}
              disabled={set.isPending}
            >
              Set
            </button>
            <button
              className="btn btn-xs lg:btn-md btn-outline"
              onClick={() => decrement.mutateAsync()}
              disabled={decrement.isPending}
            >
              Decrement
            </button>
          </div>
          <div className="text-center space-y-4">
            <p>
              <ExplorerLink
                path={`account/${counter}`}
                label={ellipsify(counter.toString())}
              />
            </p>
            <button
              className="btn btn-xs btn-secondary btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    'Are you sure you want to close this account?'
                  )
                ) {
                  return;
                }
                return close.mutateAsync();
              }}
              disabled={close.isPending}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
