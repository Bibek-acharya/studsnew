import EventDetailsPage from "@/components/events/EventDetailsPage";

export default function EventDetailRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <EventDetailsPage params={params} />;
}
