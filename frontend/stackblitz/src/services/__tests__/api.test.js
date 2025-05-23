
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeAll } from '@jest/globals';
import { useTeamsWithLogos, useEnrichedMatches, useTeamById, useTeamEloRatings } from '../api_hooks.jsx';
import { createWrapper } from '../test-utils.js';

import fetch from 'node-fetch';

beforeAll(() => {
  global.fetch = fetch;
});

describe('useTeamsWithLogos (real fetch)', () => {
  test('fetches teams and adds logo paths', async () => {
    const { result } = renderHook(() => useTeamsWithLogos(), {
      wrapper: createWrapper(),
    });

    // Wait for loading to finish and data to be present
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.teamsWithLogos.length).toBeGreaterThan(0);
    });

    result.current.teamsWithLogos.forEach(team => {
      expect(team).toHaveProperty('name');
      expect(typeof team.name).toBe('string');

      expect(team).toHaveProperty('home_venue');
      expect(typeof team.home_venue).toBe('string');

      expect(team).toHaveProperty('logo');
      expect(team.logo).toMatch(/\/teamlogo\/.+\.png$/);
    });
  });
});


describe('useEnrichedMatches (integration)', () => {
  test('fetches enriched matches with home/away teams and logos', async () => {
    const { result } = renderHook(() => useEnrichedMatches(), {
      wrapper: createWrapper(), 
    });

    // Wait for data to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.enrichedMatches.length).toBeGreaterThan(0);
    }, { timeout: 10000 }); // Increase to 5s

    // Validate shape
    expect(Array.isArray(result.current.enrichedMatches)).toBe(true);
    expect(result.current.enrichedMatches.length).toBeGreaterThan(0);

    for (const match of result.current.enrichedMatches) {
      expect(match).toHaveProperty('dateObj');
      expect(match.home).toBeDefined();
      expect(match.away).toBeDefined();
      expect(match.home).toHaveProperty('id');
      expect(match.away).toHaveProperty('id');
      expect(match.home.logo).toMatch(/\/teamlogo\/.+\.png$/);
      expect(match.away.logo).toMatch(/\/teamlogo\/.+\.png$/);
    }
  });
});

describe('useTeamById (integration)', () => {
  test('fetches team by id', async () => {
    const { result } = renderHook(() => useTeamById(1), {
      wrapper: createWrapper(),
    });

    // Wait for data to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeDefined();
    }, { timeout: 10000 }); // Increase to 5s

    // Validate shape
    expect(result.current.data).toHaveProperty('home venue');
    expect(result.current.data).toHaveProperty('id');
    expect(result.current.data).toHaveProperty('name');
  });
});

describe('useTeamEloRatings (integration)', () => {
  test('fetches team elo ratings', async () => {
    const { result } = renderHook(() => useTeamEloRatings(1), {
      wrapper: createWrapper(),
    });

    // Wait for data to finish loading
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data.length).toBeGreaterThan(0);
    }, { timeout: 10000 }); // Increase to 5s

    // Validate shape
    expect(Array.isArray(result.current.data)).toBe(true);
    expect(result.current.data.length).toBeGreaterThan(0);

    for (const rating of result.current.data) {
      expect(rating).toHaveProperty('team_id');
      expect(rating).toHaveProperty('date');
      expect(rating).toHaveProperty('rating_after');
    }
  });
});
