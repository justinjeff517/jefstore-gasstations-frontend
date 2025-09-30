"use client";

import { useParams } from "next/navigation";

export default function Page(){
    const params = useParams();
    return (
        <div>
            <h1>Dispenser {params.id} Create</h1>
        </div>
    )
}