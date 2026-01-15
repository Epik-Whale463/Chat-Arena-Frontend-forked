import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Award, TrendingUp } from 'lucide-react';
import { apiClient } from '../../../shared/api/client';
import { endpoints } from '../../../shared/api/endpoints';

export function DetailedVotesCard() {
  const { isAnonymous } = useSelector((state) => state.auth);
  const { selectedMode } = useSelector((state) => state.ttsChat);
  const [votesCount, setVotesCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only show for authenticated users in academic mode
    if (isAnonymous || selectedMode !== 'academic') {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await apiClient.get(endpoints.auth.stats);
        setVotesCount(response.data.detailed_votes_count || 0);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
        // Silently fail - don't show the card if stats fetch fails
        setVotesCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAnonymous, selectedMode]);

  // Don't render if anonymous or not in academic mode
  if (isAnonymous || selectedMode !== 'academic' || loading) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-20 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-3 min-w-[180px]">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-orange-100 rounded-full">
            <Award size={16} className="text-orange-600" />
          </div>
          <h3 className="text-xs font-semibold text-gray-700">Your Contribution</h3>
        </div>
        
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-2xl font-bold text-orange-600">
            {votesCount}
          </span>
          <span className="text-xs text-gray-600">
            detailed vote{votesCount !== 1 ? 's' : ''}
          </span>
        </div>
        
        {votesCount > 0 && (
          <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
            <TrendingUp size={12} />
            <span>Keep contributing!</span>
          </div>
        )}
        
        {votesCount === 0 && (
          <p className="text-xs text-gray-500 mt-2">
            Submit detailed feedback to start contributing
          </p>
        )}
      </div>
    </div>
  );
}
