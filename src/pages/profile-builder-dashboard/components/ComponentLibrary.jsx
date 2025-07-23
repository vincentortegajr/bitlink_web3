import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ComponentLibrary = ({ onDragStart, isVisible, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('social');

  const componentCategories = {
    social: {
      label: 'Social Links',
      icon: 'Share2',
      components: [
        {
          id: 'twitter-link',
          name: 'Twitter Link',
          icon: 'Twitter',
          description: 'Add your Twitter profile link',
          preview: 'twitter.com/username'
        },
        {
          id: 'instagram-link',
          name: 'Instagram Link',
          icon: 'Instagram',
          description: 'Add your Instagram profile link',
          preview: 'instagram.com/username'
        },
        {
          id: 'linkedin-link',
          name: 'LinkedIn Link',
          icon: 'Linkedin',
          description: 'Add your LinkedIn profile link',
          preview: 'linkedin.com/in/username'
        },
        {
          id: 'youtube-link',
          name: 'YouTube Link',
          icon: 'Youtube',
          description: 'Add your YouTube channel link',
          preview: 'youtube.com/@username'
        },
        {
          id: 'discord-link',
          name: 'Discord Link',
          icon: 'MessageCircle',
          description: 'Add your Discord server link',
          preview: 'discord.gg/server'
        }
      ]
    },
    payments: {
      label: 'Crypto Payments',
      icon: 'CreditCard',
      components: [
        {
          id: 'payment-button',
          name: 'Payment Button',
          icon: 'CreditCard',
          description: 'Accept crypto payments',
          preview: 'Pay with Crypto'
        },
        {
          id: 'donation-button',
          name: 'Donation Button',
          icon: 'Heart',
          description: 'Accept crypto donations',
          preview: 'Support Me'
        },
        {
          id: 'subscription-button',
          name: 'Subscription',
          icon: 'Repeat',
          description: 'Monthly crypto subscriptions',
          preview: 'Subscribe Monthly'
        },
        {
          id: 'tip-jar',
          name: 'Tip Jar',
          icon: 'Coffee',
          description: 'Accept crypto tips',
          preview: 'Buy me a coffee'
        }
      ]
    },
    content: {
      label: 'Content & Media',
      icon: 'FileText',
      components: [
        {
          id: 'ebook-download',
          name: 'Ebook Download',
          icon: 'BookOpen',
          description: 'Share downloadable ebooks',
          preview: 'Download Free Guide'
        },
        {
          id: 'video-embed',
          name: 'Video Embed',
          icon: 'Play',
          description: 'Embed YouTube videos',
          preview: 'Watch Video'
        },
        {
          id: 'image-gallery',
          name: 'Image Gallery',
          icon: 'Image',
          description: 'Showcase your work',
          preview: 'View Gallery'
        },
        {
          id: 'text-block',
          name: 'Text Block',
          icon: 'Type',
          description: 'Add custom text content',
          preview: 'Custom text here...'
        }
      ]
    },
    leads: {
      label: 'Lead Generation',
      icon: 'Users',
      components: [
        {
          id: 'email-signup',
          name: 'Email Signup',
          icon: 'Mail',
          description: 'Collect email addresses',
          preview: 'Join Newsletter'
        },
        {
          id: 'contact-form',
          name: 'Contact Form',
          icon: 'MessageSquare',
          description: 'Contact form with fields',
          preview: 'Get in Touch'
        },
        {
          id: 'lead-magnet',
          name: 'Lead Magnet',
          icon: 'Gift',
          description: 'Free resource for emails',
          preview: 'Get Free Resource'
        },
        {
          id: 'waitlist-signup',
          name: 'Waitlist Signup',
          icon: 'Clock',
          description: 'Collect waitlist signups',
          preview: 'Join Waitlist'
        }
      ]
    }
  };

  const handleDragStart = (e, component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    onDragStart(component);
  };

  return (
    <>
      {/* Enhanced Desktop Sidebar */}
      <div className="hidden lg:block w-72 bg-surface/95 backdrop-blur-glass border-r-2 border-border/60 h-full overflow-y-auto shadow-lg">
        <div className="p-3 border-b-2 border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
          <h2 className="text-xl font-bold text-text-primary flex items-center space-x-3 tracking-tight">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-md">
              <Icon name="Layers" size={20} className="text-white" />
            </div>
            <span>Components</span>
          </h2>
          <p className="text-sm text-text-secondary mt-1 ml-12">Drag to add to your profile</p>
        </div>

        {/* Enhanced Category Tabs */}
        <div className="p-3 border-b-2 border-border/40">
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(componentCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center space-x-2.5 p-2.5 rounded-xl text-sm font-bold transition-all duration-200 border-2 hover:shadow-md ${
                  activeCategory === key
                    ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary shadow-lg hover:shadow-xl hover:shadow-primary/25'
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted/60 border-transparent hover:border-border/40 hover:shadow-sm'
                }`}
              >
                <Icon name={category.icon} size={16} />
                <span className="truncate text-xs">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Component List */}
        <div className="p-3 space-y-2">
          {componentCategories[activeCategory].components.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
              className="p-3 border-2 border-border/50 rounded-xl cursor-grab hover:cursor-grabbing hover:border-primary/70 hover:shadow-xl hover:shadow-primary/15 transition-all duration-200 bg-gradient-to-r from-card to-card/80 shadow-sm hover:from-card/90 hover:to-card/70 group transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary/15 to-accent/10 text-primary rounded-xl shadow-md border border-primary/20 group-hover:shadow-lg group-hover:from-primary/20 group-hover:to-accent/15 transition-all duration-200">
                  <Icon name={component.icon} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-text-primary leading-tight tracking-tight">{component.name}</h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{component.description}</p>
                  <div className="mt-2 p-2 bg-gradient-to-r from-muted/80 to-muted/60 rounded-lg text-xs text-text-secondary font-mono border border-border/30 shadow-sm">
                    {component.preview}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Mobile Bottom Sheet */}
      {isVisible && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50 flex items-end backdrop-blur-sm">
          <div className="w-full bg-surface/95 backdrop-blur-glass rounded-t-2xl max-h-[85vh] flex flex-col animate-scale-in border-t-2 border-border/60 shadow-2xl">
            <div className="p-3 border-b-2 border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary flex items-center space-x-3 tracking-tight">
                  <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-md">
                    <Icon name="Layers" size={20} className="text-white" />
                  </div>
                  <span>Components</span>
                </h2>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-muted/60 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
              <p className="text-sm text-text-secondary mt-1 ml-12">Drag to add to your profile</p>
            </div>

            {/* Enhanced Mobile Category Tabs */}
            <div className="p-3 border-b-2 border-border/40">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {Object.entries(componentCategories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border-2 hover:shadow-md ${
                      activeCategory === key
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary shadow-lg hover:shadow-xl hover:shadow-primary/25'
                        : 'text-text-secondary hover:text-text-primary hover:bg-muted/60 border-transparent hover:border-border/40 hover:shadow-sm'
                    }`}
                  >
                    <Icon name={category.icon} size={16} />
                    <span className="text-xs">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Mobile Component List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {componentCategories[activeCategory].components.map((component) => (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  className="p-3 border-2 border-border/50 rounded-xl cursor-grab hover:cursor-grabbing hover:border-primary/70 hover:shadow-xl hover:shadow-primary/15 transition-all duration-200 bg-gradient-to-r from-card to-card/80 shadow-sm hover:from-card/90 hover:to-card/70 group transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gradient-to-br from-primary/15 to-accent/10 text-primary rounded-xl shadow-md border border-primary/20 group-hover:shadow-lg group-hover:from-primary/20 group-hover:to-accent/15 transition-all duration-200">
                      <Icon name={component.icon} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-text-primary leading-tight tracking-tight">{component.name}</h3>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">{component.description}</p>
                      <div className="mt-2 p-2 bg-gradient-to-r from-muted/80 to-muted/60 rounded-lg text-xs text-text-secondary font-mono border border-border/30 shadow-sm">
                        {component.preview}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComponentLibrary;