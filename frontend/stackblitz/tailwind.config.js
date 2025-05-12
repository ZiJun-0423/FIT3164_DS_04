module.exports = {
  darkMode: 'class', // Enables dark mode based on a class
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'bg-gradient-start': '#ffffff',
        'bg-gradient-end': '#f0f0f0',
        'text-color': '#000000',
        'card-bg': '#ffffff',
        'card-text': '#000000',
        'border-color': '#cccccc',
        'highlight-color': '#00bfa6',
        'select-bg': '#e0e0e0',
        'select-text': '#000000',
        'btn-bg': '#00bfa6',
        'btn-bg-hover': '#00a58a',
        'btn-text': '#ffffff',
        
        // Dark mode colors (these will be used when dark mode is active)
        'dark-bg-gradient-start': '#121212',
        'dark-bg-gradient-end': '#1e1e1e',
        'dark-text-color': '#ffffff',
        'dark-card-bg': '#2c2c2c',
        'dark-card-text': '#ffffff',
        'dark-border-color': '#00bfa6',
        'dark-highlight-color': '#00bfa6',
        'dark-select-bg': '#1e1e1e',
        'dark-select-text': '#ffffff',
        'dark-btn-bg': '#00bfa6',
        'dark-btn-bg-hover': '#00a58a',
        'dark-btn-text': '#ffffff',
      },
      fontFamily: {
        // Custom font family
        'poppins': ['Poppins', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
