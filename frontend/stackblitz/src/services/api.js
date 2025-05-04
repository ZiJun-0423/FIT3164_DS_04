import { API } from '../config.js';
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
      const res = await fetch('/api/teams/rankings');
      if (!res.ok) throw new Error('Failed to fetch team rankings');
      return await res.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  }

export async function fetchAllTeam(){
    try {
        const res = await fetch('${API}/teams/');
        if (!res.ok) throw new Error('failed to fetch teams');
        return await res.json();
    } catch (error) {
        console.error('API Error:', error);
        return []
    }
}

export async function fetchAllMatches(){
    try {
        const res = await fetch('${API}/matches/');
        if (!res.ok) throw new Error('failed to fetch matches');
        return await res.json();
    } catch (error) {
        console.error('API Error:', error);
        return []
    }
}
export async function fetchMatchesByDate(date){
    try {
        const res = await fetch('${API}/matches/${date}');
        if (!res.ok) throw new Error('failed to fetch matches by date');
        return await res.json();
    } catch (error) {
        console.error('API Error:', error);
        return []
    }
}
