'use client'

import { useWallet } from "@solana/wallet-adapter-react";
import { useAuctionSpaceInitMethods } from "../auction-space/auction-space-data-access";
import { redirect } from "next/navigation";


export default function AdvertiserHome() {

    const { publicKey } = useWallet();

    if (!publicKey) {
        return redirect(`/advertiser`)
    }

    const { advertiser, newAdvertiser } = useAuctionSpaceInitMethods()

    if (advertiser.isLoading) {
        return(
            <h1>
                Loading
            </h1>
        )
    } else if(advertiser.data) {
        
        return(
            <h1>
                Advertiser
            </h1>
        )
    }

    return(
        <button onClick={() => newAdvertiser.mutateAsync()}>
            <h1>Create Account</h1>
        </button>
    )

}