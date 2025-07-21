import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Volume2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ChatMessage = ({ message, selectedModel, speechSynthesis }) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const speakMessage = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 0.8;
      utterance.pitch = message.type === 'assistant' ? 0.9 : 1.1;
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}>

      <div className={`flex max-w-[85%] md:max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`
          }>
            {message.type === 'user' ?
            <User className="w-4 h-4" /> :

            <Bot className="w-4 h-4" />
            }
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
          {/* Message Bubble */}
          <div className={`relative px-4 py-3 rounded-2xl max-w-full ${
          message.type === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md'}`
          }>
            {/* Message Text */}
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
            </div>

            {/* Model Badge for Assistant Messages */}
            {message.type === 'assistant' &&
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {message.model === 'llama2' && '🦙 Llama 2'}
                  {message.model === 'mistral' && '⚡ Mistral'}
                  {message.model === 'codellama' && '💻 Code Llama'}
                  {message.model === 'custom' && '✨ Custom GPT'}
                </span>
              </div>
            }
          </div>

          {/* Message Actions */}
          <div className={`flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-1`
          }>
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
              {formatTime(message.timestamp)}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Copy message">

              <Copy className={`w-3 h-3 ${copied ? 'text-green-600' : 'text-gray-400'}`} />
            </Button>

            {message.type === 'assistant' &&
            <>
                <Button
                variant="ghost"
                size="sm"
                onClick={speakMessage}
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Read aloud">

                  <Volume2 className="w-3 h-3 text-gray-400" />
                </Button>
                
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(liked === 'up' ? null : 'up')}
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Good response">

                  <ThumbsUp className={`w-3 h-3 ${liked === 'up' ? 'text-green-600' : 'text-gray-400'}`} />
                </Button>
                
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(liked === 'down' ? null : 'down')}
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Poor response">

                  <ThumbsDown className={`w-3 h-3 ${liked === 'down' ? 'text-red-600' : 'text-gray-400'}`} />
                </Button>
                
                <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Regenerate response">

                  <RotateCcw className="w-3 h-3 text-gray-400" />
                </Button>
              </>
            }
          </div>
        </div>
      </div>
    </motion.div>);

};

export default ChatMessage;