"use client";

import { useCallback, useMemo, useState } from "react";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { ThemeToggle } from "@/components/theme-toggle";

type RowData = Record<string, string | number>;

const normalizeHeader = (header: string): string =>
  header.trim().toLowerCase().replace(/[_\s]+/g, " ");

export default function Page() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** Reset all */
  const reset = useCallback(() => {
    setRows([]);
    setProgress(null);
    setError(null);
  }, []);

  /** CSV Upload */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    reset();
    setProgress(0);

    Papa.parse<RowData>(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      step: (result) => {
        const data: Record<string, any> = {};
        for (const key in result.data) {
          const normalizedKey = normalizeHeader(key);
          data[normalizedKey] = result.data[key];
        }
        setRows((prev) => [...prev, data]);
      },
      complete: (results) => {
        const headers = results.meta.fields?.map((h) => normalizeHeader(h)) ?? [];
        const required = ["date", "person", "miles run"];
        const missing = required.filter((r) => !headers.includes(r));
        if (missing.length) {
          setError(`❌ Missing headers: ${missing.join(", ")}`);
          return;
        }
        setProgress(100);
        setTimeout(() => setProgress(null), 800);
      },
      error: (err) => setError(`Parsing error: ${err.message}`),
    });
  };

  /** Metrics */
  const metrics = useMemo(() => {
    if (!rows.length) return null;
    const runs = rows.map((r) => parseFloat(r["miles run"] as string));
    const validRuns = runs.filter((n) => !isNaN(n));
    if (!validRuns.length) return null;
    const total = validRuns.reduce((a, b) => a + b, 0);
    const avg = total / validRuns.length;
    const max = Math.max(...validRuns);
    const min = Math.min(...validRuns);
    return { total, avg, max, min };
  }, [rows]);

  /** Group by person */
  const perPersonData = useMemo(() => {
    if (!rows.length) return [];
    const grouped: Record<string, number[]> = {};
    rows.forEach((r) => {
      const person = (r.person || r["person"])?.toString().trim();
      const miles = parseFloat(r["miles run"] as string);
      if (!person || isNaN(miles)) return;
      grouped[person] = grouped[person] ? [...grouped[person], miles] : [miles];
    });
    return Object.entries(grouped).map(([name, values]) => ({
      name,
      avg: +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
      max: Math.max(...values),
      min: Math.min(...values),
    }));
  }, [rows]);

  /** Daily trend */
  const dailyTrend = useMemo(() => {
    if (!rows.length) return [];
    const grouped: Record<string, number> = {};
    rows.forEach((r) => {
      const date = (r.date || r["date"])?.toString().trim();
      const miles = parseFloat(r["miles run"] as string);
      if (!date || isNaN(miles)) return;
      grouped[date] = (grouped[date] || 0) + miles;
    });
    return Object.entries(grouped).map(([date, miles]) => ({ date, miles }));
  }, [rows]);

  /** Export handlers */
  const exportCSV = () => {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "runner_data.csv";
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("🏃 CSV Runner Dashboard Report", 14, 16);
    if (metrics) {
      doc.text(`Total Miles: ${metrics.total.toFixed(2)}`, 14, 26);
      doc.text(`Average Miles: ${metrics.avg.toFixed(2)}`, 14, 34);
      doc.text(`Max Miles: ${metrics.max.toFixed(2)}`, 14, 42);
      doc.text(`Min Miles: ${metrics.min.toFixed(2)}`, 14, 50);
    }
    autoTable(doc, {
      head: [Object.keys(rows[0] || {})],
      body: rows.map((r) => Object.values(r)),
      startY: 60,
    });
    doc.save("Runner_Report.pdf");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-400">
            🏃 CSV Runner Dashboard
          </h1>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 text-white hover:scale-105 hover:shadow-lg transition-all"
          >
            🧹 Clear Data
          </Button>

          <label htmlFor="csv-upload">
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white hover:scale-105 hover:shadow-lg transition-all"
            >
              <span>📤 Upload CSV</span>
            </Button>
            <input id="csv-upload" type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </label>

          {rows.length > 0 && (
            <>
              <Button
                onClick={exportCSV}
                className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 text-white hover:scale-105 hover:shadow-lg transition-all"
              >
                💾 Export CSV
              </Button>
              <Button
                onClick={exportPDF}
                className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white hover:scale-105 hover:shadow-lg transition-all"
              >
                🧾 Export PDF
              </Button>
            </>
          )}
        </div>

        {/* Progress or Error */}
        {error && (
          <Alert variant="destructive" className="backdrop-blur-lg bg-red-500/10 border-red-400/30">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {progress !== null && <Progress value={progress} className="h-2" />}

        {/* Summary Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              ["Total Miles", metrics.total.toFixed(2), "from-green-400 to-emerald-600"],
              ["Average Miles", metrics.avg.toFixed(2), "from-cyan-400 to-blue-600"],
              ["Max Miles", metrics.max.toFixed(2), "from-amber-400 to-orange-500"],
              ["Min Miles", metrics.min.toFixed(2), "from-pink-400 to-rose-600"],
            ].map(([label, value, gradient], i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 * i, duration: 0.4 }}
              >
                <Card
                  className={`backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg hover:shadow-2xl transition-all text-center p-4 rounded-2xl`}
                >
                  <CardHeader>
                    <CardTitle className={`text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-3xl font-bold">{value}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tabs Section */}
        {!!perPersonData.length && (
          <Tabs defaultValue="people" className="w-full">
            <TabsList className="mb-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
              <TabsTrigger value="people">Per Person</TabsTrigger>
              <TabsTrigger value="trend">Daily Trend</TabsTrigger>
              <TabsTrigger value="data">Data Table</TabsTrigger>
            </TabsList>

            <TabsContent value="people">
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 rounded-2xl">
                <CardHeader>
                  <CardTitle>Average Miles per Person</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={perPersonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip />
                      <Bar dataKey="avg" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trend">
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 rounded-2xl">
                <CardHeader>
                  <CardTitle>Daily Miles Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip />
                      <Line type="monotone" dataKey="miles" stroke="#22d3ee" strokeWidth={3} dot={{ r: 5, fill: "#38bdf8" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="data">
              <Card className="backdrop-blur-lg bg-white/10 border border-white/20 p-4 rounded-2xl">
                <CardHeader>
                  <CardTitle>Uploaded Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto max-h-[400px] rounded-lg">
                    <table className="w-full text-sm border-collapse">
                      <thead className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                        <tr>
                          {Object.keys(rows[0] || {}).map((header) => (
                            <th key={header} className="px-4 py-2 text-left font-semibold">
                              {header.toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, i) => (
                          <tr
                            key={i}
                            className={`hover:bg-white/20 transition ${
                              i % 2 ? "bg-white/10" : "bg-transparent"
                            }`}
                          >
                            {Object.keys(row).map((key) => (
                              <td key={key} className="px-4 py-2">
                                {row[key] as string}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!rows.length && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-200 mt-16"
          >
            <p className="text-lg">
              📁 Upload a CSV file with headers: <code>date</code>, <code>person</code>, <code>miles run</code>
            </p>
            <p className="text-sm mt-2">
              Tip: Generate mock data using{" "}
              <a href="https://mockaroo.com/" target="_blank" rel="noopener noreferrer" className="underline text-cyan-400">
                Mockaroo
              </a>
            </p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
