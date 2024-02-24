'use client';

import { AuctionSpaceIDL, getAuctionSpaceProgramId } from '@auction-app/solana';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
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
