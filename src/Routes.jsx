import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import UnifiedNavigation from "components/ui/UnifiedNavigation";

// Import all pages
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
import AIImageRealismModel from "pages/ai-image-realism-model";
import AIChatAssistant from "pages/ai-chat-assistant";
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
            <Route path="/ai-image-realism-model" element={<AIImageRealismModel />} />
            <Route path="/ai-chat-assistant" element={<AIChatAssistant />} />
            
            {/* 404 Handler */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;