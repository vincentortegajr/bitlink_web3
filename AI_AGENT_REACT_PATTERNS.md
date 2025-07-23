# AI Agent Instructions: Modern React Development Patterns

## 🎯 BitLink Web3 Project React Standards

### Component Architecture Rules

#### ✅ MANDATORY: Functional Components Only
```javascript
// ✅ CORRECT: Modern functional component
import React, { useState, useEffect } from 'react';

const ModernComponent = ({ title, onAction }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Component logic here
  }, []);

  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
};

export default ModernComponent;
```

#### ❌ FORBIDDEN: Class Components
```javascript
// ❌ NEVER USE: Class components
class OldComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  render() {
    return <div>Legacy pattern</div>;
  }
}
```

### State Management Patterns

#### Hook-Based State
```javascript
// ✅ CORRECT: Modern hooks
import { useState, useEffect, useCallback, useMemo } from 'react';

const ComponentWithState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized calculations
  const userDisplayName = useMemo(() => {
    return user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || 'Anonymous';
  }, [user]);

  // Callback functions
  const handleUserUpdate = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await updateUser(userData);
      setUser(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {user && <div>Welcome, {userDisplayName}!</div>}
    </div>
  );
};
```

### Props Handling with Optional Chaining

#### ✅ MANDATORY: Safe Property Access
```javascript
// ✅ CORRECT: Always use optional chaining
const UserProfile = ({ user, settings, onUpdate }) => {
  return (
    <div className="user-profile">
      <h1>{user?.profile?.displayName || 'Anonymous User'}</h1>
      <img 
        src={user?.profile?.avatar || '/default-avatar.png'} 
        alt={user?.profile?.displayName || 'User avatar'}
      />
      
      {/* Safe array access */}
      {user?.preferences?.notifications?.map((notification) => (
        <div key={notification?.id}>
          {notification?.message}
        </div>
      ))}
      
      {/* Safe method calls */}
      <button onClick={() => onUpdate?.(user?.id)}>
        Update Profile
      </button>
    </div>
  );
};
```

### Event Handling Patterns

#### Modern Event Handlers
```javascript
// ✅ CORRECT: Modern event handling
const InteractiveComponent = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      await onSubmit?.(formData);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  }, [formData, onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={formData.title || ''}
        onChange={handleInputChange}
        className="form-input"
      />
      
      <button type="submit">Submit</button>
      <button type="button" onClick={() => onCancel?.()}>
        Cancel
      </button>
    </form>
  );
};
```

### Component Composition Patterns

#### Higher-Order Pattern with Hooks
```javascript
// ✅ CORRECT: Custom hooks for reusable logic
const useApiData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return { data, loading, error };
};

// Usage in components
const DataDisplayComponent = ({ endpoint }) => {
  const { data, loading, error } = useApiData(endpoint);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.items?.map((item) => (
        <div key={item?.id}>{item?.title}</div>
      ))}
    </div>
  );
};
```

### Conditional Rendering Best Practices

```javascript
// ✅ CORRECT: Safe conditional rendering
const ConditionalContent = ({ user, isLoggedIn, features }) => {
  return (
    <div>
      {/* Boolean conditions */}
      {isLoggedIn && (
        <div className="user-welcome">
          Welcome back, {user?.name}!
        </div>
      )}

      {/* Ternary for either/or */}
      {user?.isPremium ? (
        <PremiumDashboard user={user} />
      ) : (
        <FreeDashboard user={user} />
      )}

      {/* Complex conditions */}
      {features?.length > 0 && (
        <div className="features-list">
          {features.map((feature) => (
            feature?.isEnabled && (
              <FeatureCard 
                key={feature.id} 
                feature={feature} 
              />
            )
          ))}
        </div>
      )}

      {/* Null safety with early returns */}
      {!user && <LoginPrompt />}
    </div>
  );
};
```

### Error Boundaries Pattern

#### Modern Error Handling
```javascript
// ✅ CORRECT: Error boundary with hooks
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="error-boundary" role="alert">
      <h2>Something went wrong:</h2>
      <pre className="error-message">{error?.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const AppWithErrorBoundary = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error('Error caught by boundary:', error, info);
      }}
    >
      <MainApplication />
    </ErrorBoundary>
  );
};
```

### Performance Optimization

#### Memoization Patterns
```javascript
// ✅ CORRECT: Strategic memoization
import { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(({ items, onItemClick, filters }) => {
  // Expensive calculations
  const filteredItems = useMemo(() => {
    return items?.filter((item) => {
      return filters?.categories?.includes(item?.category) &&
             item?.isActive !== false;
    }) || [];
  }, [items, filters?.categories]);

  // Stable callback references
  const handleItemClick = useCallback((itemId) => {
    onItemClick?.(itemId);
  }, [onItemClick]);

  return (
    <div className="optimized-list">
      {filteredItems.map((item) => (
        <ItemComponent
          key={item?.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
});

OptimizedComponent.displayName = 'OptimizedComponent';
```

## 🚨 Critical React Anti-Patterns to Avoid

1. **Class Components**: Never use class-based components
2. **Direct State Mutation**: Always use setState/hooks
3. **Missing Optional Chaining**: Always use `?.` for nested access
4. **Inline Object/Array Creation**: Use useMemo for complex objects
5. **Missing Keys in Lists**: Always provide unique keys
6. **Side Effects in Render**: Use useEffect for side effects

## 📋 React Component Checklist

Before generating any React component, ensure:
- [ ] Functional component with hooks
- [ ] Optional chaining for all props access
- [ ] Proper error handling and loading states
- [ ] Memoization where appropriate
- [ ] Clean useEffect dependencies
- [ ] Accessible JSX with proper ARIA attributes
- [ ] Export statement at the bottom