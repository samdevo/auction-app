// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { AuctionSpace } from '../target/types/auction_space';
import { IDL as AuctionSpaceIDL } from '../target/types/auction_space';
import { Program } from '@coral-xyz/anchor';


// Re-export the generated IDL and type
export { AuctionSpace, AuctionSpaceIDL };
export type AuctionSpaceProgram = Program<AuctionSpace>;

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const AUCTION_SPACE_PROGRAM_ID = new PublicKey(
  'E7ZeDdX2S941EaMtvvTcdK5ghJonB4PCLZ9MTdq2wvVA'
);

// This is a helper function to get the program ID for the AuctionSpace program depending on the cluster.
export function getAuctionSpaceProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
      // You only need to update this if you deploy your program on one of these clusters.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg');
    default:
      return AUCTION_SPACE_PROGRAM_ID;
  }
}



// get all accouts of type Publisher
export function getPublishers(program: AuctionSpaceProgram) {
  return program.account.publisher.all();
}

export function getPublisher(program: AuctionSpaceProgram, publicKey: PublicKey) {
  return program.account.publisher.fetchNullable(publicKey);
}

// export f
