import React from "react";

interface headerProps {
  title: string;
}

export const Header = ({ title }: headerProps) => {
  return (
    <header className="fixed h-10 w-screen left-0 top-0 bg-slate-800 px-5 flex items-center z-50">
      <label className="text-white text-lg font-bold">{title}</label>
    </header>
  );
};
