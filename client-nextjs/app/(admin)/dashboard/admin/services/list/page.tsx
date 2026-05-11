"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginModal(){
    const router = useRouter();

   useEffect(()=>{
         router.push("/dashboard/admin/services");
   });
   
}