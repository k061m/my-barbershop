import { useTheme } from '../../contexts/ThemeContext';

interface CustomerDetails {
  fullName: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  problem: string;
}

interface CustomerDetailsStepProps {
  isForSelf: boolean;
  details: CustomerDetails;
  onToggleForSelf: () => void;
  onUpdateDetails: (details: Partial<CustomerDetails>) => void;
}

export default function CustomerDetailsStep({
  isForSelf,
  details,
  onToggleForSelf,
  onUpdateDetails
}: CustomerDetailsStepProps) {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <h2 
        className="text-xl font-semibold mb-4"
        style={{ color: theme.colors.text.primary }}
      >
        Patient Details
      </h2>

      <div className="space-y-4">
        {/* Booking Type Selection */}
        <div className="flex gap-4">
          <button
            onClick={onToggleForSelf}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${
              isForSelf ? 'ring-2 ring-accent' : ''
            }`}
            style={{ 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary
            }}
          >
            Yourself
          </button>
          <button
            onClick={onToggleForSelf}
            className={`flex-1 py-3 px-4 rounded-lg transition-all ${
              !isForSelf ? 'ring-2 ring-accent' : ''
            }`}
            style={{ 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary
            }}
          >
            Another Person
          </button>
        </div>

        {/* Full Name */}
        <div>
          <label 
            className="block mb-2 text-sm font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            Full Name
          </label>
          <input
            type="text"
            value={details.fullName}
            onChange={e => onUpdateDetails({ fullName: e.target.value })}
            placeholder="Enter full name"
            className="w-full p-3 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              border: 'none'
            }}
          />
        </div>

        {/* Age */}
        <div>
          <label 
            className="block mb-2 text-sm font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            Age
          </label>
          <input
            type="number"
            value={details.age}
            onChange={e => onUpdateDetails({ age: e.target.value })}
            placeholder="Enter age"
            className="w-full p-3 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              border: 'none'
            }}
          />
        </div>

        {/* Gender Selection */}
        <div>
          <label 
            className="block mb-2 text-sm font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            Gender
          </label>
          <div className="flex gap-4">
            {['male', 'female', 'other'].map(gender => (
              <button
                key={gender}
                onClick={() => onUpdateDetails({ gender: gender as 'male' | 'female' | 'other' })}
                className={`flex-1 py-2 px-4 rounded-lg capitalize transition-all ${
                  details.gender === gender ? 'ring-2 ring-accent' : ''
                }`}
                style={{ 
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary
                }}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Description */}
        <div>
          <label 
            className="block mb-2 text-sm font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            Describe your problem
          </label>
          <textarea
            value={details.problem}
            onChange={e => onUpdateDetails({ problem: e.target.value })}
            placeholder="Enter your problem or requirements..."
            className="w-full p-3 rounded-lg min-h-[120px] resize-none"
            style={{ 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              border: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
} 