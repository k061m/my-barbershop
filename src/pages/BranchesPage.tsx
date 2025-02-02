import { useTheme } from '../contexts/ThemeContext';
import { useBranches } from '../hooks/useBranches';
import BranchCard from '../components/branchesPage/BranchCard';

export default function BranchesPage() {
  const { theme } = useTheme();
  const { branches, isLoading, error } = useBranches();

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}
      >
        <div 
          className="loading loading-spinner loading-lg"
          style={{ color: theme.colors.accent.primary }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ backgroundColor: theme.colors.background.primary }}
      >
        <div 
          className="text-center p-8 rounded-lg"
          style={{ 
            backgroundColor: theme.colors.background.card,
            boxShadow: theme.shadows.lg
          }}
        >
          <div 
            className="text-xl mb-4"
            style={{ color: theme.colors.status.error }}
          >
            Failed to load branches. Please try again later.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
            style={{ 
              backgroundColor: theme.colors.accent.primary,
              color: theme.colors.background.primary
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-8"
      style={{ backgroundColor: theme.colors.background.primary }}
    >
      <div className="container mx-auto px-4">
        <h1 
          className="text-3xl font-bold mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          Our Locations
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches?.map(branch => (
            <BranchCard key={branch.id} branch={branch} />
          ))}
        </div>

        {branches?.length === 0 && (
          <div 
            className="text-center py-12 rounded-lg"
            style={{ 
              backgroundColor: theme.colors.background.card,
              color: theme.colors.text.secondary
            }}
          >
            No branches available at the moment.
          </div>
        )}
      </div>
    </div>
  );
} 