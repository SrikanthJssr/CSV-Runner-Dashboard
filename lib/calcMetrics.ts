// lightweight metrics utilities
type Row = { [k: string]: any };

export function calculateMetrics(data: Row[]) {
  const parsed = data.map((r) => ({
    date: String(r["date"] ?? r["Date"] ?? "").trim(),
    person: String(r["person"] ?? r["Person"] ?? r["name"] ?? "").trim(),
    miles: Number(r["miles run"] ?? r["miles"] ?? r["distance"] ?? 0),
  })).filter((r) => r.date && r.person && !Number.isNaN(r.miles));

  // overall
  const milesArr = parsed.map((p) => p.miles);
  const overall = {
    avg: avg(milesArr),
    min: Math.min(...milesArr),
    max: Math.max(...milesArr),
  };

  // per person
  const perPersonMap: Record<string, number[]> = {};
  parsed.forEach((p) => {
    perPersonMap[p.person] = perPersonMap[p.person] || [];
    perPersonMap[p.person].push(p.miles);
  });
  const perPersonMetrics = Object.entries(perPersonMap).map(([name, arr]) => ({
    name,
    avg: avg(arr),
    min: Math.min(...arr),
    max: Math.max(...arr),
  })).sort((a, b) => b.avg - a.avg);

  return { overall, perPersonMetrics };
}

export function createDailySeries(data: Row[]) {
  // roll up by date
  const parsed = data.map((r) => ({
    date: String(r["date"] ?? r["Date"] ?? "").trim(),
    miles: Number(r["miles run"] ?? r["miles"] ?? r["distance"] ?? 0),
  })).filter((r) => r.date && !Number.isNaN(r.miles));

  const map: Record<string, number> = {};
  parsed.forEach((p) => {
    map[p.date] = (map[p.date] || 0) + p.miles;
  });

  // sort by date (ISO format expected)
  const series = Object.entries(map)
    .map(([date, totalMiles]) => ({ date, totalMiles }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return series;
}

function avg(arr: number[]) {
  return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
}
