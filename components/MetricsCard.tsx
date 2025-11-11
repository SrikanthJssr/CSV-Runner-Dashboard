"use client";
import { motion } from "framer-motion";

export default function MetricsCard({ label, value, loading = false }: { label: string; value: any; loading?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700"
    >
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-800 dark:text-zinc-50">{loading ? "…" : value}</p>
    </motion.div>
  );
}
