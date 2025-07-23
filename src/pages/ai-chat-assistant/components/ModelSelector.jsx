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
        className="flex items-center space-x-2 px-3 py-2 min-w-[120px] justify-between dropdown-mobile-enhanced dark:dropdown-mobile-enhanced-dark max-contrast-text dark:max-contrast-text-dark no-text-shadow no-backdrop-blur"
      >
        <div className="flex items-center space-x-2">
          <span className="max-contrast-text dark:max-contrast-text-dark no-text-shadow">
            {selectedModelData?.icon}
          </span>
          <span className="text-sm font-medium hidden sm:inline max-contrast-text dark:max-contrast-text-dark no-text-shadow">
            {selectedModelData?.label}
          </span>
          <span className="text-sm font-medium sm:hidden max-contrast-text dark:max-contrast-text-dark no-text-shadow">
            Model
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform max-contrast-text dark:max-contrast-text-dark no-text-shadow ${isOpen ? 'rotate-180' : ''}`} />
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
              className="absolute top-full right-0 mt-2 w-80 dropdown-contrast-fix dark:dropdown-contrast-fix-dark rounded-lg border shadow-lg z-50 no-backdrop-blur"
            >
              <div className="p-2">
                <div className="text-xs font-semibold uppercase tracking-wide px-3 py-2 dropdown-text-max-contrast dark:dropdown-text-max-contrast-dark no-text-shadow">
                  Available Models
                </div>
                {models.map((model) => (
                  <button
                    key={model.value}
                    onClick={() => handleModelSelect(model.value)}
                    className="w-full flex items-center justify-between p-3 rounded-md dropdown-mobile-option dark:dropdown-mobile-option-dark hover:dropdown-item-hover dark:hover:dropdown-item-hover-dark transition-colors text-left touch-manipulation min-h-[48px] no-text-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="dropdown-text-max-contrast dark:dropdown-text-max-contrast-dark no-text-shadow">
                        {model.icon}
                      </div>
                      <div>
                        <div className="font-medium dropdown-text-max-contrast dark:dropdown-text-max-contrast-dark no-text-shadow">
                          {model.label}
                        </div>
                        <div className="text-sm dropdown-text-max-contrast dark:dropdown-text-max-contrast-dark no-text-shadow opacity-80">
                          {model.description}
                        </div>
                      </div>
                    </div>
                    {selectedModel === model.value && (
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 no-text-shadow" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-600 p-3">
                <div className="text-xs dropdown-text-max-contrast dark:dropdown-text-max-contrast-dark no-text-shadow opacity-80">
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