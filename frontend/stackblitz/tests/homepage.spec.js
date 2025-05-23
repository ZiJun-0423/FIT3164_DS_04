import {test, expect} from '@playwright/test';

test.describe('Team Standings Table', () => {
  test('should display team standings with all expected columns and data', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Wait for the team standings table to be visible
    const table = page.getByTestId('team-standings-table');
    await expect(table).toBeVisible();

    // Check headers are visible and correct
    const headers = [
      'Rank',
      'Club',
      'Played',
      'Points',
      '%',
      'Won',
      'Lost',
      'Drawn',
      'PF',
      'PA',
      'ELO Score',
      'Win Streaks',
    ];

    for (const header of headers) {
      await expect(table.getByText(header)).toBeVisible();
    }
  });
});

test('Team standings includes Sydney link', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const table = page.getByTestId('team-standings-table');
  await expect(table).toBeVisible();

  // Check the link containing Sydney text is visible
  await expect(table.getByRole('link', { name: 'Sydney Sydney' })).toBeVisible();
});

// test('Date picker updates selected date and triggers change', async ({ page }) => {
//   await page.goto('http://localhost:5173/');

//   // Find the date input (by label or id)
//   const dateInput = page.locator('#date-picker');

//   // Check input is visible and has initial value (e.g., default or latest date)
//   await expect(dateInput).toBeVisible();

//   // Clear existing input (if any)
//   await dateInput.fill('');

//   // Type a new date - use format your date picker expects (dd/MM/yyyy)
//   const newDate = '29/06/2023';
//   await dateInput.type(newDate);

//   // Optionally press Enter or blur to trigger change (depends on your component)
//   await dateInput.press('Enter');

//   // Now assert the input value updated correctly
//   await expect(dateInput).toHaveValue(newDate);

//   // If your app updates something else on date change (like filtering a table),
//   // assert those updates here. For example:

//   // const filteredTable = page.getByTestId('team-standings-table');
//   // await expect(filteredTable).toContainText('Some expected text for that date');

// });
