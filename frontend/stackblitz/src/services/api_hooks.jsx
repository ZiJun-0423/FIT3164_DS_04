import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { API } from '../config';

const makeLogo = name =>
  `/teamlogo/${name.toLowerCase().replace(/\s+/g, '')}.png`;

async function fetchAllTeams() {
  try {
    const res = await fetch(`${API}/teams/`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    return await res.json();
  } catch (error) {
    console.error('API Error (teams):', error);
    return [];
  }
}

async function fetchAllMatches() {
  try {
    const res = await fetch(`${API}/matches/`);
    if (!res.ok) throw new Error('Failed to fetch matches');
    return await res.json();
  } catch (error) {
    console.error('API Error (matches):', error);
    return [];
  }
}

export function useEnrichedMatches() {
  const {
    data: teams,
    isLoading: loadingTeams,
    isError: errorTeams,
  } = useQuery({ queryKey: ['teams'], queryFn: fetchAllTeams });

  const {
    data: allMatches,
    isLoading: loadingMatches,
    isError: errorMatches,
  } = useQuery({ queryKey: ['allMatches'], queryFn: fetchAllMatches });

  const teamsWithLogos = useMemo(() => {
    if (!teams) return [];
    return teams.map(team => ({
      ...team,
      logo: makeLogo(team.name),
    }));
  }, [teams]);

  const enrichedMatches = useMemo(() => {
    if (!allMatches || !teamsWithLogos.length) return [];
    return allMatches.map(match => ({
      ...match,
      dateObj: new Date(match.date + '+10:00'),
      home: teamsWithLogos.find(t => t.id === match.team1_id),
      away: teamsWithLogos.find(t => t.id === match.team2_id),
    }));
  }, [allMatches, teamsWithLogos]);

  return {
    enrichedMatches,
    isLoading: loadingTeams || loadingMatches,
    isError: errorTeams || errorMatches,
  };
}

export function useTeamsWithLogos() {
  const {
    data: teams,
    isLoading,
    isError,
  } = useQuery({ queryKey: ['teams'], queryFn: fetchAllTeams });

  const teamsWithLogos = useMemo(() => {
    if (!teams) return [];
    return teams.map(team => ({
      ...team,
      logo: makeLogo(team.name),
    }));
  }, [teams]);

  return { teamsWithLogos, isLoading, isError };
}

export function useTeamById(id) {
  return useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const res = await fetch(`${API}/teams/${id}`);
      if (!res.ok) throw new Error('Failed to fetch team');
      return res.json();
    },
    enabled: !!id, // prevents query if id is undefined
  });
}

export function useTeamEloRatings(id) {
  return useQuery({
    queryKey: ['eloRatings', id],
    queryFn: async () => {
      const res = await fetch(`${API}/elo/filter_by_team_id/${id}`);
      if (!res.ok) throw new Error('Failed to fetch elo ratings');
      const allElo = await res.json();
      return allElo
        .filter(e => e.team_id === +id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    enabled: !!id,
  });
}

export function useTeamMatchStats(id) {
  return useQuery({
    queryKey: ['matchStats', id],
    queryFn: async () => {
      const res = await fetch(`${API}/match_stats/`);
      if (!res.ok) throw new Error('Failed to fetch match stats');
      const stats = await res.json();
      return stats.filter(s => s.team_id === +id);
    },
    enabled: !!id,
  });
}

const postDynamicElo = async (settings) => {
  const res = await fetch(`${API}/elo/dynamic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });

  if (!res.ok) throw new Error('Failed to fetch dynamic Elo ratings');
  return await res.json();
};

export function useDynamicEloQuery(settings, enabled = true) {
  return useQuery({
    queryKey: ['dynamicElo', settings], // key changes with settings
    queryFn: () => postDynamicElo(settings),
    enabled, // allows you to control when the fetch runs
  });
}

const postEloPrediction = async (settings, teamSelection) => {
  const payload = {
    ...settings,        // e.g. k_value, initial_elo, start_season, home_adv
    ...teamSelection,   // e.g. team1_id, team2_id
  };

  const res = await fetch(`${API}/elo/dynamic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to fetch dynamic Elo ratings');
  return await res.json();
};

export function useEloPredictionQuery(settings, teamSelection, enabled = true) {
  return useQuery({
    queryKey: ['eloPrediction', settings, teamSelection],
    queryFn: () => postEloPrediction(settings, teamSelection),
    enabled: enabled && !!settings && !!teamSelection, // only run when both are defined
  });
}

async function fetchTeamRankings(date){
    try {
        const res = await fetch(`${API}/teams/rankings/date/${date}`);
        if (!res.ok) throw new Error('failed to fetch team rankings by date');
        return await res.json();
    } catch (error) {
        console.error('API Error:', error);
        return []
    }
}

export function useTeamRankings(selectedDate) {
  return useQuery({
    queryKey: ['rankings', selectedDate],
    queryFn: () =>
      fetchTeamRankings(selectedDate.toLocaleDateString('en-CA')),
    enabled: !!selectedDate,
  });
}