# AI Agent Instructions: Tailwind CSS Design System

## 🎨 BitLink Web3 Design System Guidelines

### Color System - CSS Variables Based

#### ✅ CORRECT: Use Design System Variables
```javascript
// ✅ CORRECT: Component using design system colors
const ModernButton = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors";
  
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90",
    success: "bg-success text-success-foreground hover:bg-success/90",
    warning: "bg-warning text-warning-foreground hover:bg-warning/90"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### Available Design System Colors
```css
/* Primary System Colors */
primary: var(--color-primary)              /* Blue-600 */
primary-foreground: var(--color-primary-foreground)  /* White */

secondary: var(--color-secondary)          /* Slate-500 */
secondary-foreground: var(--color-secondary-foreground)  /* White */

accent: var(--color-accent)                /* Emerald-500 */
accent-foreground: var(--color-accent-foreground)  /* White */

/* Status Colors */
success: var(--color-success)              /* Emerald-600 */
warning: var(--color-warning)              /* Amber-600 */
error: var(--color-error)                  /* Red-600 */
destructive: var(--color-destructive)      /* Red-600 */

/* Surface Colors */
background: var(--color-background)        /* Gray-50 */
surface: var(--color-surface)              /* White */
card: var(--color-card)                    /* White */
popover: var(--color-popover)              /* White */

/* Text Colors */
text-primary: var(--color-text-primary)    /* Slate-800 */
text-secondary: var(--color-text-secondary) /* Slate-500 */
foreground: var(--color-foreground)        /* Slate-800 */

/* Interactive Colors */
border: var(--color-border)                /* Slate-200 */
input: var(--color-input)                  /* White */
ring: var(--color-ring)                    /* Blue-600 */
muted: var(--color-muted)                  /* Slate-100 */
```

### Typography System

#### Font Hierarchy
```javascript
// ✅ CORRECT: Typography components
const TypographyScale = {
  // Headlines
  h1: "text-4xl font-bold text-text-primary",
  h2: "text-3xl font-semibold text-text-primary",
  h3: "text-2xl font-semibold text-text-primary",
  h4: "text-xl font-medium text-text-primary",
  
  // Body text
  body: "text-base text-text-primary font-sans",
  bodySecondary: "text-base text-text-secondary font-sans",
  small: "text-sm text-text-secondary",
  caption: "text-xs text-text-secondary",
  
  // Interactive
  button: "text-sm font-medium",
  link: "text-primary hover:text-primary/80 underline-offset-4 hover:underline"
};

// Usage in components
const ContentCard = ({ title, description, actions }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className={TypographyScale.h3}>{title}</h3>
      <p className={TypographyScale.bodySecondary}>{description}</p>
      <div className="mt-4 space-x-2">
        {actions?.map((action) => (
          <button key={action.id} className={TypographyScale.button}>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
```

### Spacing & Layout System

#### Consistent Spacing Patterns
```javascript
// ✅ CORRECT: Consistent spacing
const LayoutComponents = {
  // Card layouts
  card: "bg-card border border-border rounded-lg p-6 shadow-sm",
  cardHeader: "pb-4 border-b border-border",
  cardBody: "py-4",
  cardFooter: "pt-4 border-t border-border",
  
  // Form layouts
  formGroup: "space-y-2",
  formRow: "grid grid-cols-1 md:grid-cols-2 gap-4",
  inputGroup: "relative",
  
  // Navigation
  navContainer: "bg-surface border-b border-border px-6 py-4",
  navItems: "flex items-center space-x-6",
  
  // Content sections
  section: "py-12",
  container: "container mx-auto px-4",
  contentGrid: "grid grid-cols-1 lg:grid-cols-12 gap-6"
};
```

### Component Patterns

#### Form Components
```javascript
// ✅ CORRECT: Form component with design system
const FormField = ({ label, error, children, required }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

const Input = ({ className = "", error, ...props }) => {
  return (
    <input
      className={`
        w-full px-3 py-2 
        bg-input border border-border rounded-md
        text-text-primary placeholder:text-text-secondary
        focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error ? 'border-error focus:ring-error' : ''}
        ${className}
      `}
      {...props}
    />
  );
};
```

#### Interactive Components
```javascript
// ✅ CORRECT: Interactive states
const InteractiveCard = ({ onClick, disabled, selected, children }) => {
  return (
    <div
      className={`
        bg-card border border-border rounded-lg p-4
        transition-all duration-200 cursor-pointer
        hover:shadow-md hover:border-primary/50
        focus:outline-none focus:ring-2 focus:ring-ring
        ${selected ? 'border-primary bg-primary/5' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};
```

### Responsive Design Patterns

#### Mobile-First Approach
```javascript
// ✅ CORRECT: Mobile-first responsive design
const ResponsiveLayout = ({ sidebar, main, actions }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden bg-surface border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
          {actions}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-6 lg:container lg:mx-auto lg:p-6">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-card border border-border rounded-lg p-4">
            {sidebar}
          </div>
        </aside>

        {/* Main content */}
        <main className="p-4 lg:p-0 lg:col-span-9">
          <div className="space-y-6">
            {main}
          </div>
        </main>
      </div>
    </div>
  );
};
```

### Animation & Transitions

#### Consistent Motion Design
```javascript
// ✅ CORRECT: Design system animations
const AnimatedComponents = {
  // Fade in animation
  fadeIn: "animate-fade-in",
  
  // Scale in animation  
  scaleIn: "animate-scale-in",
  
  // Smooth transitions
  transition: "transition-all duration-200 ease-smooth",
  
  // Loading states
  pulse: "animate-pulse",
  
  // Interactive feedback
  buttonPress: "active:scale-95 transition-transform duration-100"
};

// Usage in components
const LoadingCard = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-muted rounded w-1/2"></div>
    </div>
  );
};
```

### Accessibility Patterns

#### WCAG Compliant Components
```javascript
// ✅ CORRECT: Accessible components
const AccessibleModal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-glass"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal content */}
      <div className="relative bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
        <h2 id="modal-title" className="text-xl font-semibold text-text-primary mb-4">
          {title}
        </h2>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-ring rounded"
          aria-label="Close modal"
        >
          ✕
        </button>
        
        {children}
      </div>
    </div>
  );
};
```

## 🚨 Tailwind Anti-Patterns to Avoid

1. **Hard-coded Colors**: Never use `text-blue-600`, use `text-primary`
2. **Inconsistent Spacing**: Use design system spacing classes
3. **Missing Hover States**: Always include interactive feedback
4. **No Focus States**: Include focus rings for accessibility  
5. **Arbitrary Values**: Use design tokens instead of arbitrary CSS
6. **Missing Responsive Classes**: Always consider mobile-first design

## 📋 Tailwind Design System Checklist

- [ ] Using CSS variable-based colors from design system
- [ ] Mobile-first responsive design approach
- [ ] Consistent spacing and typography scale
- [ ] Proper hover, focus, and active states
- [ ] Accessibility attributes and ARIA labels
- [ ] Loading and error states included
- [ ] Smooth transitions and animations
- [ ] Design system component patterns followed