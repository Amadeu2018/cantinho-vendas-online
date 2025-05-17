
import React from "react";

type MenuHeaderProps = {
  title: string;
  description: string;
};

const MenuHeader: React.FC<MenuHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold mb-3 text-cantinho-navy">{title}</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default MenuHeader;
