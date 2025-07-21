import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LeadContactModal = ({ isOpen, onClose, contacts, listName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 10;

  const filteredContacts = contacts.filter(contact =>
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);
  const startIndex = (currentPage - 1) * contactsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + contactsPerPage);

  const toggleContact = (contactId) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleAll = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(paginatedContacts.map(c => c.id));
    }
  };

  const exportSelected = () => {
    const selectedData = contacts.filter(c => selectedContacts.includes(c.id));
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Source', 'Date Added', 'Status'],
      ...selectedData.map(contact => [
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
    a.download = `${listName}-contacts.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      active: 'text-success bg-success/10',
      pending: 'text-warning bg-warning/10',
      unsubscribed: 'text-destructive bg-destructive/10'
    };
    return statusMap[status] || 'text-text-secondary bg-muted';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-prominent w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">{listName} Contacts</h2>
            <p className="text-sm text-text-secondary mt-1">
              {filteredContacts.length} contacts {searchTerm && `(filtered from ${contacts.length})`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Search and Actions */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                iconName="Search"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportSelected}
                disabled={selectedContacts.length === 0}
                iconName="Download"
                iconPosition="left"
              >
                Export Selected ({selectedContacts.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="flex-1 overflow-y-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="bg-muted/50 border-b border-border p-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </div>
                <div className="col-span-3 text-sm font-medium text-text-primary">Name</div>
                <div className="col-span-3 text-sm font-medium text-text-primary">Email</div>
                <div className="col-span-2 text-sm font-medium text-text-primary">Source</div>
                <div className="col-span-2 text-sm font-medium text-text-primary">Date Added</div>
                <div className="col-span-1 text-sm font-medium text-text-primary">Status</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {paginatedContacts.map((contact) => (
                <div key={contact.id} className="p-4 hover:bg-muted/30 transition-smooth">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContact(contact.id)}
                        className="rounded"
                      />
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {contact.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{contact.name}</p>
                          {contact.phone && (
                            <p className="text-xs text-text-secondary">{contact.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm text-text-primary">{contact.email}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md">
                        {contact.source}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-text-secondary">{contact.dateAdded}</p>
                    </div>
                    <div className="col-span-1">
                      <span className={`px-2 py-1 text-xs rounded-md ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-6 border-t border-border">
            <p className="text-sm text-text-secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + contactsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                iconName="ChevronLeft"
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm text-text-primary">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadContactModal;