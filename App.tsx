
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TabBar } from './components/TabBar';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { AnnotatedImage } from './components/AnnotatedImage';
import { Disclaimer } from './components/Disclaimer';
import { ContactSection } from './components/ContactSection';
import { AIChat } from './components/AIChat';
import { Settings } from './components/Settings';
import { SplashScreen } from './components/SplashScreen';
import { HeroImage } from './components/HeroImage';
import { Modal } from './components/Modal';
import { WelcomeModal } from './components/WelcomeModal';
import { UsageGuide } from './components/UsageGuide';
import { analyzeImage, resetChat as resetAIChat } from './services/geminiService';
import type { AnalysisReport, View, MainTab, SettingsData } from './types';
import { LoadingSpinner } from './components/icons';

const FIRST_VISIT_KEY = 'hasVisitedAuraAI';

export default function App(): React.ReactNode {
  const [isAppReady, setIsAppReady] = useState(false);
  const [settings, setSettings] = useState<SettingsData>(() => {
    try {
        const savedSettings = localStorage.getItem('appSettings');
        const initialSettings: SettingsData = {
          theme: 'light',
          fontSize: 'small',
          aiResponseStyle: '标准',
          aiPersonality: 'ISFJ',
          aiStyle: '专业严谨',
          userProfile: {
            nickname: '美丽探索者',
            avatar: 'https://docs.bccsw.cn/favicon.png',
            bloodType: 'Unknown',
            mbti: 'ISFJ',
            aestheticNeeds: '',
            beautyExpectations: '',
          },
        };
        return savedSettings ? JSON.parse(savedSettings) : initialSettings;
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        return {
          theme: 'light',
          fontSize: 'small',
          aiResponseStyle: '标准',
          aiPersonality: 'ISFJ',
          aiStyle: '专业严谨',
          userProfile: {
            nickname: '美丽探索者',
            avatar: 'https://docs.bccsw.cn/favicon.png',
            bloodType: 'Unknown',
            mbti: 'ISFJ',
            aestheticNeeds: '',
            beautyExpectations: '',
          },
        };
    }
  });
  const [image, setImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentView, setCurrentView] = useState<View>('main');
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [dataResetKey, setDataResetKey] = useState(0);
  const [pageKey, setPageKey] = useState<string>('home');
  const [isDrHeModalOpen, setIsDrHeModalOpen] = useState(false);

  const [showWelcome, setShowWelcome] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
      if (!hasVisited) {
        setShowWelcome(true);
      }
      setIsAppReady(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    const root = window.document.documentElement;
    root.classList.remove('dark', 'theme-roseGold', 'theme-lilac', 'theme-mint');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme !== 'light') {
      root.classList.add(`theme-${settings.theme}`);
    }
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${settings.fontSize}`);
  }, [settings]);

  useEffect(() => {
    const newKey = `${currentView}-${activeTab}`;
    setPageKey(newKey);
  }, [currentView, activeTab]);
  
  const resetState = useCallback(() => {
    setImage(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
    setCurrentView('main');
    setActiveTab('home');
    resetAIChat();
    setDataResetKey(prev => prev + 1);
    localStorage.removeItem(FIRST_VISIT_KEY);
  }, []);

  const handleImageReady = useCallback(async (imageDataUrl: string, fileType: string) => {
    setImage(imageDataUrl);
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setCurrentView('main');
    setActiveTab('home');

    try {
      const base64Data = imageDataUrl.split(',')[1];
      const result = await analyzeImage(base64Data, fileType);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : '分析过程中发生未知错误。';
      setError(`分析失败: ${errorMessage} 请使用清晰、光线充足的照片重试。`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleWelcomeAccept = () => {
    setShowWelcome(false);
    localStorage.setItem(FIRST_VISIT_KEY, 'true');
    setShowGuide(true); 
  };
  
  const renderMainContent = () => {
     if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner className="w-16 h-16 text-primary"/>
          <p className="mt-4 text-lg animate-pulse">正在分析您的图像... 这可能需要一些时间。</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center my-10 bg-warning/10 border border-warning/50 text-warning px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">错误!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <button
              onClick={resetState}
              className="mt-4 px-4 py-2 bg-warning text-white rounded-lg hover:opacity-90 transition-colors"
          >
              重试
          </button>
        </div>
      );
    }

    if (analysisResult) {
       const showCategories = activeTab === 'home' ? undefined : [activeTab];
       if (activeTab === 'home') {
          return (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="flex flex-col items-center sticky top-24 bg-background z-10">
                 <h2 className="text-2xl font-semibold mb-4 text-center">您的照片</h2>
                 <AnnotatedImage image={image!} result={analysisResult} />
                 <button
                   onClick={resetState}
                   className="my-6 px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity w-full"
                 >
                   分析另一张照片
                 </button>
               </div>
               <AnalysisResult result={analysisResult} showCategories={showCategories} />
             </div>
          );
       }
       return <AnalysisResult result={analysisResult} showCategories={showCategories} />;
    }

    return (
      <>
        <div className="text-center">
           <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">AI 皮肤与面部分析</h1>
           <p className="text-lg text-text-secondary mb-8">通过一张照片获得个性化的美学和健康见解。</p>
        </div>
        <ImageUploader data-tour-id="step-1-uploader" onImageReady={handleImageReady} onError={setError} />
      </>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return <AIChat key={dataResetKey} analysisReport={analysisResult} settings={settings} />;
      case 'settings':
        return <Settings settings={settings} onSettingsChange={setSettings} onClearData={resetState} onShowGuide={() => setShowGuide(true)} />;
      case 'main':
      default:
        const mainContent = renderMainContent();
        return (
          <>
            <HeroImage pageKey={pageKey} />
            <div className="mt-8">
              {mainContent}
            </div>
            <Disclaimer />
            <ContactSection />
          </>
        );
    }
  };

  if (!isAppReady) {
    return <SplashScreen />;
  }
  
  const hasAnalysis = !!analysisResult;

  return (
    <div className="min-h-screen bg-background text-text-primary transition-colors duration-300 flex flex-col">
      <Header 
        currentView={currentView}
        onNavigate={setCurrentView}
        onDrHeClick={() => setIsDrHeModalOpen(true)}
      />
      <main className={`container mx-auto p-4 sm:p-6 md:p-8 flex-grow ${currentView !== 'settings' ? 'pb-40' : 'pb-8'}`}>
        {renderContent()}
        <Footer />
      </main>
      {currentView !== 'settings' && (
        <TabBar 
          activeMainTab={activeTab} 
          currentView={currentView}
          hasAnalysis={hasAnalysis}
          onMainTabChange={setActiveTab}
          onNavigate={setCurrentView} 
        />
      )}
       <Modal
          isOpen={isDrHeModalOpen}
          onClose={() => setIsDrHeModalOpen(false)}
          title="关于贺秋月医生"
          variant="drHe"
       >
          <div className="relative flex flex-col items-center text-center p-6 pt-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
              <div className="p-1 rounded-full bg-gradient-to-tr from-accent to-secondary shadow-lg shadow-primary/30">
                  <div className="p-1 bg-surface rounded-full">
                      <img 
                          src="https://docs.bccsw.cn/images/dr-he/dr-he.jpg" 
                          alt="贺秋月医生" 
                          className="w-32 h-32 rounded-full object-cover"
                      />
                  </div>
              </div>
              <h4 className="text-xl font-medium text-text-primary mt-5">贺秋月 医生</h4>
              <p className="font-medium text-accent mt-1">美容皮肤科执业医师</p>
              <p className="text-sm text-text-secondary mt-4 max-w-md mx-auto leading-relaxed text-left">
                  贺医生是重庆联合丽格美容医院的执业医师，拥有丰富的临床经验，专注于皮肤健康与医学美容领域。她致力于通过科学的方法和个性化的方案，帮助每一位求美者发现和塑造自己独特的美丽，以专业和热情守护您的肌肤健康与光彩。
              </p>
          </div>
      </Modal>

      <WelcomeModal
        isOpen={showWelcome}
        onAccept={handleWelcomeAccept}
      />

      <UsageGuide
        show={showGuide}
        onFinish={() => setShowGuide(false)}
      />

    </div>
  );
}
