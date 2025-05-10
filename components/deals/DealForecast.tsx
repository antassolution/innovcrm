"use client";

import { useEffect, useState } from "react";
import { Deal } from "@/types";
import { dealService } from "@/services/dealService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DealForecastProps {
  deals: Deal[];
}

interface ForecastData {
  totalValue: number;
  weightedValue: number;
  byStage: { stage: string; count: number; value: number }[];
}

export function DealForecast({ deals }: DealForecastProps) {
  const [forecast, setForecast] = useState<ForecastData | null>(null);

  useEffect(() => {
    const loadForecast = async () => {
      const data = await dealService.getForecast();
      setForecast(data);
    };
    loadForecast();
  }, [deals]);

  if (!forecast) {
    return null;
  }

  const chartData = forecast.byStage.map((stage) => ({
    name: stage?.stage?.charAt(0).toUpperCase() + stage?.stage?.slice(1),
    value: stage.value,
    count: stage.count,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-2xl font-bold">
                  ${forecast.totalValue.toLocaleString()}
                </p>
              </div>
              {/* <Progress value={100} className="mt-2" /> */}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Weighted Value</p>
                <p className="text-2xl font-bold">
                  ${forecast.weightedValue.toLocaleString()}
                </p>
              </div>
              {/* <Progress
                value={forecast.weightedValue? (forecast.weightedValue / forecast.totalValue) * 100:0}
                className="mt-2"
              /> */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                />
                <Bar dataKey="value" fill="#0A4DAA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}