import React from "react";

interface Props {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: Props) {
  return (
    <header className="h-26 border-b border-[#D7D7D7] flex flex-col justify-center px-8">
      <h1 className="text-[28px] font-semibold text-black">{title}</h1>
      <p className="text-[14px] text-black font-medium">{subtitle}</p>
    </header>
  );
}
