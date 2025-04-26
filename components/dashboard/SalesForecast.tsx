"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface SalesForecastProps {
  data: {
    name: string;
    projected: number;
    potential: number;
    count: number;
  }[];
}

export function SalesForecast({ data }: SalesForecastProps) {
  const chartConfig = {
    projected: {
      label: "Projected Revenue",
      color: "#0891b2", // cyan-600
    },
    potential: {
      label: "Potential Revenue",
      color: "#6366f1", // indigo-500
    },
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Sales Forecast</CardTitle>
        <CardDescription>
          Projected and potential revenue for the next 3 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-[16/9] h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                left: 10,
              }}
              barGap={8}
            >
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      return [`$${Number(value).toLocaleString()}`, name];
                    }}
                  />
                }
              />
              <Bar
                dataKey="projected"
                fill="var(--color-projected)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="potential"
                fill="var(--color-potential)"
                radius={[4, 4, 0, 0]}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}