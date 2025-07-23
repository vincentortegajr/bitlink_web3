# AI Agent Error Prevention Checklist

## 🚨 CRITICAL: Pre-Generation Validation

### Before Writing ANY Code - Complete This Checklist

#### Module System Verification
- [ ] **ES6 Import/Export ONLY** - No require() or module.exports
- [ ] **Vite Config Extension** - Always .mjs, never .js
- [ ] **Component Exports** - Every component has export default
- [ ] **Named Imports** - Use destructuring for specific exports
- [ ] **PostCSS Config Exception** - Verify postcss.config.js uses correct format

#### PostCSS Configuration Validation
- [ ] **Config File Format** - Check if using .cjs or .js with proper module syntax
- [ ] **Plugin Loading** - Verify tailwindcss and autoprefixer load correctly
- [ ] **Nesting Support** - Confirm tailwindcss/nesting plugin is included
- [ ] **Development Server** - Restart after any PostCSS config changes
- [ ] **Build Process** - Ensure CSS compilation works in production build

#### React Component Validation  
- [ ] **Functional Components** - Never class components
- [ ] **Hooks Usage** - useState, useEffect, useCallback, useMemo
- [ ] **Optional Chaining** - Always use ?. for nested property access
- [ ] **Props Destructuring** - Destructure props in function signature
- [ ] **Event Handlers** - Use useCallback for performance

#### File Structure Compliance
- [ ] **Component Files** - Always .jsx extension
- [ ] **Utility Files** - .js extension with ES6 modules
- [ ] **Index Files** - Proper barrel exports
- [ ] **Page Components** - In pages/ directory
- [ ] **Reusable Components** - In components/ directory

#### Tailwind CSS Standards
- [ ] **Design System Colors** - Use CSS variables (var(--color-*))
- [ ] **No Hard-coded Colors** - Never text-blue-600, use text-primary
- [ ] **Responsive Classes** - Mobile-first approach
- [ ] **Interactive States** - hover:, focus:, active: included
- [ ] **Accessibility** - ARIA attributes and semantic HTML

## 🔍 Code Quality Gates

