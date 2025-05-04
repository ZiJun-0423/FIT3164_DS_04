import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  document.getElementById('root')
);

export default function App() {
    return (
      <div style={{ padding: "2rem", color: "white", backgroundColor: "#121212", minHeight: "100vh" }}>
        <h1>AFL Game Ranking System</h1>
        <p>Welcome to the homepage</p>
      </div>
    );
  }