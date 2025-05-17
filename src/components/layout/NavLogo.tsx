
import React from 'react';
import { Link } from 'react-router-dom';

const NavLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img
        src="/logo.png"
        alt="Cantinho Algarvio"
        className="h-10 md:h-12"
      />
    </Link>
  );
};

export default NavLogo;