### Gate 1: Import/Export Syntax Check
```javascript
// ✅ PASS: Modern ES6 imports
import React, { useState } from 'react';
import { Button } from '../components/ui/Button';

// ❌ FAIL: CommonJS requires  
const React = require('react'); // REJECT CODE

// ⚠️ EXCEPTION: PostCSS config file only
// postcss.config.js or postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Gate 1.5: PostCSS Configuration Check
```javascript
// ✅ PASS: Correct PostCSS CommonJS format
// postcss.config.js
module.exports = {
  plugins: {
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};

// ✅ PASS: Correct PostCSS ES modules format (if package.json has "type": "module")
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// ✅ PASS: CommonJS with .cjs extension
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// ❌ FAIL: Mixed module syntax in PostCSS
import postcss from 'postcss';
module.exports = { ... }; // INCONSISTENT
```

### Gate 2: Component Structure Check
```javascript
// ✅ PASS: Functional component with hooks
const ModernComponent = ({ data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  
  return <div>{data?.title}</div>;
};

export default ModernComponent;

// ❌ FAIL: Class component
class LegacyComponent extends React.Component {} // REJECT CODE
```

### Gate 3: Optional Chaining Check
```javascript
// ✅ PASS: Safe property access
const userName = user?.profile?.displayName || 'Anonymous';
const notifications = user?.settings?.notifications?.map(...);

// ❌ FAIL: Direct property access
const userName = user.profile.displayName; // REJECT CODE - Unsafe
```

### Gate 4: Tailwind Design System Check
```javascript
// ✅ PASS: Design system classes
className="bg-primary text-primary-foreground hover:bg-primary/90"

// ❌ FAIL: Hard-coded colors
className="bg-blue-600 text-white hover:bg-blue-700" // REJECT CODE
```

## 🚧 Common Pitfall Prevention

### Pitfall 1: Mixed Module Systems
```javascript
// ❌ DANGER: Mixed syntax (immediate rejection)
import React from 'react';
module.exports = Component; // NEVER DO THIS

// ✅ CORRECT: Consistent ES6
import React from 'react';
export default Component;

// ⚠️ EXCEPTION: PostCSS config file only
// This is the ONLY file where module.exports is acceptable
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Pitfall 1.5: PostCSS Configuration Issues
```javascript
// ❌ DANGER: Wrong PostCSS config for module type
// If package.json has "type": "module" but using:
module.exports = { ... }; // Will cause errors

// ✅ CORRECT: Match package.json module type
// For "type": "module" in package.json:
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// ✅ CORRECT: Use .cjs extension to force CommonJS
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Pitfall 2: Missing Error Boundaries
```javascript
// ✅ REQUIRED: Always wrap risky operations
const APIComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{data?.content}</div>;
};
```

### Pitfall 3: Missing Key Props in Lists
```javascript
// ✅ REQUIRED: Always provide keys
{items?.map((item) => (
  <div key={item?.id || item?.name}>
    {item?.title}
  </div>
))}

// ❌ REJECT: Missing keys
{items?.map((item) => (
  <div>{item?.title}</div> // MISSING KEY
))}
```

## 🎯 Performance Optimization Gates

### Gate 5: Memoization Check
```javascript
// ✅ PASS: Appropriate memoization
const ExpensiveComponent = memo(({ data, filters }) => {
  const processedData = useMemo(() => {
    return data?.filter(item => filters?.includes(item?.category));
  }, [data, filters]);

  const handleClick = useCallback((id) => {
    // Handle click
  }, []);

  return <div>{processedData?.length} items</div>;
});
```

### Gate 6: Effect Dependencies Check
```javascript
// ✅ PASS: Correct dependencies
useEffect(() => {
  if (user?.id && settings?.autoSync) {
    syncUserData(user.id);
  }
}, [user?.id, settings?.autoSync]); // All dependencies included

// ❌ FAIL: Missing dependencies
useEffect(() => {
  syncUserData(user.id);
}, []); // MISSING user.id dependency
```

## 🔒 Security & Accessibility Gates

### Gate 7: XSS Prevention Check
```javascript
// ✅ PASS: Safe content rendering
<div>{sanitizedContent}</div>
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />

// ❌ FAIL: Unsafe HTML injection
<div dangerouslySetInnerHTML={{ __html: userContent }} /> // UNSAFE
```

### Gate 8: Accessibility Check
```javascript
// ✅ PASS: Accessible component
<button 
  onClick={handleClick}
  aria-label="Delete item"
  disabled={isDeleting}
  className="focus:ring-2 focus:ring-ring focus:outline-none"
>
  {isDeleting ? 'Deleting...' : 'Delete'}
</button>

// ❌ FAIL: Missing accessibility
<div onClick={handleClick}>Delete</div> // Should be button + ARIA
```

## 📊 Final Pre-Submit Checklist

### Code Generation Complete - Final Validation
- [ ] All imports use ES6 syntax
- [ ] All components are functional with hooks  
- [ ] Optional chaining used throughout
- [ ] Design system classes applied
- [ ] Error handling implemented
- [ ] Loading states included
- [ ] Accessibility attributes present
- [ ] Performance optimizations applied
- [ ] No console.log statements (unless debugging)
- [ ] Proper TypeScript types (if applicable)

### File Structure Final Check
- [ ] Components in correct directories
- [ ] Proper file extensions (.jsx, .js, .mjs)
- [ ] Export statements present
- [ ] Import paths correct and relative
- [ ] No circular dependencies

## 🚨 Immediate Rejection Criteria

**If ANY of these appear in generated code, immediately REJECT and regenerate:**

1. `require()` statements (except postcss.config.js)
2. `module.exports` statements (except postcss.config.js)  
3. Class components instead of functional
4. Direct property access without optional chaining
5. Hard-coded Tailwind colors instead of design system
6. Missing key props in mapped arrays
7. useEffect without proper dependencies
8. Missing error handling for async operations
9. Inaccessible interactive elements
10. Mixed ES6/CommonJS module syntax
11. **PostCSS config format incompatible with package.json module type**
12. **Missing PostCSS restart after configuration changes**

Remember: This is a MODERN Web3 project. Code quality standards are non-negotiable!

## 🔧 PostCSS Troubleshooting Guide

### Common PostCSS Errors and Solutions

#### Error: "require() of ES modules is not supported"
```bash
# Solution: Use .cjs extension or ES module export
git mv postcss.config.js postcss.config.cjs
# OR update to ES module format if package.json has "type": "module"
```

#### Error: "Cannot use import statement outside a module"
```bash
# Solution: Ensure package.json module type matches config format
# Either add "type": "module" to package.json
# OR use module.exports instead of export default
```

#### Error: Tailwind classes not working after config change
```bash
# Solution: Restart development server
npm run dev
# Clear cache if needed
rm -rf node_modules/.cache
```

### PostCSS Configuration Testing
```bash
# Test PostCSS config loads correctly
npx postcss --version

# Verify Tailwind CSS compilation
npm run build

# Check for CSS errors in browser console
# Look for: Failed to load PostCSS config
```

Remember: This is a MODERN Web3 project. PostCSS configuration must be compatible with the chosen module system!