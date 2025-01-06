import React, { useState, useEffect, useMemo, useCallback } from 'react';
import moment from 'moment-timezone';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { CalendarIcon, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

interface SchedulerProps {
    schedule: React.InputHTMLAttributes<HTMLInputElement>;
    onChange: (dateStr: string) => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ schedule, onChange }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    // Initialize state
    const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());
    const [date, setDate] = useState<Date | undefined>(() => {
        const scheduleValue = schedule.value;
        return scheduleValue ? new Date(scheduleValue as string) : undefined;
    });
    const [hour, setHour] = useState(() => {
        const scheduleValue = schedule.value;
        return scheduleValue ? moment(scheduleValue as string).format('HH') : "12";
    });
    const [minute, setMinute] = useState(() => {
        const scheduleValue = schedule.value;
        return scheduleValue ? moment(scheduleValue as string).format('mm') : "00";
    });
    // Memoize hours and minutes arrays
    const hours = useMemo(() =>
        Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')),
        []
    );

    // Only show every 5 minutes to reduce options
    const minutes = useMemo(() =>
        Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0')),
        []
    );

    // Memoize update function
    const updateDateTime = useCallback((
        newDate: Date | undefined,
        newHour: string,
        newMinute: string,
        timezone: string
    ) => {
        if (!newDate) {
            onChange('');
            return;
        }

        const dateTime = moment.tz(newDate, timezone)
            .hour(parseInt(newHour, 10))
            .minute(parseInt(newMinute, 10))
            .second(0)
            .millisecond(0);

        onChange(dateTime.utc().toISOString());
    }, [onChange]);

    // Batch update time changes
    useEffect(() => {
        if (date) {
            const timeoutId = setTimeout(() => {
                updateDateTime(date, hour, minute, selectedTimezone);
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [hour, minute, selectedTimezone, date, updateDateTime]);

    const formatDate = useCallback((date: Date) => {
        return moment(date).format('MMMM D, YYYY');
    }, []);


    const hoursItems = useMemo(() => (
        hours.map((h) => (
            <SelectItem key={h} value={h}>
                {h}
            </SelectItem>
        ))
    ), [hours]);

    const minutesItems = useMemo(() => (
        minutes.map((m) => (
            <SelectItem key={m} value={m}>
                {m}
            </SelectItem>
        ))
    ), [minutes]);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (isCalendarOpen && !event.target.closest('.popover-content')) {
                setIsCalendarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCalendarOpen]);


    return (
        <div className="space-y-4">
            <Popover open={isCalendarOpen} >
                <PopoverTrigger asChild>
                    <Button
                        variant="neutral"
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setIsCalendarOpen(true)}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? formatDate(date) : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 popover-content">
                    <Calendar
                        captionLayout="dropdown-buttons"
                        mode="single"
                        selected={date}
                        fromYear={2025}
                        toYear={3000}
                        onSelect={(newDate) => {
                            setDate(newDate);
                            if (newDate) {
                                updateDateTime(newDate, hour, minute, selectedTimezone);
                                setIsCalendarOpen(false)
                            }
                        }}
                        disabled={{ before: new Date() }}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            {date && (
                <div className="space-y-4">
                    <div className="w-full">
                        <div className="flex justify-center mb-2 align-middle space-x-2 items-center">
                            <Clock className="h-4 w-4" />
                            <Label className="text-sm font-medium">Time</Label>
                        </div>
                        <div className="flex items-center justify-center gap-2 w-full">
                            <Select
                                value={hour}
                                onValueChange={setHour}
                            >
                                <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Hour" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hoursItems}
                                </SelectContent>
                            </Select>

                            <span>:</span>

                            <Select
                                value={minute}
                                onValueChange={setMinute}
                            >
                                <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Minute" />
                                </SelectTrigger>
                                <SelectContent>
                                    {minutesItems}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Scheduler;