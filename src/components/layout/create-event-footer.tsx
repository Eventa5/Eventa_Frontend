"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CreateEventFooter = () => {
  return (
    <div className="mt-auto w-full">
      {/* 版權信息 */}
      <div className="bg-black text-center py-4 w-full">
        <p className="text-white text-sm font-light tracking-wider">
          © Copyright 2025 EVENTA. All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default CreateEventFooter;
