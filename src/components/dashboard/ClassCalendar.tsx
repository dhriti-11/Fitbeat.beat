"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { ClassEvent, LeaveRequest } from "@/lib/types";

export function ClassCalendar({
  events,
  leaveRequests = [],
}: {
  events: ClassEvent[];
  leaveRequests?: LeaveRequest[];
}) {
  const fcEvents = events.map((e) => {
    const leave = leaveRequests.find((r) => r.classId === e.id);
    const color =
      leave?.status === "approved"
        ? "#64748b"
        : leave?.status === "pending"
          ? "#FFA94D"
          : leave?.status === "denied"
            ? "#1E6FD9"
            : "#1E6FD9";

    return {
      id: e.id,
      title: leave ? `${e.name} (${leave.status})` : e.name,
      start: e.datetime,
      url: e.zoom || undefined,
      backgroundColor: color,
      borderColor: "#F5821F",
    };
  });

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
      {leaveRequests.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-[#8FA9C7]">
          <span><span className="inline-block h-2 w-2 rounded-full bg-[#FFA94D] mr-1" />Leave pending</span>
          <span><span className="inline-block h-2 w-2 rounded-full bg-[#64748b] mr-1" />Leave approved</span>
          <span><span className="inline-block h-2 w-2 rounded-full bg-[#1E6FD9] mr-1" />Scheduled</span>
        </div>
      )}
    </div>
  );
}
