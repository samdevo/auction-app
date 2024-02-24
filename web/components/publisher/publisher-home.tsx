'use client'

import { useWallet } from "@solana/wallet-adapter-react";
import { useAuctionSpaceInitMethods } from "../auction-space/auction-space-data-access";
import { redirect } from "next/navigation";


export default function PublisherHome() {

    const { publicKey } = useWallet();

    if (!publicKey) {
        return redirect(`/advertiser`)
    }

    const { publisher, newPublisher } = useAuctionSpaceInitMethods()

    if (publisher.isLoading) {
        return(
            <h1>
                Loading
            </h1>
        )
    } else if(publisher.data) {
        
        return(
            <h1>
                Advertiser
            </h1>
        )
    }

    return(
        <button onClick={() => newPublisher.mutateAsync()}>
            <h1>Create Account</h1>
        </button>
    )

}