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
      const res = await fetch(`${API}/teams/`);
      if (!res.ok) throw new Error('Failed to fetch teams');
      const teams = await res.json();
      return teams.find(t => t.id === +id);
    },
    enabled: !!id, // prevents query if id is undefined
  });
}

export function useTeamEloRatings(id) {
  return useQuery({
    queryKey: ['eloRatings', id],
    queryFn: async () => {
      const res = await fetch(`${API}/elo_ratings/`);
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