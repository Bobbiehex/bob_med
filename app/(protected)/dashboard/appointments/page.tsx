"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointment Scheduling</h1>
          <p className="text-muted-foreground">
            AI-optimized scheduling with real-time conflict detection
          </p>
        </div>
        <Button
          className="bg-green-500 hover:bg-green-600"
          onClick={() => setOpen(true)}
        >
          + New Appointment
        </Button>
      </div>

      {/* Calendar + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg bg-white dark:bg-background">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="mx-auto"
          />
          <Button className="w-full mt-4" onClick={() => setOpen(true)}>
            + New Appointment
          </Button>
        </div>

        <div className="lg:col-span-2 p-4 border rounded-lg bg-white dark:bg-background flex flex-col items-center justify-center">
          {date ? (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Schedule for {date.toLocaleDateString()}
              </h2>
              <p className="text-muted-foreground">
                No appointments scheduled for this date
              </p>
              <Button className="mt-4" onClick={() => setOpen(true)}>
                + Schedule First Appointment
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">Select a date to view schedule</p>
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Appointment</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Patient */}
            <div>
              <label className="block text-sm font-medium mb-1">Patient</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient1">John Doe</SelectItem>
                  <SelectItem value="patient2">Jane Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input type="date" />
            </div>

            {/* Start & End Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <Input type="time" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <Input type="time" />
              </div>
            </div>

            {/* AI Optimized Slots */}
            <Button variant="outline" className="w-full">
              Get AI Optimized Time Slots
            </Button>

            {/* Doctor */}
            <div>
              <label className="block text-sm font-medium mb-1">Doctor</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor1">Dr. Adams</SelectItem>
                  <SelectItem value="doctor2">Dr. Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Room */}
            <div>
              <label className="block text-sm font-medium mb-1">Room</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room1">Room 101</SelectItem>
                  <SelectItem value="room2">Room 202</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reason for Visit */}
            <div>
              <label className="block text-sm font-medium mb-1">Reason for Visit</label>
              <Input placeholder="e.g., Routine checkup, Follow-up" />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <Textarea placeholder="Additional notes..." />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button className="bg-green-500 hover:bg-green-600">Create Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
