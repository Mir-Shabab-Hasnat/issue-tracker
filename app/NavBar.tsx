import Link from "next/link";
import React from "react";
import { FaBug } from "react-icons/fa";

const NavBar = () => {
  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center">
      <Link href="/">
        <FaBug />
      </Link>
      <ul className="flex space-x-6">
        <li>
          <Link
            className="text-zinc-500 hover:text-zinc-800 transition-colors"
            href="/"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            className="text-zinc-500 hover:text-zinc-800 transition-colors"
            href="/issues"
          >
            Issues
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
