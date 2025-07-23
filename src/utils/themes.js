// Theme configuration for Profile Builder gradients
export const PROFILE_THEMES = {
  pink: {
    name: 'Pink Gradient',
    icon: 'Heart',
    background: 'from-purple-600 via-pink-500 to-blue-600',
    overlay: 'from-purple-400/30 via-pink-400/20 to-blue-400/30',
    accent: 'from-purple-500/20 via-pink-400/15 to-blue-500/20',
    socialBorder: 'border-purple-400/60',
    socialBg: 'from-purple-500/15 via-pink-400/10 to-blue-500/15',
    socialShadow: 'shadow-purple-500/30',
    socialIcon: 'from-purple-500/20 via-pink-400/15 to-blue-500/20',
    description: 'Modern creative pink gradient'
  },
  luxury: {
    name: 'Luxury Dark',
    icon: 'Crown',
    background: 'from-slate-900 via-blue-900 to-emerald-900',
    overlay: 'from-slate-800/40 via-blue-800/30 to-emerald-800/40',
    accent: 'from-slate-700/30 via-blue-700/20 to-emerald-700/30',
    socialBorder: 'border-blue-400/60',
    socialBg: 'from-slate-800/20 via-blue-800/15 to-emerald-800/20',
    socialShadow: 'shadow-blue-500/30',
    socialIcon: 'from-slate-600/25 via-blue-600/20 to-emerald-600/25',
    description: 'Luxury black blue green aesthetic'
  },
  ocean: {
    name: 'Ocean Blue',
    icon: 'Waves',
    background: 'from-blue-700 via-cyan-600 to-teal-600',
    overlay: 'from-blue-600/35 via-cyan-500/25 to-teal-500/35',
    accent: 'from-blue-500/25 via-cyan-400/18 to-teal-400/25',
    socialBorder: 'border-cyan-400/60',
    socialBg: 'from-blue-600/18 via-cyan-500/12 to-teal-500/18',
    socialShadow: 'shadow-cyan-500/30',
    socialIcon: 'from-blue-500/22 via-cyan-400/16 to-teal-400/22',
    description: 'Professional ocean vibes'
  },
  sunset: {
    name: 'Sunset Gold',
    icon: 'Sun',
    background: 'from-orange-600 via-red-500 to-pink-600',
    overlay: 'from-orange-500/35 via-red-400/25 to-pink-400/35',
    accent: 'from-orange-400/25 via-red-300/18 to-pink-300/25',
    socialBorder: 'border-orange-400/60',
    socialBg: 'from-orange-500/18 via-red-400/12 to-pink-400/18',
    socialShadow: 'shadow-orange-500/30',
    socialIcon: 'from-orange-400/22 via-red-300/16 to-pink-300/22',
    description: 'Warm sunset gradient'
  }
};

export const getTheme = (themeKey) => PROFILE_THEMES[themeKey] || PROFILE_THEMES.pink;

export const saveTheme = (themeKey) => {
  localStorage.setItem('profile_theme', themeKey);
};

export const loadTheme = () => {
  return localStorage.getItem('profile_theme') || 'pink';
};