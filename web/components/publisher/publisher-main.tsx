'use client'

import { AppHero } from "../ui/ui-layout";
import { useWallet } from "@solana/wallet-adapter-react";
import { redirect } from "next/navigation";


export default function PublisherMain() {

    const { publicKey } = useWallet();

    if (publicKey) {
        return redirect(`/publisher/home`);
     }

     return(
        <div>
            <AppHero title = "No Wallet" subtitle = "No wallet"/>
        </div>
     )

}