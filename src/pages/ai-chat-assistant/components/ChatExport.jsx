import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Share, Copy, Check } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ChatExport = ({ messages, conversationName = 'AI Chat', onClose }) => {
  const [exportFormat, setExportFormat] = useState('text');
  const [copied, setCopied] = useState(false);

  const formatMessages = (format) => {
    const timestamp = new Date().toLocaleString();
    const header = `${conversationName}\nExported on ${timestamp}\n${'='.repeat(50)}\n\n`;

    switch (format) {
      case 'text':
        return header + messages.map(msg => 
          `[${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.type.toUpperCase()}: ${msg.content}`
        ).join('\n\n');
      
      case 'markdown':
        return `# ${conversationName}\n\n*Exported on ${timestamp}*\n\n` +
          messages.map(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString();
            const icon = msg.type === 'user' ? '👤' : '🤖';
            return `## ${icon} ${msg.type.charAt(0).toUpperCase() + msg.type.slice(1)} - ${time}\n\n${msg.content}`;
          }).join('\n\n---\n\n');
      
      case 'json':
        return JSON.stringify({
          conversationName,
          exportDate: timestamp,
          messages: messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp.toISOString()
          }))
        }, null, 2);
      
      default:
        return header + messages.map(msg => `${msg.type}: ${msg.content}`).join('\n\n');
    }
  };

  const downloadFile = (content, filename, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    const content = formatMessages(exportFormat);
    const extensions = {
      text: 'txt',
      markdown: 'md',
      json: 'json'
    };
    const contentTypes = {
      text: 'text/plain',
      markdown: 'text/markdown',
      json: 'application/json'
    };
    
    const filename = `${conversationName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extensions[exportFormat]}`;
    downloadFile(content, filename, contentTypes[exportFormat]);
  };

  const copyToClipboard = async () => {
    try {
      const content = formatMessages(exportFormat);
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const shareConversation = async () => {
    if (navigator.share) {
      try {
        const content = formatMessages('text');
        await navigator.share({
          title: conversationName,
          text: content.substring(0, 200) + '...',
          files: [new File([content], `${conversationName}.txt`, { type: 'text/plain' })]
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      copyToClipboard();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Download className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export Conversation
            </h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Save your conversation in different formats
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'text', label: 'Plain Text', icon: <FileText className="w-4 h-4" /> },
                { value: 'markdown', label: 'Markdown', icon: <FileText className="w-4 h-4" /> },
                { value: 'json', label: 'JSON', icon: <FileText className="w-4 h-4" /> }
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    exportFormat === format.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                >
                  {format.icon}
                  <span className="text-xs mt-1">{format.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Preview
            </label>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-32 overflow-y-auto">
              <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {formatMessages(exportFormat).substring(0, 300)}
                {formatMessages(exportFormat).length > 300 && '...'}
              </pre>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Messages:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {messages.length}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Size:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {Math.round(new Blob([formatMessages(exportFormat)]).size / 1024)} KB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={copyToClipboard}
              className="flex items-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            {navigator.share && (
              <Button
                variant="ghost"
                onClick={shareConversation}
                className="flex items-center space-x-2"
              >
                <Share className="w-4 h-4" />
                <span>Share</span>
              </Button>
            )}
            <Button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatExport;