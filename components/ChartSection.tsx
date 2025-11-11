"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { useState } from "react";

export default function ChartSection({ perPerson, dailySeries, loading }: { perPerson: any[]; dailySeries: any[]; loading?: boolean }) {
  const [tab, setTab] = useState<"overview" | "trend">("overview");

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button className={`px-3 py-1 rounded ${tab === "overview" ? "bg-foreground text-background" : "bg-transparent"}`} onClick={() => setTab("overview")}>Per Person</button>
          <button className={`px-3 py-1 rounded ${tab === "trend" ? "bg-foreground text-background" : "bg-transparent"}`} onClick={() => setTab("trend")}>Daily Trend</button>
        </div>
      </div>

      <div style={{ width: "100%", height: 360 }}>
        {tab === "overview" ? (
          <ResponsiveContainer>
            <BarChart data={perPerson}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer>
            <LineChart data={dailySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalMiles" dot={false} stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
