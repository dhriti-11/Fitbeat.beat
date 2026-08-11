"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { ClassEvent } from "@/lib/types";

// FullCalendar base styles (minimal inline fallback + FC defaults via wrapper)

export function ClassCalendar({ events }: { events: ClassEvent[] }) {
  const fcEvents = events.map((e) => ({
    id: e.id,
    title: e.name,
    start: e.datetime,
    url: e.zoom || undefined,
    backgroundColor: "#1E6FD9",
    borderColor: "#F5821F",
  }));

  return (
    <div className="glass rounded-2xl p-4 [&_.fc]:text-[#F3EFFF] [&_.fc-button]:bg-[#1E6FD9] [&_.fc-button]:border-none [&_.fc-col-header-cell]:text-[#8FA9C7]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" }}
        events={fcEvents}
        height="auto"
        eventClick={(info) => {
          if (info.event.url) {
            info.jsEvent.preventDefault();
            window.open(info.event.url, "_blank");
          }
        }}
      />
    </div>
  );
}
