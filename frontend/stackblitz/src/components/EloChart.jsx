import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const eloRatings = [
  { team: "Collingwood", elo: 1650 },
  { team: "Richmond", elo: 1620 },
  { team: "Geelong", elo: 1585 },
  { team: "Carlton", elo: 1500 },
  { team: "Hawthorn", elo: 1480 },
];

export default function EloChart() {
  return (
    <div style={{ width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <BarChart data={eloRatings} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="team" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#2c2c2c", border: "none", color: "#fff" }}
            labelStyle={{ color: "#00bfa6" }}
          />
          <Bar dataKey="elo" fill="#00bfa6" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
