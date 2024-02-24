'use client'

import { AppHero } from "../ui/ui-layout";
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";



export default function AdvertiserMain() {

    const { publicKey } = useWallet();

    if (publicKey) {
        return redirect(`/advertiser/home`);
     }

     return(
        <div>
            <AppHero title = "No Wallet" subtitle = "No wallet"/>
        </div>
     )

}