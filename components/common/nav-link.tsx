'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {cn}from "@/lib/utils";
import { usePathname } from 'next/navigation';


const NavLink = ({
  href,
  children,
  className
}:{
  href:string;
  children:React.ReactNode;
  className?:string;
}) => {

  const [isMounted,setIsMounted] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href || (href!== '/' && pathname.startsWith(href));
  
  useEffect(()=>{
    setIsMounted(true);
  })
  return (
    <Link  href={href} className={cn(
      'nav-link',
      className,
      isActive && "text-rose-600"

    )}>
      {children}
    </Link>
  )
}

export default NavLink