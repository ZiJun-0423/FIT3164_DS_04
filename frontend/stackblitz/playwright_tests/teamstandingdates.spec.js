import { test, expect } from '@playwright/test';
import { validateTeamStandingsTable } from './validateTeamStandings.js';

test('Team standings update after selecting a new date', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Intercept and wait for the updated rankings API call
  const newDate = '29/06/2023';

  // Fill in the date
  const dateInput = page.getByTestId('mini-date-picker');
  await expect(dateInput).toBeVisible();
  await dateInput.fill('');
  await dateInput.type(newDate);
  await dateInput.press('Enter');

  const newDateURLPart = '2023-06-29'; // Match your actual API format

  const responsePromise = page.waitForResponse(resp =>
    resp.url().includes(`/teams/rankings/date/${newDateURLPart}`) && resp.status() === 200
  );

  // Wait for the new data to load
  await responsePromise;

  // Reuse validation helper
  await validateTeamStandingsTable(page);
});
