import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import NotificationCenter from '../../components/ui/NotificationCenter';
import TabNavigation from './components/TabNavigation';
import SocialLinksTab from './components/SocialLinksTab';
import EbooksTab from './components/EbooksTab';
import LeadMagnetsTab from './components/LeadMagnetsTab';
import BulkActionsToolbar from './components/BulkActionsToolbar';

const LinkContentManagement = () => {
  const [activeTab, setActiveTab] = useState('social-links');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for social links
  const [socialLinks, setSocialLinks] = useState([
    {
      id: '1',
      title: 'Follow me on Twitter',
      url: 'https://twitter.com/cryptouser',
      platform: 'twitter',
      description: 'Latest crypto insights and market analysis',
      clicks: 1247,
      isActive: true,
      createdAt: new Date('2025-01-15')
    },
    {
      id: '2',
      title: 'LinkedIn Profile',
      url: 'https://linkedin.com/in/cryptouser',
      platform: 'linkedin',
      description: 'Professional blockchain consulting services',
      clicks: 892,
      isActive: true,
      createdAt: new Date('2025-01-10')
    },
    {
      id: '3',
      title: 'YouTube Channel',
      url: 'https://youtube.com/cryptouser',
      platform: 'youtube',
      description: 'Weekly crypto tutorials and reviews',
      clicks: 2156,
      isActive: false,
      createdAt: new Date('2025-01-08')
    },
    {
      id: '4',
      title: 'GitHub Repository',
      url: 'https://github.com/cryptouser',
      platform: 'github',
      description: 'Open source DeFi projects and smart contracts',
      clicks: 634,
      isActive: true,
      createdAt: new Date('2025-01-05')
    }
  ]);

  // Mock data for ebooks
  const [ebooks, setEbooks] = useState([
    {
      id: '1',
      title: 'Complete Guide to DeFi Trading',
      description: 'Master decentralized finance trading strategies and risk management techniques for maximum profit.',
      fileName: 'defi-trading-guide.pdf',
      fileSize: 2457600,
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=600&fit=crop&crop=center',
      downloads: 1543,
      revenue: 2314.50,
      price: '29.99',
      category: 'DeFi & Trading',
      isActive: true,
      uploadedAt: new Date('2025-01-12')
    },
    {
      id: '2',
      title: 'NFT Creator Handbook',
      description: 'Everything you need to know about creating, minting, and selling NFTs in 2025.',
      fileName: 'nft-creator-handbook.pdf',
      fileSize: 1876543,
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop&crop=center',
      downloads: 987,
      revenue: 1975.00,
      price: '19.99',
      category: 'NFTs & Digital Art',
      isActive: true,
      uploadedAt: new Date('2025-01-08')
    },
    {
      id: '3',
      title: 'Smart Contract Security Audit',
      description: 'Learn how to audit smart contracts for vulnerabilities and security best practices.',
      fileName: 'smart-contract-security.pdf',
      fileSize: 3245678,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop&crop=center',
      downloads: 456,
      revenue: 912.00,
      price: '39.99',
      category: 'Smart Contracts',
      isActive: false,
      uploadedAt: new Date('2025-01-03')
    }
  ]);

  // Mock data for lead magnets
  const [leadMagnets, setLeadMagnets] = useState([
    {
      id: '1',
      title: 'Free Crypto Portfolio Tracker',
      description: 'Download our Excel template to track your crypto investments and performance.',
      type: 'popup',
      targetAudience: 'Crypto investors',
      callToAction: 'Download Free Template',
      incentive: 'Free Excel Template',
      views: 5432,
      conversions: 876,
      conversionRate: 16.1,
      isActive: true,
      createdAt: new Date('2025-01-14'),
      abTestVariants: ['Variant A', 'Variant B']
    },
    {
      id: '2',
      title: 'DeFi Yield Farming Calculator',
      description: 'Calculate potential returns from various DeFi yield farming strategies.',
      type: 'inline',
      targetAudience: 'DeFi farmers',
      callToAction: 'Get Calculator',
      incentive: 'Free Calculator Tool',
      views: 3210,
      conversions: 234,
      conversionRate: 7.3,
      isActive: true,
      createdAt: new Date('2025-01-11'),
      abTestVariants: []
    },
    {
      id: '3',
      title: 'Weekly Crypto Newsletter',
      description: 'Stay updated with the latest crypto news, analysis, and market insights.',
      type: 'exit-intent',
      targetAudience: 'Crypto enthusiasts',
      callToAction: 'Subscribe Now',
      incentive: 'Weekly Newsletter',
      views: 8765,
      conversions: 1234,
      conversionRate: 14.1,
      isActive: false,
      createdAt: new Date('2025-01-06'),
      abTestVariants: ['Original', 'Variant A', 'Variant B']
    }
  ]);

  // Handle tab changes and clear selections
  useEffect(() => {
    setSelectedItems([]);
    setSearchQuery('');
  }, [activeTab]);

  // Social Links handlers
  const handleAddLink = (newLink) => {
    setSocialLinks(prev => [newLink, ...prev]);
  };

  const handleEditLink = (id, updatedLink) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, ...updatedLink } : link
    ));
  };

  const handleDeleteLink = (id) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleReorderLinks = (draggedId, targetId) => {
    const draggedIndex = socialLinks.findIndex(link => link.id === draggedId);
    const targetIndex = socialLinks.findIndex(link => link.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      const newLinks = [...socialLinks];
      const [draggedItem] = newLinks.splice(draggedIndex, 1);
      newLinks.splice(targetIndex, 0, draggedItem);
      setSocialLinks(newLinks);
    }
  };

  // Ebooks handlers
  const handleAddEbook = (newEbook) => {
    setEbooks(prev => [newEbook, ...prev]);
  };

  const handleEditEbook = (id, updatedEbook) => {
    setEbooks(prev => prev.map(ebook => 
      ebook.id === id ? { ...ebook, ...updatedEbook } : ebook
    ));
  };

  const handleDeleteEbook = (id) => {
    setEbooks(prev => prev.filter(ebook => ebook.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleReplaceEbook = (id) => {
    // Simulate file replacement
    console.log('Replace ebook:', id);
  };

  // Lead Magnets handlers
  const handleAddLeadMagnet = (newMagnet) => {
    setLeadMagnets(prev => [newMagnet, ...prev]);
  };

  const handleEditLeadMagnet = (id, updatedMagnet) => {
    setLeadMagnets(prev => prev.map(magnet => 
      magnet.id === id ? { ...magnet, ...updatedMagnet } : magnet
    ));
  };

  const handleDeleteLeadMagnet = (id) => {
    setLeadMagnets(prev => prev.filter(magnet => magnet.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  // Selection handlers
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (activeTab === 'social-links') {
      setSocialLinks(prev => prev.filter(link => !selectedItems.includes(link.id)));
    } else if (activeTab === 'ebooks') {
      setEbooks(prev => prev.filter(ebook => !selectedItems.includes(ebook.id)));
    } else if (activeTab === 'lead-magnets') {
      setLeadMagnets(prev => prev.filter(magnet => !selectedItems.includes(magnet.id)));
    }
    setSelectedItems([]);
  };

  const handleBulkToggleStatus = (isActive) => {
    if (activeTab === 'social-links') {
      setSocialLinks(prev => prev.map(link => 
        selectedItems.includes(link.id) ? { ...link, isActive } : link
      ));
    } else if (activeTab === 'ebooks') {
      setEbooks(prev => prev.map(ebook => 
        selectedItems.includes(ebook.id) ? { ...ebook, isActive } : ebook
      ));
    } else if (activeTab === 'lead-magnets') {
      setLeadMagnets(prev => prev.map(magnet => 
        selectedItems.includes(magnet.id) ? { ...magnet, isActive } : magnet
      ));
    }
    setSelectedItems([]);
  };

  const handleBulkExport = () => {
    // Simulate export functionality
    const exportData = {
      'social-links': socialLinks.filter(link => selectedItems.includes(link.id)),
      'ebooks': ebooks.filter(ebook => selectedItems.includes(ebook.id)),
      'lead-magnets': leadMagnets.filter(magnet => selectedItems.includes(magnet.id))
    };
    
    console.log('Exporting data:', exportData[activeTab]);
    setSelectedItems([]);
  };

  const counts = {
    socialLinks: socialLinks.length,
    ebooks: ebooks.length,
    leadMagnets: leadMagnets.length
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'social-links':
        return (
          <SocialLinksTab
            links={socialLinks}
            onAddLink={handleAddLink}
            onEditLink={handleEditLink}
            onDeleteLink={handleDeleteLink}
            onReorderLinks={handleReorderLinks}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case 'ebooks':
        return (
          <EbooksTab
            ebooks={ebooks}
            onAddEbook={handleAddEbook}
            onEditEbook={handleEditEbook}
            onDeleteEbook={handleDeleteEbook}
            onReplaceEbook={handleReplaceEbook}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      case 'lead-magnets':
        return (
          <LeadMagnetsTab
            leadMagnets={leadMagnets}
            onAddLeadMagnet={handleAddLeadMagnet}
            onEditLeadMagnet={handleEditLeadMagnet}
            onDeleteLeadMagnet={handleDeleteLeadMagnet}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Link & Content Management - BitLink Web3</title>
        <meta name="description" content="Manage your social links, ebooks, and lead magnets from a centralized dashboard. Organize, track, and optimize your digital content." />
      </Helmet>

      <Header />
      <QuickActionToolbar />

      <main className="container mx-auto px-4 lg:px-6 py-6 pb-24 sm:pb-6">
        <NavigationBreadcrumbs />

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Link & Content Management
            </h1>
            <p className="text-text-secondary">
              Organize and manage all your social links, ebooks, and lead magnets from one place
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <NotificationCenter />
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        {/* Bulk Actions Toolbar */}
        <BulkActionsToolbar
          selectedItems={selectedItems}
          onClearSelection={handleClearSelection}
          onBulkDelete={handleBulkDelete}
          onBulkToggleStatus={handleBulkToggleStatus}
          onBulkExport={handleBulkExport}
          activeTab={activeTab}
        />

        {/* Tab Content */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default LinkContentManagement;