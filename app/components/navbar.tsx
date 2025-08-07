'use client';

import { Link } from "@heroui/link";
import { Navbar, NavbarContent, NavbarItem, NavbarBrand } from "@heroui/navbar";
import Image from "next/image";
import LogoImg from '@/public/brandeis.png';

export default function NavBar() {
  return (
    <Navbar height='6rem' maxWidth="xl">
      <NavbarBrand>
        <Link href="/">
          <Image className="h-16 w-auto" src={LogoImg} alt="School Logo"/>
        </Link>
      </NavbarBrand>
    </Navbar>
  )
}