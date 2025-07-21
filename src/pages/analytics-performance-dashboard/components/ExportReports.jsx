import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportReports = () => {
  const [selectedReport, setSelectedReport] = useState('comprehensive');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'comprehensive',
      name: 'Comprehensive Analytics',
      description: 'Complete overview including traffic, payments, leads, and performance metrics',
      icon: 'FileBarChart',
      estimatedSize: '2.5 MB'
    },
    {
      id: 'payment',
      name: 'Payment Analytics',
      description: 'Detailed payment history, revenue trends, and transaction analysis',
      icon: 'CreditCard',
      estimatedSize: '1.2 MB'
    },
    {
      id: 'lead-generation',
      name: 'Lead Generation Report',
      description: 'Lead conversion funnels, source analysis, and subscriber growth',
      icon: 'Users',
      estimatedSize: '1.8 MB'
    },
    {
      id: 'social-performance',
      name: 'Social Link Performance',
      description: 'Click-through rates, geographic data, and link optimization insights',
      icon: 'Share2',
      estimatedSize: '1.0 MB'
    },
    {
      id: 'ab-testing',
      name: 'A/B Testing Results',
      description: 'Test results, statistical significance, and optimization recommendations',
      icon: 'TestTube',
      estimatedSize: '0.8 MB'
    }
  ];

  const dateRanges = [
    { value: 'last-7-days', label: 'Last 7 days' },
    { value: 'last-30-days', label: 'Last 30 days' },
    { value: 'last-90-days', label: 'Last 90 days' },
    { value: 'this-month', label: 'This month' },
    { value: 'last-month', label: 'Last month' },
    { value: 'this-quarter', label: 'This quarter' },
    { value: 'custom', label: 'Custom range' }
  ];

  const formats = [
    { value: 'pdf', label: 'PDF Report', icon: 'FileText' },
    { value: 'csv', label: 'CSV Data', icon: 'Table' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: 'FileSpreadsheet' },
    { value: 'json', label: 'JSON Data', icon: 'Code' }
  ];

  const recentExports = [
    {
      id: '1',
      name: 'Comprehensive Analytics - January 2025',
      type: 'PDF Report',
      date: '2025-01-21 14:30',
      size: '2.3 MB',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Payment Data Export',
      type: 'CSV Data',
      date: '2025-01-20 09:15',
      size: '456 KB',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Lead Generation Report - Q1',
      type: 'PDF Report',
      date: '2025-01-19 16:45',
      size: '1.8 MB',
      status: 'completed'
    }
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    
    // In a real app, this would trigger the actual download
    const selectedReportData = reportTypes.find(r => r.id === selectedReport);
    alert(`${selectedReportData.name} report generated successfully!`);
  };

  const downloadReport = (reportId) => {
    // Simulate download
    alert(`Downloading report ${reportId}...`);
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Generate New Report</h3>
        
        {/* Report Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-3">Report Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg border text-left transition-smooth hover:shadow-medium ${
                  selectedReport === report.id 
                    ? 'border-primary bg-primary/5' :'border-border bg-muted hover:bg-muted/80'
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-md ${
                    selectedReport === report.id 
                      ? 'bg-primary/10 text-primary border border-primary/20' :'bg-accent/10 text-accent border border-accent/20'
                  }`}>
                    <Icon name={report.icon} size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{report.name}</h4>
                    <p className="text-xs text-text-secondary">~{report.estimatedSize}</p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">{report.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range & Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dateRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Export Format</label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((fmt) => (
                <button
                  key={fmt.value}
                  onClick={() => setFormat(fmt.value)}
                  className={`flex items-center space-x-2 p-2 rounded-md border text-sm transition-smooth ${
                    format === fmt.value 
                      ? 'border-primary bg-primary/5 text-primary' :'border-border bg-muted text-text-secondary hover:bg-muted/80'
                  }`}
                >
                  <Icon name={fmt.icon} size={16} />
                  <span>{fmt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-border rounded-md bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          variant="default"
          size="lg"
          onClick={handleGenerateReport}
          loading={isGenerating}
          iconName="Download"
          iconPosition="left"
          className="w-full md:w-auto"
        >
          {isGenerating ? 'Generating Report...' : 'Generate & Download Report'}
        </Button>
      </div>

      {/* Recent Exports */}
      <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-text-primary">Recent Exports</h3>
          <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {recentExports.map((export_item) => (
            <div key={export_item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-smooth">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-success/10 text-success rounded-md border border-success/20">
                  <Icon name="FileCheck" size={20} />
                </div>
                
                <div>
                  <h4 className="font-medium text-text-primary">{export_item.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary mt-1">
                    <span>{export_item.type}</span>
                    <span>•</span>
                    <span>{export_item.date}</span>
                    <span>•</span>
                    <span>{export_item.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadReport(export_item.id)}
                  iconName="Download"
                  iconPosition="left"
                >
                  Download
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Share"
                >
                  Share
                </Button>
              </div>
            </div>
          ))}
        </div>

        {recentExports.length === 0 && (
          <div className="text-center py-8">
            <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-text-secondary">No recent exports found</p>
            <p className="text-sm text-text-secondary mt-1">Generate your first report to see it here</p>
          </div>
        )}
      </div>

      {/* Export Tips */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-accent/10 text-accent rounded-md border border-accent/20">
            <Icon name="Lightbulb" size={20} />
          </div>
          
          <div>
            <h4 className="font-medium text-text-primary mb-2">Export Tips</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• PDF reports are best for presentations and sharing with stakeholders</li>
              <li>• CSV/Excel formats are ideal for further data analysis and manipulation</li>
              <li>• JSON exports are perfect for developers and API integrations</li>
              <li>• Reports are automatically deleted after 30 days for security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportReports;