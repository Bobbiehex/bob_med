"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, BarChart, Activity } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState<{
    patients: number;
    appointments: number;
    waitTime: number;
    efficiency: number;
    consultationRooms: number;
    treatmentRooms: number;
    doctors: number;
    nurses: number;
  } | null>(null);

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); // ⬅️ NEW state

  // Function to randomize stats
  const randomizeStats = () => {
    return {
      patients: Math.floor(Math.random() * 30) + 10, // 10–40
      appointments: Math.floor(Math.random() * 20) + 5, // 5–25
      waitTime: Math.floor(Math.random() * 15) + 5, // 5–20 mins
      efficiency: Math.floor(Math.random() * 20) + 80, // 80–100%
      consultationRooms: Math.floor(Math.random() * 10), // 0–9
      treatmentRooms: Math.floor(Math.random() * 6), // 0–5
      doctors: Math.floor(Math.random() * 6), // 0–5
      nurses: Math.floor(Math.random() * 10), // 0–9
    };
  };

  // Initialize and update stats every 30 seconds
  useEffect(() => {
    const updateStats = () => {
      setStats(randomizeStats());
      setLastUpdated(new Date()); // ⬅️ record timestamp
    };

    updateStats(); // first load
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, Dr. Anthony Chen
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Today's Patients</p>
            <h2 className="text-2xl font-bold">{stats.patients}</h2>
            <p className="text-xs text-green-600">+2 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Appointments</p>
            <h2 className="text-2xl font-bold">{stats.appointments}</h2>
            <p className="text-xs text-muted-foreground">
              {Math.floor(stats.appointments / 3)} pending,{" "}
              {stats.appointments - Math.floor(stats.appointments / 3)} confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
            <h2 className="text-2xl font-bold">{stats.waitTime}m</h2>
            <p className="text-xs text-green-600">-3m from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Efficiency Score</p>
            <h2 className="text-2xl font-bold">{stats.efficiency}%</h2>
            <p className="text-xs text-green-600">+5% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <p className="text-xs text-muted-foreground text-right">
          Last Updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {/* AI Insights & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              AI Insights & Recommendations
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Real-time reinforcement learning optimizations
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-3 bg-green-50 border-green-200">
              <p className="font-medium flex items-center gap-2 text-green-700">
                <CheckCircle className="w-4 h-4" /> Optimal Schedule Detected
              </p>
              <p className="text-sm text-muted-foreground">
                Moving Dr. Johnson’s 2 PM appointment to 3 PM would reduce
                overall wait times by 12 minutes.
              </p>
              <Button size="sm" className="mt-2">
                Apply Suggestion
              </Button>
            </div>

            <div className="border rounded-lg p-3 bg-blue-50 border-blue-200">
              <p className="font-medium flex items-center gap-2 text-blue-700">
                <BarChart className="w-4 h-4" /> Resource Optimization
              </p>
              <p className="text-sm text-muted-foreground">
                Room 3 shows 23% higher patient satisfaction when equipped with
                tablet entertainment.
              </p>
              <Button size="sm" className="mt-2">
                View Details
              </Button>
            </div>

            <div className="border rounded-lg p-3 bg-orange-50 border-orange-200">
              <p className="font-medium flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-4 h-4" /> Capacity Alert
              </p>
              <p className="text-sm text-muted-foreground">
                Tomorrow’s schedule is 87% booked. Consider opening additional
                time slots at 4–5 PM.
              </p>
              <Button size="sm" variant="destructive" className="mt-2">
                Adjust Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <p className="text-xs text-muted-foreground">
              Common tasks and shortcuts
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              ➕ Add New Patient
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📅 Schedule Appointment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📖 View Today’s Schedule
            </Button>
            <Button variant="outline" className="w-full justify-start">
              📊 Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room Availability */}
        <Card>
          <CardHeader>
            <CardTitle>Room Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Consultation Rooms{" "}
              <span className="font-bold">
                {stats.consultationRooms}/10
              </span>
            </p>
            <Progress
              value={(stats.consultationRooms / 10) * 100}
              className="mb-3"
            />
            <p className="text-sm">
              Treatment Rooms{" "}
              <span className="font-bold">{stats.treatmentRooms}/6</span>
            </p>
            <Progress value={(stats.treatmentRooms / 6) * 100} />
          </CardContent>
        </Card>

        {/* Staff Status */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Doctors <span className="font-bold">{stats.doctors}/6 Active</span>
            </p>
            <Progress value={(stats.doctors / 6) * 100} className="mb-3" />
            <p className="text-sm">
              Nurses <span className="font-bold">{stats.nurses}/10 Active</span>
            </p>
            <Progress value={(stats.nurses / 10) * 100} />
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm flex justify-between">
              X-Ray Machines <span className="text-green-600">All Online</span>
            </p>
            <p className="text-sm flex justify-between">
              Lab Equipment <span className="text-red-600">1 Maintenance</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
