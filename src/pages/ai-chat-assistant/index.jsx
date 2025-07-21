import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Settings, MessageSquare, Trash2, Download, Bot, Zap, Code, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

import ChatMessage from './components/ChatMessage';
import ModelSelector from './components/ModelSelector';
import ConversationSidebar from './components/ConversationSidebar';
import AdvancedSettings from './components/AdvancedSettings';
import VoiceInput from './components/VoiceInput';
import TypingIndicator from './components/TypingIndicator';
import ChatExport from './components/ChatExport';

const AIChatAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI assistant powered by Ollama. I can help you with various tasks, answer questions, and have meaningful conversations. What would you like to talk about today?",
      timestamp: new Date(),
      model: 'llama2'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('llama2');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentConversation, setCurrentConversation] = useState('New Chat');
  const [conversations] = useState([
    { id: 1, name: 'New Chat', lastMessage: 'Hello! How can I help you today?', timestamp: new Date() },
    { id: 2, name: 'Project Planning', lastMessage: 'Let me help you create a roadmap...', timestamp: new Date(Date.now() - 3600000) },
    { id: 3, name: 'Code Review', lastMessage: 'The function looks good, but...', timestamp: new Date(Date.now() - 7200000) }
  ]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual Ollama API call)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: `I understand you're asking about "${input.trim()}". This is a simulated response from the ${selectedModel} model. In the actual implementation, this would connect to your Ollama instance running on the VPS to provide real AI responses with streaming support.`,
        timestamp: new Date(),
        model: selectedModel
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([{
      id: 1,
      type: 'assistant',
      content: "New conversation started! How can I assist you today?",
      timestamp: new Date(),
      model: selectedModel
    }]);
  };

  const exportConversation = () => {
    // Export functionality will be implemented in ChatExport component
    console.log('Exporting conversation...', messages);
  };

  const availableModels = [
    { value: 'llama2', label: 'Llama 2 7B', icon: <Bot className="w-4 h-4" />, description: 'General purpose conversation' },
    { value: 'mistral', label: 'Mistral 7B', icon: <Zap className="w-4 h-4" />, description: 'Fast and efficient responses' },
    { value: 'codellama', label: 'Code Llama', icon: <Code className="w-4 h-4" />, description: 'Specialized for coding' },
    { value: 'custom', label: 'Custom GPT', icon: <Sparkles className="w-4 h-4" />, description: 'Your personalized AI avatar' }
  ];

  return (
    <div className="mobile-full-height mobile-viewport-fix bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar for Desktop */}
      <div className={`hidden lg:flex lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col ${showSidebar ? 'flex' : 'hidden'}`}>
        <ConversationSidebar 
          conversations={conversations}
          currentConversation={currentConversation}
          onSelectConversation={setCurrentConversation}
          onNewConversation={() => setCurrentConversation('New Chat')}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 z-50 lg:hidden"
            >
              <ConversationSidebar 
                conversations={conversations}
                currentConversation={currentConversation}
                onSelectConversation={setCurrentConversation}
                onNewConversation={() => setCurrentConversation('New Chat')}
                onClose={() => setShowSidebar(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden"
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentConversation}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Powered by {availableModels.find(m => m.value === selectedModel)?.label} • Ollama on VPS
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ModelSelector 
                models={availableModels}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportConversation}
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearConversation}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mobile-scroll-container scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              selectedModel={selectedModel}
            />
          ))}
          
          {isTyping && <TypingIndicator model={selectedModel} />}
          
          <div ref={messagesEndRef} />
          {/* Mobile safe area at bottom */}
          <div className="h-4 lg:h-0 safe-area-pb"></div>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 safe-area-pb">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full min-h-[48px] max-h-32 p-3 pr-24 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors touch-manipulation"
                  rows={1}
                />
                <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                  <VoiceInput onVoiceInput={(text) => setInput(prev => prev + text)} />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-8 w-8 min-w-[32px] min-h-[32px] touch-manipulation"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="min-h-[48px] h-12 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3 overflow-x-auto scrollbar-thin">
            {[
              'Explain this concept',
              'Write a summary',
              'Generate ideas',
              'Code review',
              'Create content',
              'Brainstorm solutions'
            ].map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setInput(action + ': ')}
                className="text-xs px-3 py-2 h-auto bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shrink-0 touch-manipulation min-h-[36px]"
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <AdvancedSettings
            onClose={() => setShowSettings(false)}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatAssistant;