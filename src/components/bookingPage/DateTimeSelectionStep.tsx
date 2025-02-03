import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { format, addDays, isSameDay, subDays, isBefore, startOfDay, getDay } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { appointmentService } from '../../services/appointment.service';
import { useBarbers } from '../../hooks/useBarbers';
import LoadingSpinner from '../common/LoadingSpinner';

// Interface for component props
interface DateTimeSelectionStepProps {
  selectedDate: string;
  selectedTime: string;
  branchId: string;
  barberId: string;
  serviceDuration: number;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

// Main component
export default function DateTimeSelectionStep({
  selectedDate,
  selectedTime,
  branchId,
  barberId,
  serviceDuration,
  onSelectDate,
  onSelectTime
}: DateTimeSelectionStepProps) {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { barbers } = useBarbers();

  // Get selected barber
  const selectedBarber = useMemo(() => barbers.find(b => b.id === barberId), [barbers, barberId]);

  // Define all possible time slots
  const allTimeSlots = useMemo(() => [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ], []);

  // Check if a time is within working hours
  const isWithinWorkingHours = useCallback((time: string): boolean => {
    if (!selectedBarber?.workingHours?.[0]?.start || !selectedBarber?.workingHours?.[1]?.end) {
      return false;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const [startHours, startMinutes] = selectedBarber.workingHours[0].start.split(':').map(Number);
    const [endHours, endMinutes] = selectedBarber.workingHours[1].end.split(':').map(Number);

    const timeValue = hours * 60 + minutes;
    const startValue = startHours * 60 + startMinutes;
    const endValue = endHours * 60 + endMinutes;

    return timeValue >= startValue && timeValue <= endValue;
  }, [selectedBarber]);

  // Check if a time is during a break
  const isDuringBreak = useCallback((time: string): boolean => {
    if (!selectedBarber?.breaks) return false;

    const [hours, minutes] = time.split(':').map(Number);
    const timeValue = hours * 60 + minutes;

    return selectedBarber.breaks.some((breakTime, index) => {
      if (index % 2 === 0 && selectedBarber.breaks[index + 1]) {
        const [startHours, startMinutes] = breakTime.start.split(':').map(Number);
        const [endHours, endMinutes] = selectedBarber.breaks[index + 1].end.split(':').map(Number);
        
        const breakStartValue = startHours * 60 + startMinutes;
        const breakEndValue = endHours * 60 + endMinutes;

        return timeValue >= breakStartValue && timeValue <= breakEndValue;
      }
      return false;
    });
  }, [selectedBarber]);

  // Check if a date is a working day
  const isWorkingDay = useCallback((date: Date): boolean => {
    if (!selectedBarber?.workingDays) return false;
    const dayOfWeek = getDay(date); // 0 = Sunday, 1 = Monday, etc.
    return selectedBarber.workingDays.includes(dayOfWeek);
  }, [selectedBarber]);

  // Generate next 7 days from the start date
  const dates = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(startDate, i))
      .filter(date => !isBefore(date, startOfDay(new Date()))), // Only show future dates
  [startDate]);

