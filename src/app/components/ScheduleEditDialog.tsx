import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AgentEvent } from './ScheduleCalendar';
import { format } from 'date-fns';

interface ScheduleEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: AgentEvent) => void;
  onDelete: (id: string) => void;
  initialEvent?: AgentEvent;
  selectedSlot?: { start: Date; end: Date } | null;
}

export function ScheduleEditDialog({ isOpen, onClose, onSave, onDelete, initialEvent, selectedSlot }: ScheduleEditDialogProps) {
  const [title, setTitle] = useState('');
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly'>('none');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('#3b82f6'); // default blue

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setRecurrence(initialEvent.recurrence);
      setStartDate(format(initialEvent.start, 'yyyy-MM-dd'));
      setStartTime(format(initialEvent.start, 'HH:mm'));
      setEndDate(format(initialEvent.end, 'yyyy-MM-dd'));
      setEndTime(format(initialEvent.end, 'HH:mm'));
      setColor(initialEvent.color || '#3b82f6');
    } else if (selectedSlot) {
      setTitle('');
      setRecurrence('none');
      setStartDate(format(selectedSlot.start, 'yyyy-MM-dd'));
      setStartTime(format(selectedSlot.start, 'HH:mm'));
      setEndDate(format(selectedSlot.end, 'yyyy-MM-dd'));
      setEndTime(format(selectedSlot.end, 'HH:mm'));
      setColor('#3b82f6');
    }
  }, [initialEvent, selectedSlot, isOpen]);

  const handleSave = () => {
    if (!title) return;

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const newEvent: AgentEvent = {
      id: initialEvent?.id || Math.random().toString(36).substring(7),
      title,
      start,
      end,
      recurrence,
      color,
    };

    onSave(newEvent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialEvent ? 'Edit Agent Schedule' : 'Add Agent Schedule'}</DialogTitle>
          <DialogDescription>
            Configure when this agent rule should run.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task / Rule Name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Data Sync"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Recurrence</Label>
            <Select value={recurrence} onValueChange={(val: any) => setRecurrence(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Does not repeat</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Color Tag</Label>
            <div className="flex gap-2">
              {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((c) => (
                <button
                  key={c}
                  className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between items-center sm:justify-between">
          {initialEvent ? (
            <Button variant="destructive" onClick={() => onDelete(initialEvent.id)}>
              Delete
            </Button>
          ) : <div></div>}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
