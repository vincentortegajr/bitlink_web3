import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const TypingIndicator = ({ model = 'llama2' }) => {
  const getModelInfo = () => {
    switch (model) {
      case 'llama2':
        return { name: '🦙 Llama 2', color: 'text-blue-600' };
      case 'mistral':
        return { name: '⚡ Mistral', color: 'text-purple-600' };
      case 'codellama':
        return { name: '💻 Code Llama', color: 'text-green-600' };
      case 'custom':
        return { name: '✨ Custom GPT', color: 'text-indigo-600' };
      default:
        return { name: '🤖 AI Assistant', color: 'text-gray-600' };
    }
  };

  const modelInfo = getModelInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start"
    >
      <div className="flex max-w-[85%] md:max-w-[70%] gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        {/* Typing Content */}
        <div className="flex flex-col items-start">
          <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 max-w-full">
            {/* Typing Animation */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                AI is thinking...
              </span>
            </div>

            {/* Model Badge */}
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className={`text-xs ${modelInfo.color}`}>
                {modelInfo.name} • Powered by Ollama
              </span>
            </div>
          </div>

          {/* Processing Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-xs text-gray-400 flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full"
            />
            <span>Processing on VPS...</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;