  // Navigate dates
  const handlePrevWeek = useCallback(() => {
    setStartDate(prevDate => subDays(prevDate, 7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setStartDate(prevDate => addDays(prevDate, 7));
  }, []);

  // Load available time slots when date changes
  useEffect(() => {
    if (!selectedDate || !branchId || !barberId) return;

    const loadTimeSlots = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First filter by working hours and breaks
        const slotsWithinWorkingHours = allTimeSlots.filter(time => 
          isWithinWorkingHours(time) && !isDuringBreak(time)
        );

        // Then check availability with the service
        const slots = await appointmentService.getAvailableTimeSlots(
          branchId,
          barberId,
          selectedDate,
          serviceDuration
        );

        // Combine both filters
        const availableSlots = slotsWithinWorkingHours.filter(time => 
          slots.includes(time)
        );

        setAvailableTimeSlots(availableSlots);
      } catch (err) {
        console.error('Error loading time slots:', err);
        setError('Failed to load available time slots. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isWorkingDay(new Date(selectedDate))) {
      loadTimeSlots();
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate, branchId, barberId, serviceDuration, selectedBarber, allTimeSlots, isWithinWorkingHours, isDuringBreak, isWorkingDay]);

  // Format time slot for display
  const formatTimeSlot = useCallback((time: string): string => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  }, []);

  // Check if a time slot is in the past
  const isTimeSlotInPast = useCallback((date: string, time: string): boolean => {
    if (!isSameDay(new Date(date), new Date())) return false;
    const [hours, minutes] = time.split(':');
    const slotTime = new Date();
    slotTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return isBefore(slotTime, new Date());
  }, []);

  // Get reason why time slot is not available
  const getUnavailabilityReason = useCallback((date: string, time: string): string => {
    if (isPast(date, time)) return 'Past';
    if (!isWorkingDay(new Date(date))) return 'Not a working day';
    if (!isWithinWorkingHours(time)) return 'Outside working hours';
    if (isDuringBreak(time)) return 'Break time';
    return 'Unavailable';
  }, [isWorkingDay, isWithinWorkingHours, isDuringBreak]);

  // Check if time is past
  const isPast = useCallback((date: string, time: string): boolean => {
    return selectedDate ? isTimeSlotInPast(date, time) : false;
  }, [selectedDate, isTimeSlotInPast]);

  if (error) {
    return (
      <div 
        className="p-4 rounded-lg text-center"
        style={{ backgroundColor: theme.colors.status.error, color: theme.colors.text.primary }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 
        className="text-xl font-semibold mb-4"
        style={{ color: theme.colors.text.primary }}
      >
        Select Date & Time
      </h2>

      {/* Date Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 
            className="text-lg font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            {format(startDate, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevWeek}
              className="p-2 rounded-full hover:opacity-80 transition-opacity"
              style={{ backgroundColor: theme.colors.background.secondary }}
              disabled={isSameDay(startDate, new Date())}
            >
              <FaChevronLeft style={{ color: theme.colors.text.primary }} />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 rounded-full hover:opacity-80 transition-opacity"
              style={{ backgroundColor: theme.colors.background.secondary }}
            >
              <FaChevronRight style={{ color: theme.colors.text.primary }} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dates.map(date => {
            const isWorkDay = isWorkingDay(date);
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => onSelectDate(date.toISOString())}
                className={`p-2 rounded-lg flex flex-col items-center ${
                  selectedDate && isSameDay(new Date(selectedDate), date)
                    ? 'ring-2 ring-accent'
                    : ''
                }`}
                style={{ 
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  opacity: !isWorkDay || isBefore(date, startOfDay(new Date())) ? 0.5 : 1,
                  cursor: !isWorkDay ? 'not-allowed' : 'pointer'
                }}
                disabled={!isWorkDay || isBefore(date, startOfDay(new Date()))}
                title={!isWorkDay ? 'Not a working day' : undefined}
              >
                <span className="text-xs" style={{ color: theme.colors.text.secondary }}>
                  {format(date, 'EEE')}
                </span>
                <span className="text-lg font-medium">
                  {format(date, 'd')}
                </span>
                {!isWorkDay && (
                  <span className="text-xs mt-1" style={{ color: theme.colors.text.secondary }}>
                    Off
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <h3 
          className="text-lg font-medium mb-4"
          style={{ color: theme.colors.text.primary }}
        >
          Available Times
        </h3>
        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {allTimeSlots.map(time => {
              const isAvailable = availableTimeSlots.includes(time);
              const isPastTime = selectedDate ? isTimeSlotInPast(selectedDate, time) : false;
              const isDisabled = !isAvailable || isPastTime;
              const unavailabilityReason = getUnavailabilityReason(selectedDate, time);

              return (
                <button
                  key={time}
                  onClick={() => !isDisabled && onSelectTime(time)}
                  className={`py-2 px-4 rounded-lg transition-all ${
                    selectedTime === time ? 'ring-2 ring-accent' : ''
                  }`}
                  style={{ 
                    backgroundColor: theme.colors.background.secondary,
                    color: theme.colors.text.primary,
                    opacity: isDisabled ? 0.5 : 1,
                    cursor: isDisabled ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isDisabled}
                  title={isDisabled ? unavailabilityReason : undefined}
                >
                  {formatTimeSlot(time)}
                  {isDisabled && (
                    <div className="text-xs mt-1" style={{ color: theme.colors.text.secondary }}>
                      {unavailabilityReason}
                    </div>
                  )}
                </button>
              );
            })}
            {selectedDate && !isLoading && (
              !isWorkingDay(new Date(selectedDate)) ? (
                <div 
                  className="col-span-3 text-center py-4"
                  style={{ color: theme.colors.text.secondary }}
                >
                  This is not a working day for the selected barber.
                </div>
              ) : availableTimeSlots.length === 0 ? (
                <div 
                  className="col-span-3 text-center py-4"
                  style={{ color: theme.colors.text.secondary }}
                >
                  No available time slots for this date.
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
