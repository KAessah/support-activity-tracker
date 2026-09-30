"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { day } from "@/lib/helpers/formatters";
import type { ReportTrendPoint } from "@/types/Report";

const DONE = "#178a38";
const PENDING = "#f59e0b";

export function TrendChart({ data }: { data: ReportTrendPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="doneFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={DONE} stopOpacity={0.22} />
              <stop offset="100%" stopColor={DONE} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#efefef" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => day(d, { day: "2-digit", month: "short" })}
            tick={{ fontSize: 11, fill: "#8a8a8a" }}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8a8a8a" }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#bdbdbd", strokeWidth: 1 }} />
          <Area type="monotone" dataKey="done" name="Done" stroke={DONE} strokeWidth={2} fill="url(#doneFill)" dot={false} activeDot={{ r: 4 }} />
          <Area type="monotone" dataKey="pending" name="Pending" stroke={PENDING} strokeWidth={2} strokeDasharray="5 4" fill="transparent" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

type TooltipProps = { active?: boolean; label?: string; payload?: { name: string; value: number; color: string }[] };

function ChartTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length || !label) return null;

  return (
    <div className="min-w-44 rounded-xl bg-white p-3 text-xs shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      <p className="mb-2 text-[13px] text-strong">{day(label)}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center justify-between gap-4 py-0.5 text-tertiary">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ background: p.color }} /> {p.name}
          </span>
          <span className="text-strong tabular-nums">{p.value}</span>
        </p>
      ))}
    </div>
  );
}
