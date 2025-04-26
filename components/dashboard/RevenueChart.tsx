"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface RevenueChartProps {
  data: {
    name: string;
    revenue: number;
    count: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Format data for Recharts
  const chartData = data?.map((item) => ({
    name: item.name,
    Revenue: item.revenue,
    Deals: item.count,
  })) || [];

  // Define the chart config for tooltips and styles
  const chartConfig = {
    Revenue: {
      label: "Revenue",
      color: "#0891b2",
    },
    Deals: {
      label: "Deals",
      color: "#f59e0b",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>
          Revenue and deal count for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-[4/2] h-[350px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                fontSize={12}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value, name) => {
                      if (name === "Revenue") {
                        return [`$${value.toLocaleString()}`, name];
                      }
                      return [value, name];
                    }}
                  />
                }
              />
              <Bar
                dataKey="Revenue"
                fill="var(--color-Revenue)"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}