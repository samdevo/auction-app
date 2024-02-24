// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey, Connection, Transaction } from '@solana/web3.js';
import type { AuctionSpace } from '../target/types/auction_space';
import { IDL as AuctionSpaceIDL } from '../target/types/auction_space';
import { Program } from '@coral-xyz/anchor';
import { WalletContextState } from '@solana/wallet-adapter-react';


// Re-export the generated IDL and type
export { AuctionSpace, AuctionSpaceIDL };
export type AuctionSpaceProgram = Program<AuctionSpace>;

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const AUCTION_SPACE_PROGRAM_ID = new PublicKey(
  'E7ZeDdX2S941EaMtvvTcdK5ghJonB4PCLZ9MTdq2wvVA'
);

// create an SDK class, taking in the program
export class AuctionSpaceSDK {
  connection: Connection;
  program: AuctionSpaceProgram;
  wallet?: WalletContextState;

  constructor(connection: Connection, program: AuctionSpaceProgram, wallet?: WalletContextState) {
    this.connection = connection;
    this.program = program;
    this.wallet = wallet;
  }

  getItems(ownerKey?: PublicKey) {
    return this.program.account.item.all([
      {
        memcmp: {
          "offset": 32,
          "bytes": ownerKey.toBase58(),
        }
      }
    ]).then((items) => {
      return items.filter((item) => item.account.publisher.toBase58() === ownerKey?.toBase58());
    });
  }

  getAuctions(ownerKey?: PublicKey) {
    return this.program.account.auction.all([
      {
        memcmp: {
          "offset": 32,
          "bytes": ownerKey.toBase58(),
        }
      }
    ]).then((auctions) => {
      return auctions.filter((auction) => auction.account.publisher.toBase58() === ownerKey?.toBase58());
    });
  }

  getPublisher() {
    if (!this.wallet?.publicKey) {
      throw new Error('Wallet required');
    }
    // use findProgramAddress to get the publisher key
    const [ pda,  ] = PublicKey.findProgramAddressSync(
      [Buffer.from("publisher")],
      this.wallet.publicKey
    );
    return this.program.account.publisher.fetch(pda);
  }

  getAdvertiser() {
    if (!this.wallet?.publicKey) {
      throw new Error('Wallet required');
    }
    const [ pda,  ] = PublicKey.findProgramAddressSync(
      [Buffer.from("advertiser")],
      this.wallet.publicKey
    );
    return this.program.account.advertiser.fetch(pda);
  }

  async newPublisher() {
    if (!this.wallet?.publicKey) {
      throw new Error('Wallet required');
    }
    return this.program.methods.newPublisher()
    .accounts({
      publisherWallet: this.wallet.publicKey,
    }).transaction()
    .then((tx) => this.signAndSendTransaction(tx));
  }

  async newAdvertiser() {
    if (!this.wallet?.publicKey) {
      throw new Error('Wallet required');
    }
    return this.program.methods.newAdvertiser()
    .accounts({
      advertiserWallet: this.wallet.publicKey,
    }).transaction()
    .then((tx) => this.signAndSendTransaction(tx));
  }

  async newItem(publisher: PublicKey, title: string, url: string) {
    if (!this.wallet?.publicKey) {
      throw new Error('Wallet required');
    }
    if (publisher == null) {
      throw new Error('Publisher required');
    }
    return this.program.methods.newItem(title, url)
    .accounts({
      publisherWallet: this.wallet.publicKey,
      publisher: publisher
    }).transaction()
    .then((tx) => this.signAndSendTransaction(tx));
  }

  async newAuction(
    publisher: PublicKey,
    item: PublicKey,
    minBid: number,
    auctionStart: Date,
    auctionEnd: Date,
    effectStart: Date,
    effectEnd: Date,
  ) {
    if (!this.wallet?.publicKey) {
      throw new Error('Wallet required');
    }
    return this.program.methods.newAuction(
      item,
      new anchor.BN(minBid),
      new anchor.BN(auctionStart.getTime() / 1000),
      new anchor.BN(auctionEnd.getTime() / 1000),
      new anchor.BN(effectStart.getTime() / 1000),
      new anchor.BN(effectEnd.getTime() / 1000),
    )
    .accounts({
      publisherWallet: this.wallet.publicKey,
      publisher: publisher,
    }).transaction()
    .then((tx) => this.signAndSendTransaction(tx));
  }

  private async signAndSendTransaction(tx: Transaction) {
    tx.feePayer = this.wallet.publicKey;
    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
    const signedTx = await this.wallet.signTransaction(tx);
    return this.connection.sendRawTransaction(signedTx.serialize());
  }
}


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
