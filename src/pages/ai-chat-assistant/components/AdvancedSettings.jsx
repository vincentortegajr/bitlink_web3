import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sliders, Thermometer, Hash, Clock, Zap, Brain, Save } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AdvancedSettings = ({ onClose, selectedModel, onModelChange }) => {
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    repeatPenalty: 1.1,
    contextWindow: 4096,
    systemPrompt: "You are a helpful AI assistant. Be concise, accurate, and friendly in your responses."
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    setSettings({
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      repeatPenalty: 1.1,
      contextWindow: 4096,
      systemPrompt: "You are a helpful AI assistant. Be concise, accurate, and friendly in your responses."
    });
  };

  const saveSettings = () => {
    // Save settings to local storage or send to backend
    localStorage.setItem('aiChatSettings', JSON.stringify(settings));
    onClose();
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Sliders className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Advanced Settings
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Model Configuration */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Model Configuration</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Temperature */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Thermometer className="w-4 h-4" />
                    <span>Temperature: {settings.temperature}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Hash className="w-4 h-4" />
                    <span>Max Tokens</span>
                  </label>
                  <Input
                    type="number"
                    value={settings.maxTokens}
                    onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                    min="100"
                    max="8192"
                    step="100"
                  />
                </div>

                {/* Top P */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Zap className="w-4 h-4" />
                    <span>Top P: {settings.topP}</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.topP}
                    onChange={(e) => handleSettingChange('topP', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Repeat Penalty */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span>Repeat Penalty: {settings.repeatPenalty}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={settings.repeatPenalty}
                    onChange={(e) => handleSettingChange('repeatPenalty', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Context Window */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Context Window</span>
                  </label>
                  <Select
                    value={settings.contextWindow.toString()}
                    onValueChange={(value) => handleSettingChange('contextWindow', parseInt(value))}
                  >
                    <option value="2048">2K tokens (Fast)</option>
                    <option value="4096">4K tokens (Balanced)</option>
                    <option value="8192">8K tokens (Extended)</option>
                    <option value="16384">16K tokens (Maximum)</option>
                  </Select>
                </div>
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                System Prompt
              </h3>
              <textarea
                value={settings.systemPrompt}
                onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
                placeholder="Enter custom system prompt to define AI behavior..."
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                This prompt will be sent at the beginning of every conversation to set the AI's behavior and personality.
              </p>
            </div>

            {/* Preset Templates */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Preset Templates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'General Assistant', prompt: 'You are a helpful AI assistant. Be concise, accurate, and friendly in your responses.' },
                  { name: 'Code Helper', prompt: 'You are an expert programmer. Help with coding questions, debugging, and best practices. Always explain your solutions clearly.' },
                  { name: 'Creative Writer', prompt: 'You are a creative writing assistant. Help with storytelling, character development, and creative content creation.' },
                  { name: 'Business Advisor', prompt: 'You are a business consultant. Provide strategic advice, market insights, and professional guidance.' },
                  { name: 'Study Buddy', prompt: 'You are a patient tutor. Help explain complex concepts in simple terms and encourage learning.' },
                  { name: 'Brainstorming Partner', prompt: 'You are an innovative brainstorming partner. Generate creative ideas and help explore different possibilities.' }
                ].map((preset) => (
                  <Button
                    key={preset.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSettingChange('systemPrompt', preset.prompt)}
                    className="text-left p-3 h-auto bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div>
                      <div className="font-medium text-sm">{preset.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {preset.prompt.substring(0, 60)}...
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <Button
            variant="ghost"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </Button>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedSettings;