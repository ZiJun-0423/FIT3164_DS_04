export function getDefaultSeasonYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // Jan = 0, Feb = 1, ..., Dec = 11
    return currentMonth >= 2 ? currentYear : currentYear - 1;
  }
  