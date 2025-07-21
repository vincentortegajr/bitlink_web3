import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ModelSelector = ({ models, selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedModelData = models.find(m => m.value === selectedModel);

  const handleModelSelect = (modelValue) => {
    onModelChange(modelValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 min-w-[120px] justify-between"
      >
        <div className="flex items-center space-x-2">
          {selectedModelData?.icon}
          <span className="text-sm font-medium hidden sm:inline">
            {selectedModelData?.label}
          </span>
          <span className="text-sm font-medium sm:hidden">
            Model
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50"
            >
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                  Available Models
                </div>
                {models.map((model) => (
                  <button
                    key={model.value}
                    onClick={() => handleModelSelect(model.value)}
                    className="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-600 dark:text-gray-300">
                        {model.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {model.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {model.description}
                        </div>
                      </div>
                    </div>
                    {selectedModel === model.value && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <strong>Tip:</strong> Switch models anytime during conversation. Each model has unique capabilities and response styles.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector;