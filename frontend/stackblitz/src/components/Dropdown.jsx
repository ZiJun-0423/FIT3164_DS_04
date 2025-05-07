export default function Dropdown({ onSeasonChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i); // e.g., 2024 - 2020
  const types = ['Regular', 'Finals'];

  const handleChange = (e) => {
    const [year, type] = e.target.value.split('-');
    onSeasonChange({ year: parseInt(year), type });
  };

  return (
    <select onChange={handleChange}>
      {years.map((year) =>
        types.map((type) => (
          <option key={`${year}-${type}`} value={`${year}-${type}`}>
            {year} {type}
          </option>
        ))
      )}
    </select>
  );
}
