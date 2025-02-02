import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { format, addDays, isSameDay, subDays } from 'date-fns';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface DateTimeSelectionStepProps {
  selectedDate: string;
  selectedTime: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
}

export default function DateTimeSelectionStep({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime
}: DateTimeSelectionStepProps) {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState(new Date());

  // Generate next 7 days from the start date
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Navigate dates
  const handlePrevWeek = () => {
    setStartDate(prevDate => subDays(prevDate, 7));
  };

  const handleNextWeek = () => {
    setStartDate(prevDate => addDays(prevDate, 7));
  };

  // Available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
  ];

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
          {dates.map(date => (
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
                color: theme.colors.text.primary
              }}
            >
              <span className="text-xs" style={{ color: theme.colors.text.secondary }}>
                {format(date, 'EEE')}
              </span>
              <span className="text-lg font-medium">
                {format(date, 'd')}
              </span>
            </button>
          ))}
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
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(time => (
            <button
              key={time}
              onClick={() => onSelectTime(time)}
              className={`py-2 px-4 rounded-lg transition-all ${
                selectedTime === time ? 'ring-2 ring-accent' : ''
              }`}
              style={{ 
                backgroundColor: theme.colors.background.secondary,
                color: theme.colors.text.primary
              }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 