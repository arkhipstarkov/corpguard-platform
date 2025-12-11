import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: '2025-12-01', violations: 5 },
  { date: '2025-12-02', violations: 10 },
  { date: '2025-12-03', violations: 7 },
];

export const ViolationsChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="violations" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);
