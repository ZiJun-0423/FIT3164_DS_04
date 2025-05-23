import { expect } from '@playwright/test';

export async function validateTeamStandingsTable(page) {
  await Promise.all([
    page.goto('http://localhost:5173/'),
    page.waitForResponse(resp =>
      resp.url().includes('/teams/rankings/date/') && resp.status() === 200
    ),
  ]);

  const table = page.getByTestId('team-standings-table');
  await expect(table).toBeVisible();

  const links = await table.getByRole('link').all();

  expect(links.length).toBeGreaterThan(0); // sanity check

  for (const link of links) {
    const text = await link.textContent();
    expect(text?.trim().length).toBeGreaterThan(0); // Ensure not empty
  }
  // checking of columns are filled
  const rows = await table.locator('tbody tr').all();
  expect(rows.length).toBeGreaterThan(0);

  const numericColumns = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (const row of rows) {
    const cells = await row.locator('td').all();
    expect(cells.length).toBe(12);
    
    for (let i = 0; i < cells.length; i++) {
      const text = (await cells[i].textContent())?.trim() || '';

      if (numericColumns.includes(i)) {
        // Check it's a valid number
        const num = parseFloat(text.replace(/,/g, '')); // Remove commas for numbers like 1,234
        expect(Number.isNaN(num)).toBeFalsy(); // Must be a valid number
      } else {
        // For non-numeric (e.g., Club), just check non-empty
        expect(text.length).toBeGreaterThan(0);
      }
    }
  }
};