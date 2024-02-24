'use client';

import { AuctionSpaceIDL, getAuctionSpaceProgramId, AuctionSpaceSDK } from '@auction-app/solana';
import { Program } from '@coral-xyz/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useAuctionSpaceProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  // const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getAuctionSpaceProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = new Program(AuctionSpaceIDL, programId, provider);

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });



  // const sdk = new AuctionSpaceSDK(connection, program)
  // const publishers = useQuery({
  //   queryKey: ['AuctionSpace', 'all', { cluster }],
  //   queryFn: () => program.account.auction.all(),
  // });

  // const items = useQuery({
  //   queryKey: ['AuctionSpace', 'all', { cluster }],
  //   queryFn: (ownedByPubKey) => {
  //     return program.account.item.all([
  //       {
  //         memcmp: {
  //           "offset": 0,
  //           "bytes": ownedByPubKey.toBase58(),
  //         }
  //       }
  //     ])
  //   },
  // });

  // const initAdvertiser

  return {
    program,
    programId,
    getProgramAccount,
  };
}

export function useAuctionSpaceInitMethods() {
  const wallet = useWallet();
  const { program } = useAuctionSpaceProgram();
  const { connection } = useConnection();
  const transactionToast = useTransactionToast();

  if (!wallet.publicKey) {
    throw new Error('Wallet required for useAuctionSpaceWithWallet');
  }

  const sdk = new AuctionSpaceSDK(connection, program, wallet);

  const publisher = useQuery({
    queryKey: ['publisher', 'fetch', wallet.publicKey],
    queryFn: () => sdk.getPublisher(),
  });

  const newPublisher = useMutation({
    mutationKey: ['publisher', 'create', wallet.publicKey],
    mutationFn: () => sdk.newPublisher(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return publisher.refetch();
    },
  });

  const advertiser = useQuery({
    queryKey: ['advertiser', 'fetch', wallet.publicKey],
    queryFn: () => sdk.getAdvertiser(),
  });

  const newAdvertiser = useMutation({
    mutationKey: ['advertiser', 'create', wallet.publicKey],
    mutationFn: () => sdk.newAdvertiser(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return advertiser.refetch();
    },
  });

  return {
    publisher,
    newPublisher,
    advertiser,
    newAdvertiser,
  };
}

export function useAuctionSpaceProgramAccount({ counter }: { counter: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useAuctionSpaceProgram();

  const account = useQuery({
    queryKey: ['counter', 'fetch', { cluster, counter }],
    queryFn: () => program.account.counter.fetch(counter),
  });

  const close = useMutation({
    mutationKey: ['counter', 'close', { cluster, counter }],
    mutationFn: () =>
      program.methods.closeAuctionSpace().accounts({ counter }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrement = useMutation({
    mutationKey: ['counter', 'decrement', { cluster, counter }],
    mutationFn: () => program.methods.decrement().accounts({ counter }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return account.refetch();
    },
  });

  const increment = useMutation({
    mutationKey: ['counter', 'increment', { cluster, counter }],
    mutationFn: () => program.methods.increment().accounts({ counter }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return account.refetch();
    },
  });

  const set = useMutation({
    mutationKey: ['counter', 'set', { cluster, counter }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ counter }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return account.refetch();
    },
  });

  return {
    account,
    close,
    decrement,
    increment,
    set,
  };
}
