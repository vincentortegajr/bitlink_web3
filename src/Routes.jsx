import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import UnifiedNavigation from "components/ui/UnifiedNavigation";
// Add your imports here
import ProfileBuilderDashboard from "pages/profile-builder-dashboard";
import LeadGenerationHub from "pages/lead-generation-hub";
import LinkContentManagement from "pages/link-content-management";
import AnalyticsPerformanceDashboard from "pages/analytics-performance-dashboard";
import CryptoPaymentSetup from "pages/crypto-payment-setup";
import AITextToImageGenerator from "pages/ai-text-to-image-generator";
import AIImageToImageTransformer from "pages/ai-image-to-image-transformer";
import AIImageToVideoCreator from "pages/ai-image-to-video-creator";
import AITextToAudioGenerator from "pages/ai-text-to-audio-generator";
import AIVideoToLipsyncGenerator from "pages/ai-video-to-lipsync-generator";
import AIImageUpscaler from "pages/ai-image-upscaler";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        {/* UNIFIED NAVIGATION - Single source of truth */}
        <UnifiedNavigation />
        <div className="pt-16"> {/* Account for fixed header */}
          <RouterRoutes>
            {/* RESTORED HIERARCHY: Web3 LinkTree as PRIMARY platform with AI access */}
            <Route path="/" element={<ProfileBuilderDashboard />} />
            
            {/* Web3 LinkTree Core Features (Primary Platform) */}
            <Route path="/profile-builder-dashboard" element={<ProfileBuilderDashboard />} />
            <Route path="/link-content-management" element={<LinkContentManagement />} />
            <Route path="/crypto-payment-setup" element={<CryptoPaymentSetup />} />
            <Route path="/lead-generation-hub" element={<LeadGenerationHub />} />
            <Route path="/analytics-performance-dashboard" element={<AnalyticsPerformanceDashboard />} />
            
            {/* AI Studio Tools (Secondary Features) - Accessible from unified navigation */}
            <Route path="/ai-text-to-image-generator" element={<AITextToImageGenerator />} />
            <Route path="/ai-image-to-image-transformer" element={<AIImageToImageTransformer />} />
            <Route path="/ai-image-to-video-creator" element={<AIImageToVideoCreator />} />
            <Route path="/ai-video-to-lipsync-generator" element={<AIVideoToLipsyncGenerator />} />
            <Route path="/ai-text-to-audio-generator" element={<AITextToAudioGenerator />} />
            <Route path="/ai-image-upscaler" element={<AIImageUpscaler />} />
            <Route path="/ai-image-realism-model" element={<AIImageRealism />} />
            
            {/* 404 Handler */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

// Placeholder for new AI Image Realism tool
const AIImageRealism = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card rounded-2xl border p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            AI Image Realism Model
          </h1>
          <p className="text-text-secondary mb-6">
            Transform cartoon skin into realistic AI human skin - Coming Soon
          </p>
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-text-secondary">
              This advanced AI model specializes in converting cartoon or stylized faces into photorealistic human skin,
              perfect for creating indistinguishable AI influencer content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routes;