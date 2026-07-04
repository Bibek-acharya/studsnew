"use client";

import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const CollegeMap = dynamic(() => import("./CollegeMap"), { ssr: false });

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export default function CollegeMapWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <CollegeMap />
    </QueryClientProvider>
  );
}
