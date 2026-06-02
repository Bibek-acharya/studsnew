"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";

const EmptyTabState = ({ tabName }: { tabName: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FolderOpen className="w-32 h-32 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg font-medium mb-6">No {tabName} information is currently available.</p>
      <Link
        href="/"
        className="bg-[#0000ff] hover:bg-[#0000cc] cursor-pointer text-white font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
      >
        Explore More
      </Link>
    </div>
  );
};

export default EmptyTabState;
