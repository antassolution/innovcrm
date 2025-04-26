"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

interface PipelineChartProps {
  data: {
    name: string;
    value: number;
    count: number;
  }[];
}

export function PipelineChart({ data }: PipelineChartProps) {
  // Set of colors for the different pipeline stages
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Calculate total value
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  // Define the chart config for tooltips and styles
  const chartConfig = data.reduce((config, item, index) => {
    return {
      ...config,
      [item.name]: {
        label: item.name,
        color: COLORS[index % COLORS.length],
      },
    };
  }, {});
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Distribution</CardTitle>
        <CardDescription>Current deal value by pipeline stage</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[300px]">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={1}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        return [
                          `$${Number(value).toLocaleString()}`,
                          name,
                        ];
                      }}
                    />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        <div className="mt-4 grid gap-2">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="mr-2 h-3 w-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm">{entry.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">${entry.value.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">
                  ({Math.round((entry.value / total) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}