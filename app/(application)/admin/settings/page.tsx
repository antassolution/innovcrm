"use client";

import { useState, useEffect } from "react";
import { SystemSettings } from "@/types";
import { settingsService } from "@/services/settingsService";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SettingsForm settings={settings} onSuccess={loadSettings} />
    </div>
  );
}