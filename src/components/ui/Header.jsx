import React from 'react';

// CRITICAL FIX: Remove duplicate header navigation - UnifiedNavigation handles all navigation
// This component is now a simple pass-through to prevent import errors
const Header = () => {
  return null; // UnifiedNavigation in Routes.jsx handles all navigation
};

export default Header;