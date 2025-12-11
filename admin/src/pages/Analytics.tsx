import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Card, CardContent } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api/axios";
import { mockAnalytics, mockMetrics } from "../mock/analytics";

const MetricCard = ({ title, value }: { title: string; value: number }) => (
  <Card sx={{ minWidth: 200 }}>
    <CardContent>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5">{value}</Typography>
    </CardContent>
  </Card>
);

type MetricKeys = "users" | "violations" | "equipment";

export default function Analytics() {
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<Record<MetricKeys, number>>({
    users: 0,
    violations: 0,
    equipment: 0,
  });
  const [usingMock, setUsingMock] = useState(false);

  const load = async () => {
    try {
      const metricsRes = await api.get("/analytics/metrics"); // /analytics/metrics expected
      const chartRes = await api.get("/analytics/violations-by-month"); // expected endpoint
      setMetrics(metricsRes.data);
      setData(chartRes.data);
      setUsingMock(false);
    } catch (err) {
      setMetrics(mockMetrics);
      setData(mockAnalytics);
      setUsingMock(true);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Analytics {usingMock ? "(demo mode)" : ""}
      </Typography>

      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <MetricCard title="Total Users" value={metrics.users} />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard title="Total Violations" value={metrics.violations} />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard title="Total Equipment" value={metrics.equipment} />
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Violations by Month
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#00e5ff" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}


