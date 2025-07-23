# AI Agent Error Prevention Checklist

## 🚨 CRITICAL: Pre-Generation Validation

### Before Writing ANY Code - Complete This Checklist

#### Module System Verification
- [ ] **ES6 Import/Export ONLY** - No require() or module.exports
- [ ] **Vite Config Extension** - Always .mjs, never .js
- [ ] **Component Exports** - Every component has export default
- [ ] **Named Imports** - Use destructuring for specific exports

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

Remember: This is a MODERN Web3 project. Code quality standards are non-negotiable!