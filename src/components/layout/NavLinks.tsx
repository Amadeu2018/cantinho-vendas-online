
import React from 'react';
import { Link } from 'react-router-dom';

type NavLink = {
  text: string;
  to: string;
};

type NavLinksProps = {
  links: NavLink[];
};

const NavLinks = ({ links }: NavLinksProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="text-gray-700 hover:text-cantinho-terracotta transition-colors"
        >
          {link.text}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
