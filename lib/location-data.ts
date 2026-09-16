import data from "./location-data.json";

export const NEPAL_PROVINCES: string[] = data.NEPAL_PROVINCES;
export const NEPAL_DISTRICTS: Record<string, string[]> = data.NEPAL_DISTRICTS;
export const NEPAL_LOCAL_BODIES: Record<string, { name: string; wards: number }[]> = data.NEPAL_LOCAL_BODIES;
