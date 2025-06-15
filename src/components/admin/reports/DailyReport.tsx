
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from "@/lib/utils";

interface DailyData {
  day: string;
  pedidos: number;
  receita: number;
}

interface DailyReportProps {
  data: DailyData[];
}

export const DailyReport = ({ data }: DailyReportProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Diários (Últimos 7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value: number) => [value, 'Pedidos']} />
            <Bar dataKey="pedidos" fill="hsl(var(--secondary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Receita Diária (Últimos 7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => formatCurrency(value as number)} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Receita']} />
            <Line type="monotone" dataKey="receita" stroke="hsl(var(--secondary))" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);
