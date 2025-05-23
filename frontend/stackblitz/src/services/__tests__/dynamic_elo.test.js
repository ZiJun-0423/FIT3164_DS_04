import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeAll } from '@jest/globals';
import { useDynamicEloQuery } from '../api_hooks.jsx';
import { createWrapper } from '../test-utils.js';
import fetch from 'node-fetch';

beforeAll(() => {
  global.fetch = fetch;
});

const startYears = [1897, 1917, 1937, 1957, 1977, 1997, 2017];

const scenarios = startYears.map((year) => ({
  label: `from ${year}`,
  settings: {
    k_value: 20,
    initial_elo: 1000,
    start_season: year,
    home_adv: 100,
  },
}));

describe('useDynamicEloQuery (integration)', () => {
  test.each(scenarios)('posts settings and returns ELO data: $label', async ({ settings }) => {
    const { result } = renderHook(() => useDynamicEloQuery(settings), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(Array.isArray(result.current.data)).toBe(true);
    }, { timeout: 10000 });

    expect(result.current.data.length).toBeGreaterThan(0);

    for (const entry of result.current.data) {
      expect(entry).toHaveProperty('team_id');
      expect(entry).toHaveProperty('rating_after');
      expect(entry).toHaveProperty('date');
      expect(entry).toHaveProperty('rating_before');
      expect(entry).toHaveProperty('rating_change');
      expect(entry).toHaveProperty('match_id');
    }
  });
});
