/**
 * API call to fetch team rankings
 * 
 * expects json response in the format:
 * {teams: [
 *  {team_id, 
 *   name, 
 *   points_for, 
 *   points_against, 
 *   percentage, 
 *   elo_rating, 
 *   win_streak, 
 *   logo_path
 *   },
 *  ...
 *  ]
 * }
 */
export async function fetchTeamTable() {
    try {
      const res = await fetch('/api/teams/rankings'); // adjust to your actual endpoint
      if (!res.ok) throw new Error('Failed to fetch team rankings');
      return await res.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  }