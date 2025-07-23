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

## 🔧 CRITICAL: PostCSS Configuration - CORRECTED INSTRUCTIONS

### **Understanding Package.json Module Configuration**

**FIRST: Check your package.json file to determine the correct approach:**

#### **Case 1: Standard CommonJS Project (NO "type": "module" in package.json)**
```javascript
// ✅ CORRECT: postcss.config.js (use .js extension)
module.exports = {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### **Case 2: ES Modules Project (HAS "type": "module" in package.json)**
```javascript
// ✅ OPTION A: Use .cjs extension for CommonJS syntax
// File: postcss.config.cjs
module.exports = {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

```javascript
// ✅ OPTION B: Use ES modules syntax with .js extension
// File: postcss.config.js
export default {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### **Current Project Configuration**
**This BitLink Web3 project does NOT have "type": "module" in package.json**, therefore:

```javascript
// ✅ CORRECT: postcss.config.js (current implementation)
module.exports = {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### **Troubleshooting PostCSS Issues**

#### **Error: "To treat it as a CommonJS script, rename it to use the '.cjs' file extension"**
**This error occurs when:**
- Your package.json contains `"type": "module"`
- Your postcss.config.js uses `module.exports` (CommonJS syntax)

**Solution:**
```bash
# ONLY if your package.json has "type": "module"
mv postcss.config.js postcss.config.cjs
```

#### **Error: "Cannot use import statement outside a module"**
**This error occurs when:**
- Your package.json does NOT contain `"type": "module"`
- Your postcss.config.js uses `export default` (ES modules syntax)

**Solution:**
```javascript
// Change from ES modules to CommonJS
// Replace: export default { ... }
// With: module.exports = { ... }
```

#### **Resolution Checklist**
1. **Check package.json first**: Look for `"type": "module"` 2. **If"type": "module" exists**: Use `.cjs` extension OR ES modules syntax 3. **If NO"type": "module"**: Use `.js` extension with `module.exports`
4. **Restart development server**: Always restart after PostCSS config changes
5. **Clear build cache**: Delete `node_modules/.cache` if issues persist

#### **Project-Specific PostCSS Requirements**
- **Current Project**: Uses CommonJS (no "type": "module" in package.json)
- **File Name**: `postcss.config.js` (NOT .cjs)
- **Syntax**: `module.exports = { ... }` (NOT export default)
- **Tailwind CSS Nesting**: Required `tailwindcss/nesting` plugin
- **Autoprefixer**: Essential for cross-browser CSS compatibility

#### **After Making PostCSS Changes**
```bash
# Always restart the development server
npm run dev
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

- [ ] Using ES6 import/export syntax exclusively (except PostCSS config)
- [ ] Configuration files use correct extensions (.mjs for Vite)
- [ ] No CommonJS require() statements (except PostCSS config)
- [ ] PostCSS config matches package.json module type
- [ ] React components use functional syntax with hooks
- [ ] Optional chaining (?.) for all nested property access
- [ ] Proper error boundaries and loading states
- [ ] Tailwind CSS classes follow design system variables

## 🚫 Red Flags - Immediate Code Rejection

If you see any of these patterns, IMMEDIATELY reject and rewrite:
1. `require()` statements in any file except postcss.config.js
2. `module.exports` in any .js, .jsx, or .mjs file (except PostCSS config)
3. Class components instead of functional components
4. Direct property access without optional chaining
5. Vite configuration in .js file instead of .mjs
6. PostCSS config that doesn't match package.json module type

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
- **PostCSS**: CommonJS configuration (no "type": "module" in package.json)

### Required Dependencies (Always Check These Exist)
- @vitejs/plugin-react: 4.3.4
- vite: 5.0.0
- react: ^18.2.0
- tailwindcss: 3.4.6
- @reduxjs/toolkit: ^2.6.1

Remember: This is a MODERN Web3 project using CommonJS for PostCSS configuration. Always use cutting-edge patterns, never fall back to legacy CommonJS syntax (except for PostCSS config)!