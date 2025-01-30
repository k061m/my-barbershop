import { useTheme } from '../../contexts/ThemeContext';

interface DateTimeSelectionModalProps {
  selectedDate: string;
  selectedTime: string;
  availableDates: Date[];
  availableTimes: string[];
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DateTimeSelectionModal({
  selectedDate,
  selectedTime,
  availableDates,
  availableTimes,
  onDateChange,
  onTimeChange,
  onConfirm,
  onClose
}: DateTimeSelectionModalProps) {
  const { theme } = useTheme();

  const formatDateForValue = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg shadow-lg p-6" 
        style={{ backgroundColor: theme.colors.background.card }}>
        <h2 className="text-xl font-bold mb-4" style={{ color: theme.colors.text.primary }}>
          Select Date & Time
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
              Date
            </label>
            <select
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full p-3 rounded-lg transition-colors"
              style={{ 
                backgroundColor: theme.colors.background.primary,
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.text.secondary}`
              }}
            >
              <option value="">Select a date</option>
              {availableDates.map(date => (
                <option key={date.toISOString()} value={formatDateForValue(date)}>
                  {date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </option>
              ))}
            </select>
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
                Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => onTimeChange(time)}
                    className="p-2 rounded-lg transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: time === selectedTime ? theme.colors.accent.primary : theme.colors.background.primary,
                      color: time === selectedTime ? theme.colors.background.primary : theme.colors.text.primary,
                      border: `1px solid ${time === selectedTime ? theme.colors.accent.primary : theme.colors.text.secondary}`
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onConfirm}
            disabled={!selectedDate || !selectedTime}
            className="flex-1 py-3 rounded-lg transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary,
              opacity: (!selectedDate || !selectedTime) ? 0.5 : 1
            }}
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: theme.colors.background.primary,
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.text.secondary}`
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 