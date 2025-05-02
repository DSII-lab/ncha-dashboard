'use client';

import { Link } from "@heroui/link";
import { Navbar, NavbarContent, NavbarItem, NavbarBrand } from "@heroui/navbar";

export default function NavBar() {
  return (
    <Navbar height='6rem' maxWidth="xl">
      <NavbarBrand>
        <Link href="/">
          <img className="h-16" src="/brandeis.png" alt="School Logo" />
        </Link>
      </NavbarBrand>
    </Navbar>
  )
}