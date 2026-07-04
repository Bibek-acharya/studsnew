"use client";

import dynamic from "next/dynamic";
import L from "leaflet";

const ClusterGroup = dynamic(
  () => import("react-leaflet-cluster").then((m) => ({ default: m.default })),
  { ssr: false },
);

const clusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div style="background-color: #0000ff; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 2px solid white;">${count}</div>`,
    className: "",
    iconSize: L.point(36, 36),
  });
};

export default function MarkerCluster({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClusterGroup
      chunkedLoading
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
      maxClusterRadius={50}
      iconCreateFunction={clusterIcon}
    >
      {children}
    </ClusterGroup>
  );
}
