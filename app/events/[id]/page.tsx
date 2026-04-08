import EventDetailsPage from "@/components/events/EventDetailsPage";

export default function EventDetailRoutePage({ params }: { params: Promise<{ id: string }> }) {
  return <EventDetailsPage params={params} />;
}
