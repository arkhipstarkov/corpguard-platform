import { Card, CardContent, Typography } from '@mui/material';

interface MetricCardProps {
  title: string;
  value: number;
}

export const MetricCard = ({ title, value }: MetricCardProps) => (
  <Card sx={{ minWidth: 200, margin: 1 }}>
    <CardContent>
      <Typography variant="subtitle1">{title}</Typography>
      <Typography variant="h5">{value}</Typography>
    </CardContent>
  </Card>
);
