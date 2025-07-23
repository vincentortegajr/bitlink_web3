# AI Agent Instructions: Modern Vite Configuration & ES6 Modules

## 🚨 CRITICAL: NEVER REVERT TO LEGACY COMMONJS PATTERNS

### Project Configuration Context
- **Build Tool**: Vite 5.0.0 with modern ES6 import/export syntax
- **Configuration File**: `vite.config.mjs` (NOT .js)
- **Module System**: ES6 Modules ONLY
- **Framework**: React 18.2.0 with functional components + hooks

## ✅ CORRECT: Modern ES6 Patterns

### Vite Configuration (.mjs files)
```javascript
// ✅ CORRECT: vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 2000,
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    port: "4028",
    host: "0.0.0.0",
    strictPort: true,
  }
});
```

### Component Import/Export Patterns
```javascript
// ✅ CORRECT: ES6 imports
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';

// ✅ CORRECT: Default export
export default ComponentName;

// ✅ CORRECT: Named exports
export { ComponentName, utilityFunction };
```

## ❌ FORBIDDEN: CommonJS Anti-Patterns

### NEVER Use These Patterns
```javascript
// ❌ FORBIDDEN: CommonJS require
const React = require('react');
const { defineConfig } = require('vite');

// ❌ FORBIDDEN: module.exports
module.exports = {
  // configuration
};

// ❌ FORBIDDEN: Mixed syntax
import React from 'react';
module.exports = Component; // NEVER MIX THESE
```

## 🔧 Configuration File Guidelines

### File Extensions & Module Systems
- **Vite Config**: Always use `.mjs` extension
- **Tailwind Config**: Use ES6 `export default` (not module.exports)
- **Component Files**: Always `.jsx` with ES6 imports/exports
- **Utility Files**: Always `.js` with ES6 modules

### Exception: PostCSS Configuration
```javascript
// ⚠️ EXCEPTION: postcss.config.js uses CommonJS (legacy requirement)
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 🎯 Modern Development Patterns

### React Components
```javascript
// ✅ CORRECT: Functional components with hooks
import React, { useState, useEffect } from 'react';

const ModernComponent = ({ title, data }) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Modern async/await patterns
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setState(result);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="modern-component">
      <h1>{title}</h1>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default ModernComponent;
```

### Utility Functions
```javascript
// ✅ CORRECT: Named exports for utilities
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US').format(date);
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// ✅ CORRECT: Default export for main utility
const apiClient = {
  get: async (url) => {
    const response = await fetch(url);
    return response.json();
  }
};

export default apiClient;
```

## 📋 Mandatory Checklist Before Code Generation

- [ ] Using ES6 import/export syntax exclusively
- [ ] Configuration files use correct extensions (.mjs for Vite)
- [ ] No CommonJS require() statements
- [ ] No module.exports usage (except postcss.config.js)
- [ ] React components use functional syntax with hooks
- [ ] Optional chaining (?.) for all nested property access
- [ ] Proper error boundaries and loading states
- [ ] Tailwind CSS classes follow design system variables

## 🚫 Red Flags - Immediate Code Rejection

If you see any of these patterns, IMMEDIATELY reject and rewrite:
1. `require()` statements in any file except postcss.config.js
2. `module.exports` in any .js, .jsx, or .mjs file
3. Class components instead of functional components
4. Direct property access without optional chaining
5. Vite configuration in .js file instead of .mjs
6. CommonJS syntax mixed with ES6 imports

## 🔄 Migration Patterns

### Converting Legacy to Modern
```javascript
// ❌ OLD: CommonJS
const express = require('express');
const config = require('./config');
module.exports = router;

// ✅ NEW: ES6 Modules
import express from 'express';
import config from './config.js';
export default router;
```

## 📚 Project-Specific Context

### BitLink Web3 Project Structure
- **Framework**: React 18.2.0 with Vite 5.0.0
- **Styling**: Tailwind CSS with CSS variables
- **State**: Redux Toolkit for global state
- **Routing**: React Router DOM 6.0.2
- **Build**: Modern ES6 modules with .mjs configuration

### Required Dependencies (Always Check These Exist)
- @vitejs/plugin-react: 4.3.4
- vite: 5.0.0
- react: ^18.2.0
- tailwindcss: 3.4.6
- @reduxjs/toolkit: ^2.6.1

Remember: This is a MODERN Web3 project. Always use cutting-edge patterns, never fall back to legacy CommonJS syntax!