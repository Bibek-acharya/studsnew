import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { superadminAnalyticsApi, type HealthSnapshot } from "../../../../services/superadminAnalyticsApi";

export const HEALTH_BUFFER_SIZE = 40;

export function appendBounded(prev: HealthSnapshot[], next: HealthSnapshot, cap = HEALTH_BUFFER_SIZE): HealthSnapshot[] {
  return [...prev.slice(-(cap - 1)), next];
}

export function useLiveHealth() {
  const query = useQuery({
    queryKey: ["superadmin-analytics", "health"],
    queryFn: () => superadminAnalyticsApi.getHealth().then((res) => res.data),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });
  const [buffer, setBuffer] = useState<HealthSnapshot[]>([]);
  useEffect(() => {
    if (query.data) {
      // Rolling buffer: append each fresh poll result, drop oldest past cap.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBuffer((prev) => appendBounded(prev, query.data as HealthSnapshot));
    }
  }, [query.data]);
  return { snapshot: query.data ?? null, buffer, loading: query.isLoading, error: query.error };
}
