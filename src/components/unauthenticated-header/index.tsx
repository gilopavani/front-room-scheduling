"use client";
import { Wind } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

export default function UnauthenticatedHeader() {
  return (
    <div className="flex w-full h-24 items-center justify-between px-8 border-b border-[#D7D7D7] ">
      <Wind size={40} />

      <Button
        type="button"
        className="#000000 text-white p-4 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
        //   disabled={isLoading}
      >
        {/* {isLoading && (
            <span className="w-4 h-4 border-2 border-t-2 border-t-white border-blue-500 rounded-full animate-spin"></span>
          )} */}
        Cadastre-se
      </Button>
    </div>
  );
}
