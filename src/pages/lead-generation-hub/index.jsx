import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import NotificationCenter from '../../components/ui/NotificationCenter';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import MetricsCard from './components/MetricsCard';
import FormCard from './components/FormCard';
import EmailListCard from './components/EmailListCard';
import FormBuilder from './components/FormBuilder';
import AnalyticsChart from './components/AnalyticsChart';
import LeadContactModal from './components/LeadContactModal';

const LeadGenerationHub = () => {
  const [activeTab, setActiveTab] = useState('forms');
  const [isFormBuilderOpen, setIsFormBuilderOpen] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for metrics
  const metricsData = [
    {
      title: 'Total Leads',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'primary'
    },
    {
      title: 'Conversion Rate',
      value: '18.3%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      title: 'Active Forms',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: 'FileText',
      color: 'accent'
    },
    {
      title: 'This Month',
      value: '486',
      change: '+24.8%',
      changeType: 'positive',
      icon: 'Calendar',
      color: 'warning'
    }
  ];

  // Mock data for forms
  const [forms, setForms] = useState([
    {
      id: '1',
      name: 'Crypto Newsletter Signup',
      description: 'Weekly insights on Web3 trends and opportunities',
      status: 'active',
      views: 1247,
      submissions: 189,
      conversionRate: 15.2,
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop',
      createdAt: '2025-01-15',
      fields: [
        { id: '1', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
        { id: '2', type: 'text', label: 'First Name', required: false, placeholder: 'Your first name' }
      ],
      settings: {
        submitText: 'Subscribe Now',
        successMessage: 'Welcome to our crypto community!',
        redirectUrl: '',
        collectConsent: true,
        doubleOptIn: true
      }
    },
    {
      id: '2',
      name: 'Free DeFi Guide Download',
      description: 'Get our comprehensive guide to DeFi protocols',
      status: 'active',
      views: 892,
      submissions: 156,
      conversionRate: 17.5,
      thumbnail: 'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=400&h=200&fit=crop',
      createdAt: '2025-01-10',
      fields: [
        { id: '1', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
        { id: '2', type: 'text', label: 'Name', required: true, placeholder: 'Full name' },
        { id: '3', type: 'select', label: 'Experience Level', required: false, options: ['Beginner', 'Intermediate', 'Advanced'] }
      ],
      settings: {
        submitText: 'Download Guide',
        successMessage: 'Check your email for the download link!',
        redirectUrl: '/thank-you',
        collectConsent: true,
        doubleOptIn: false
      }
    },
    {
      id: '3',
      name: 'Web3 Consultation Booking',
      description: 'Book a free 30-minute consultation call',
      status: 'paused',
      views: 634,
      submissions: 42,
      conversionRate: 6.6,
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=200&fit=crop',
      createdAt: '2025-01-05',
      fields: [
        { id: '1', type: 'email', label: 'Email Address', required: true, placeholder: 'Enter your email' },
        { id: '2', type: 'text', label: 'Company Name', required: false, placeholder: 'Your company' },
        { id: '3', type: 'tel', label: 'Phone Number', required: true, placeholder: 'Phone number' },
        { id: '4', type: 'textarea', label: 'Project Details', required: false, placeholder: 'Tell us about your project' }
      ],
      settings: {
        submitText: 'Book Consultation',
        successMessage: 'We\'ll contact you within 24 hours!',
        redirectUrl: '',
        collectConsent: true,
        doubleOptIn: false
      }
    }
  ]);

  // Mock data for email lists
  const [emailLists, setEmailLists] = useState([
    {
      id: '1',
      name: 'Crypto Newsletter',
      description: 'Weekly crypto market insights and analysis',
      status: 'active',
      subscribers: 2847,
      growth: 12.5,
      engagementRate: 24.3,
      lastCampaign: '2 days ago',
      tags: ['Newsletter', 'Crypto', 'Weekly'],
      contacts: [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+1 (555) 123-4567',
          source: 'Newsletter Form',
          dateAdded: '2025-01-18',
          status: 'active'
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael.chen@example.com',
          phone: '',
          source: 'DeFi Guide',
          dateAdded: '2025-01-17',
          status: 'active'
        },
        {
          id: '3',
          name: 'Emma Rodriguez',
          email: 'emma.r@example.com',
          phone: '+1 (555) 987-6543',
          source: 'Consultation Form',
          dateAdded: '2025-01-16',
          status: 'pending'
        }
      ]
    },
    {
      id: '2',
      name: 'DeFi Enthusiasts',
      description: 'Advanced DeFi strategies and protocol updates',
      status: 'active',
      subscribers: 1456,
      growth: 8.7,
      engagementRate: 31.2,
      lastCampaign: '5 days ago',
      tags: ['DeFi', 'Advanced', 'Protocols'],
      contacts: [
        {
          id: '4',
          name: 'David Kim',
          email: 'david.kim@example.com',
          phone: '+1 (555) 456-7890',
          source: 'DeFi Guide',
          dateAdded: '2025-01-15',
          status: 'active'
        },
        {
          id: '5',
          name: 'Lisa Wang',
          email: 'lisa.wang@example.com',
          phone: '',
          source: 'Newsletter Form',
          dateAdded: '2025-01-14',
          status: 'active'
        }
      ]
    },
    {
      id: '3',
      name: 'Consultation Leads',
      description: 'Potential clients interested in Web3 consulting',
      status: 'active',
      subscribers: 234,
      growth: -2.1,
      engagementRate: 18.7,
      lastCampaign: '1 week ago',
      tags: ['Consulting', 'B2B', 'High-Value'],
      contacts: [
        {
          id: '6',
          name: 'Robert Taylor',
          email: 'robert.t@example.com',
          phone: '+1 (555) 321-0987',
          source: 'Consultation Form',
          dateAdded: '2025-01-13',
          status: 'active'
        }
      ]
    }
  ]);

  // Mock analytics data
  const analyticsData = {
    conversionFunnel: [
      { name: 'Page Views', value: 5420 },
      { name: 'Form Views', value: 3240 },
      { name: 'Started', value: 1890 },
      { name: 'Completed', value: 847 }
    ],
    trafficSources: [
      { name: 'Direct', value: 35 },
      { name: 'Social Media', value: 28 },
      { name: 'Search', value: 22 },
      { name: 'Referral', value: 15 }
    ],
    monthlyLeads: [
      { name: 'Jan', value: 245 },
      { name: 'Feb', value: 312 },
      { name: 'Mar', value: 289 },
      { name: 'Apr', value: 378 },
      { name: 'May', value: 445 },
      { name: 'Jun', value: 523 },
      { name: 'Jul', value: 486 }
    ]
  };

  const handleCreateForm = () => {
    setEditingForm(null);
    setIsFormBuilderOpen(true);
  };

  const handleEditForm = (formId) => {
    const form = forms.find(f => f.id === formId);
    setEditingForm(form);
    setIsFormBuilderOpen(true);
  };

  const handleSaveForm = (formData) => {
    if (editingForm) {
      setForms(prev => prev.map(form => 
        form.id === editingForm.id 
          ? { ...form, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : form
      ));
    } else {
      const newForm = {
        ...formData,
        id: Date.now().toString(),
        status: 'active',
        views: 0,
        submissions: 0,
        conversionRate: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setForms(prev => [newForm, ...prev]);
    }
  };

  const handleDeleteForm = (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      setForms(prev => prev.filter(form => form.id !== formId));
    }
  };

  const handleDuplicateForm = (formId) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      const duplicatedForm = {
        ...form,
        id: Date.now().toString(),
        name: `${form.name} (Copy)`,
        views: 0,
        submissions: 0,
        conversionRate: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setForms(prev => [duplicatedForm, ...prev]);
    }
  };

  const handleToggleFormStatus = (formId) => {
    setForms(prev => prev.map(form => 
      form.id === formId 
        ? { ...form, status: form.status === 'active' ? 'paused' : 'active' }
        : form
    ));
  };

  const handleViewContacts = (listId) => {
    const list = emailLists.find(l => l.id === listId);
    setSelectedList(list);
    setIsContactModalOpen(true);
  };

  const handleExportList = (listId) => {
    const list = emailLists.find(l => l.id === listId);
    if (list) {
      const csvContent = [
        ['Name', 'Email', 'Phone', 'Source', 'Date Added', 'Status'],
        ...list.contacts.map(contact => [
          contact.name,
          contact.email,
          contact.phone || '',
          contact.source,
          contact.dateAdded,
          contact.status
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${list.name}-contacts.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLists = emailLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mobile-full-height mobile-viewport-fix bg-background">
      <Header />
      <div className="hidden lg:block">
        <QuickActionToolbar />
      </div>
      
      <div className="px-4 lg:px-6 py-4 lg:py-6 pb-mobile-safe">
        <NavigationBreadcrumbs />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">Lead Generation Hub</h1>
            <p className="text-text-secondary mt-1 lg:mt-2">
              Manage your lead capture forms, email lists, and conversion analytics
            </p>
          </div>
          
          <div className="flex items-center justify-between lg:justify-end gap-3">
            <div className="lg:hidden flex-1">
              <NotificationCenter />
            </div>
            <div className="hidden lg:block">
              <NotificationCenter />
            </div>
            <Button
              onClick={handleCreateForm}
              iconName="Plus"
              iconPosition="left"
              className="flex-shrink-0"
            >
              <span className="hidden sm:inline">Create Form</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
          {metricsData.map((metric, index) => (
            <MetricsCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
              color={metric.color}
            />
          ))}
        </div>

        <div className="bg-surface border border-border rounded-lg shadow-subtle">
          <div className="border-b border-border">
            <div className="flex space-x-4 lg:space-x-8 px-4 lg:px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('forms')}
                className={`py-3 lg:py-4 px-1 border-b-2 font-medium text-sm transition-smooth whitespace-nowrap ${
                  activeTab === 'forms'
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={16} />
                  <span>Forms ({forms.length})</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('lists')}
                className={`py-3 lg:py-4 px-1 border-b-2 font-medium text-sm transition-smooth whitespace-nowrap ${
                  activeTab === 'lists' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} />
                  <span>Lists ({emailLists.length})</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-3 lg:py-4 px-1 border-b-2 font-medium text-sm transition-smooth whitespace-nowrap ${
                  activeTab === 'analytics' ?'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="BarChart3" size={16} />
                  <span className="hidden sm:inline">Analytics</span>
                  <span className="sm:hidden">Stats</span>
                </div>
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            {(activeTab === 'forms' || activeTab === 'lists') && (
              <div className="mb-4 lg:mb-6">
                <div className="max-w-md">
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    iconName="Search"
                  />
                </div>
              </div>
            )}

            {activeTab === 'forms' && (
              <div>
                {filteredForms.length === 0 ? (
                  <div className="text-center py-8 lg:py-12">
                    <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {searchTerm ? 'No forms found' : 'No forms created yet'}
                    </h3>
                    <p className="text-text-secondary mb-4 lg:mb-6">
                      {searchTerm 
                        ? 'Try adjusting your search terms' :'Create your first lead capture form to start collecting subscribers'
                      }
                    </p>
                    {!searchTerm && (
                      <Button onClick={handleCreateForm} iconName="Plus" iconPosition="left">
                        Create Your First Form
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {filteredForms.map((form) => (
                      <FormCard
                        key={form.id}
                        form={form}
                        onEdit={handleEditForm}
                        onDelete={handleDeleteForm}
                        onDuplicate={handleDuplicateForm}
                        onToggleStatus={handleToggleFormStatus}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'lists' && (
              <div>
                {filteredLists.length === 0 ? (
                  <div className="text-center py-8 lg:py-12">
                    <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {searchTerm ? 'No lists found' : 'No email lists yet'}
                    </h3>
                    <p className="text-text-secondary mb-4 lg:mb-6">
                      {searchTerm 
                        ? 'Try adjusting your search terms' :'Email lists will appear here as you collect subscribers through your forms'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {filteredLists.map((list) => (
                      <EmailListCard
                        key={list.id}
                        list={list}
                        onExport={handleExportList}
                        onEdit={() => {}}
                        onDelete={() => {}}
                        onViewContacts={handleViewContacts}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <AnalyticsChart
                    type="line"
                    data={analyticsData.monthlyLeads}
                    title="Monthly Lead Generation"
                    height={250}
                  />
                  <AnalyticsChart
                    type="bar"
                    data={analyticsData.conversionFunnel}
                    title="Conversion Funnel"
                    height={250}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <AnalyticsChart
                    type="pie"
                    data={analyticsData.trafficSources}
                    title="Traffic Sources"
                    height={300}
                  />
                  
                  <div className="bg-surface border border-border rounded-lg p-4 lg:p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Performance Summary</h3>
                    <div className="space-y-3 lg:space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <Icon name="TrendingUp" size={20} className="text-success" />
                          <div>
                            <p className="font-medium text-text-primary text-sm lg:text-base">Best Performing Form</p>
                            <p className="text-xs lg:text-sm text-text-secondary">Free DeFi Guide Download</p>
                          </div>
                        </div>
                        <span className="text-base lg:text-lg font-bold text-success">17.5%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <Icon name="Users" size={20} className="text-primary" />
                          <div>
                            <p className="font-medium text-text-primary text-sm lg:text-base">Most Engaged List</p>
                            <p className="text-xs lg:text-sm text-text-secondary">DeFi Enthusiasts</p>
                          </div>
                        </div>
                        <span className="text-base lg:text-lg font-bold text-primary">31.2%</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center space-x-3">
                          <Icon name="Calendar" size={20} className="text-accent" />
                          <div>
                            <p className="font-medium text-text-primary text-sm lg:text-base">This Month's Growth</p>
                            <p className="text-xs lg:text-sm text-text-secondary">New subscribers added</p>
                          </div>
                        </div>
                        <span className="text-base lg:text-lg font-bold text-accent">+486</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FormBuilder
        isOpen={isFormBuilderOpen}
        onClose={() => setIsFormBuilderOpen(false)}
        onSave={handleSaveForm}
        editingForm={editingForm}
      />

      {selectedList && (
        <LeadContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          contacts={selectedList.contacts}
          listName={selectedList.name}
        />
      )}
    </div>
  );
};

export default LeadGenerationHub;