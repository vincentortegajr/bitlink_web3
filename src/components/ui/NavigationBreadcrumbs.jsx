import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumbs = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  const getDefaultBreadcrumbs = (pathname) => {
    const pathMap = {
      '/profile-builder-dashboard': [
        { label: 'Build', path: '/profile-builder-dashboard', current: true }
      ],
      '/link-content-management': [
        { label: 'Manage', path: '/link-content-management', current: true }
      ],
      '/crypto-payment-setup': [
        { label: 'Payments', path: '/crypto-payment-setup', current: true }
      ],
      '/lead-generation-hub': [
        { label: 'Leads', path: '/lead-generation-hub', current: true }
      ],
      '/analytics-performance-dashboard': [
        { label: 'Analytics', path: '/analytics-performance-dashboard', current: true }
      ]
    };

    return pathMap[pathname] || [];
  };

  const breadcrumbs = customBreadcrumbs || getDefaultBreadcrumbs(location.pathname);

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center hover:text-text-primary transition-smooth"
      >
        <Icon name="Home" size={16} />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path || index}>
          <Icon name="ChevronRight" size={14} className="text-border" />
          
          {crumb.current ? (
            <span className="text-text-primary font-medium" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-text-primary transition-smooth"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default NavigationBreadcrumbs;
