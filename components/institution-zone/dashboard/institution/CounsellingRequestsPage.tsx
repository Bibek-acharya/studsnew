"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CounsellingRequestsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/institution-zone/dashboard/counselling");
  }, [router]);

  return null;
};

export default CounsellingRequestsPage;
