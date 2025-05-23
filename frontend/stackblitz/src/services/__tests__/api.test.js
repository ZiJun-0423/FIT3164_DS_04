import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { useTeamsWithLogos, useEnrichedMatches } from '../api_hooks.jsx';
import { createWrapper } from '../test-utils.js';

import fetch from 'node-fetch';
import test from 'node:test';

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


// describe('useEnrichedMatches (integration)', () => {
//   test('fetches enriched matches with home/away teams and logos', async () => {
//     const { result } = renderHook(() => useEnrichedMatches(), {
//       wrapper: createWrapper(), 
//     });

//     // Wait for data to finish loading
//     await waitFor(() => !result.current.isLoading);

//     // Validate shape
//     expect(Array.isArray(result.current.enrichedMatches)).toBe(true);
//     expect(result.current.enrichedMatches.length).toBeGreaterThan(0);

//     for (const match of result.current.enrichedMatches) {
//       expect(match).toHaveProperty('dateObj');
//       expect(match.home).toBeDefined();
//       expect(match.away).toBeDefined();
//       expect(match.home).toHaveProperty('id');
//       expect(match.away).toHaveProperty('id');
//       expect(match.home.logo).toMatch(/\/teamlogo\/.+\.png$/);
//       expect(match.away.logo).toMatch(/\/teamlogo\/.+\.png$/);
//     }
//   });
// });

// describe('useDynamicEloQuery', () => {
//   beforeEach(() => {
//     fetch.mockClear();
//   });

//   it('posts settings and returns dynamic ELO data', async () => {
//     const fakeResponse = [{ team_id: 1, rating: 1500 }];
//     const settings = { k_value: 20, initial_elo: 1000 };

//     fetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => fakeResponse,
//     });

//     const { result } = renderHook(
//       () => useDynamicEloQuery(settings),
//       { wrapper: createWrapper() }
//     );

//     await waitFor(() => expect(result.current.data).toEqual(fakeResponse));
//     expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/elo/dynamic'), expect.anything());
//   });
// });