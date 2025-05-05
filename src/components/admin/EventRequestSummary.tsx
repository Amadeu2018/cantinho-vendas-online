
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { EventRequest } from "./AdminEventRequests";
import EventClientInfo from "./EventClientInfo";
import EventRequestInfo from "./EventRequestInfo";
import EventDetailsInfo from "./EventDetailsInfo";

interface EventRequestSummaryProps {
  request: EventRequest;
  statusBadge: JSX.Element;
}

const EventRequestSummary = ({ request, statusBadge }: EventRequestSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Detalhes da Solicitação</CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Status:</div>
            {statusBadge}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <EventClientInfo request={request} />
            <Separator className="my-4" />
            <EventRequestInfo request={request} />
          </div>

          <div className="space-y-4">
            <EventDetailsInfo request={request} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventRequestSummary;
