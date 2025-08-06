import React, { useState, useCallback, useRef } from 'react';
import type { AnalysisReport, AnalysisCategory, ContourAnalysis, ContourRegionAnalysis, AnnotatedFinding } from '../types';
import { getExplanationForTerm } from '../services/geminiService';
import { Modal } from './Modal';
import html2canvas from 'html2canvas';
import { 
    SkinIcon, VitalityIcon, FormIcon, SparklesIcon, HeartIcon, BeakerIcon, 
    CheckCircleIcon, DownloadIcon, LoadingSpinner, UpperFaceIcon, MidFaceIcon, 
    LowerFaceIcon, JawlineIcon, NeckIcon, EyeIcon, NoseIcon, LipsIcon
} from './icons';

interface AnalysisResultProps {
  result: AnalysisReport;
  showCategories?: (keyof AnalysisReport)[];
}

const Keyword: React.FC<{ term: string; onClick: (term: string) => void }> = ({ term, onClick }) => (
    <strong 
        className="font-medium text-accent cursor-pointer hover:underline transition-all"
        onClick={(e) => { e.stopPropagation(); onClick(term); }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(term);}}
    >
        {term}
    </strong>
);

const renderWithKeywords = (text: string, onKeywordClick: (term: string) => void) => {
    const keywords = ['斑', '敏', '痘', '疤', '疣', '干', '黄', '粗', '松', '皱', '凹', '凸', '扁', '垂', '臃'];
    const regex = new RegExp(`(${keywords.join('|')})`, 'g');
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, index) => 
                keywords.includes(part) ? (
                    <Keyword key={index} term={part} onClick={onKeywordClick} />
                ) : (
                    <React.Fragment key={index}>{part}</React.Fragment>
                )
            )}
        </>
    );
};

const InfoBlock: React.FC<{ title: string; icon: React.ReactNode; items: AnnotatedFinding[]; className?: string; onKeywordClick: (term: string) => void }> = ({ title, icon, items, className = '', onKeywordClick }) => (
    <div className={`p-4 rounded-xl ${className}`}>
        <h4 className="font-medium text-base flex items-center mb-3">{icon}{title}</h4>
        <ul className="list-disc list-inside space-y-2 text-sm pl-2 leading-relaxed">
            {items.map((item, index) => <li key={index}>{renderWithKeywords(item.description, onKeywordClick)}</li>)}
        </ul>
    </div>
);

const CategoryCard: React.FC<{ title: string; data: AnalysisCategory; icon: React.ReactNode; onKeywordClick: (term: string) => void; }> = ({ title, data, icon, onKeywordClick }) => (
  <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-soft transition-all hover:shadow-md hover:-translate-y-1">
    <div className="flex items-center mb-6">
      {icon}
      <h3 className="text-2xl font-medium ml-3 text-text-primary">{title}</h3>
    </div>
    
    <div className="space-y-4 text-text-primary">
        <InfoBlock 
            title="分析发现"
            icon={<BeakerIcon className="w-5 h-5 mr-2 text-blue-500"/>}
            items={data.findings}
            className="bg-blue-500/10"
            onKeywordClick={onKeywordClick}
        />
        <InfoBlock 
            title="美学建议"
            icon={<SparklesIcon className="w-5 h-5 mr-2 text-purple-500"/>}
            items={data.aesthetic_suggestions.map(s => ({description: s}))}
            className="bg-purple-500/10"
            onKeywordClick={onKeywordClick}
        />
        <InfoBlock 
            title="健康观察"
            icon={<HeartIcon className="w-5 h-5 mr-2 text-red-500"/>}
            items={data.medical_insights.map(s => ({description: s}))}
            className="bg-red-500/10"
            onKeywordClick={onKeywordClick}
        />
        <InfoBlock 
            title="行动建议"
            icon={<CheckCircleIcon className="w-5 h-5 mr-2 text-green-500"/>}
            items={data.recommendations.map(s => ({description: s}))}
            className="bg-green-500/10"
            onKeywordClick={onKeywordClick}
        />
    </div>
  </div>
);

const regionMap: { [key: string]: { label: string; icon: React.FC<{className?: string}> } } = {
    上面部: { label: "上面部", icon: UpperFaceIcon },
    中面部: { label: "中面部", icon: MidFaceIcon },
    下面部: { label: "下面部", icon: LowerFaceIcon },
    下颌线: { label: "下颌线", icon: JawlineIcon },
    颈部: { label: "颈部", icon: NeckIcon },
    眼部: { label: "眼部", icon: EyeIcon },
    鼻部: { label: "鼻部", icon: NoseIcon },
    口唇部: { label: "口唇部", icon: LipsIcon },
};

const RegionAnalysisCard: React.FC<{ regionKey: string; data: ContourRegionAnalysis }> = ({ regionKey, data }) => {
    const regionInfo = regionMap[regionKey];
    if (!regionInfo) return null;
    const { label, icon: Icon } = regionInfo;

    return (
        <div className="bg-background p-4 rounded-xl border border-border flex flex-col gap-3">
            <h4 className="font-medium text-base flex items-center text-text-primary">
                <Icon className="w-5 h-5 mr-2 text-primary"/>
                {label}
            </h4>
            <div className="text-sm space-y-2 text-text-secondary">
                <p><strong className="font-normal text-text-primary">【物象】</strong>{data.物象}</p>
                <p><strong className="font-normal text-text-primary">【意象】</strong>{data.意象}</p>
                <p><strong className="font-normal text-text-primary">【意境】</strong>{data.意境}</p>
            </div>
        </div>
    );
};

const ContourAnalysisDisplay: React.FC<{ data: ContourAnalysis }> = ({ data }) => (
    <div className="bg-surface p-4 sm:p-6 rounded-2xl shadow-soft transition-all hover:shadow-md hover:-translate-y-1">
        <div className="flex items-center mb-6">
            <FormIcon className="w-8 h-8 text-primary"/>
            <h3 className="text-2xl font-medium ml-3 text-text-primary">形色</h3>
        </div>
        
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-medium mb-4 text-text-primary">轮廓细节分析</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(data.regions).map(([key, regionData]) => (
                        <RegionAnalysisCard key={key} regionKey={key} data={regionData} />
                    ))}
                </div>
            </div>
            
            <div className="p-4 rounded-xl bg-primary/10">
                <h4 className="font-medium text-base flex items-center mb-3 text-text-primary">
                    <SparklesIcon className="w-5 h-5 mr-2 text-primary"/>
                    格式塔美学总结
                </h4>
                <p className="text-sm leading-relaxed text-text-secondary">{data.gestalt_summary}</p>
            </div>
        </div>
    </div>
);


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, showCategories }) => {
  const [modalState, setModalState] = useState({ isOpen: false, isLoading: true, title: '', content: '' });
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const handleKeywordClick = useCallback(async (term: string) => {
    setModalState({ isOpen: true, isLoading: true, title: `关于“${term}”的解析`, content: '' });
    try {
        const explanation = await getExplanationForTerm(term);
        setModalState({ isOpen: true, isLoading: false, title: `关于“${term}”的解析`, content: explanation });
    } catch (error) {
        const message = error instanceof Error ? error.message : "未知错误";
        setModalState({ isOpen: true, isLoading: false, title: '解析失败', content: message });
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleExport = useCallback(async () => {
      if (!reportRef.current || isExporting) return;
      
      const container = document.querySelector('.lg\\:grid-cols-2');
      const elementToCapture = container || reportRef.current;

      setIsExporting(true);
      try {
        const canvas = await html2canvas(elementToCapture as HTMLElement, {
            useCORS: true,
            backgroundColor: window.getComputedStyle(document.body).getPropertyValue('background-color'),
            scale: 2, 
        });
        const link = document.createElement('a');
        link.download = 'AuraAI-分析报告.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error("Failed to export report:", error);
        alert("导出报告失败。");
      } finally {
        setIsExporting(false);
      }
  }, [isExporting]);


  const categoryMeta = {
    '肤色': { title: "肤色", icon: <SkinIcon className="w-8 h-8 text-primary"/> },
    '气色': { title: "气色", icon: <VitalityIcon className="w-8 h-8 text-primary"/> },
    '形色': { title: "形色", icon: <FormIcon className="w-8 h-8 text-primary"/> }
  };
  
  const categoriesToShow = showCategories || Object.keys(categoryMeta) as (keyof AnalysisReport)[];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-center">
        <h2 className="text-2xl md:text-3xl font-medium">
          {showCategories && showCategories.length === 1 ? categoryMeta[showCategories[0]].title : '您的分析报告'}
        </h2>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors disabled:opacity-50 disabled:cursor-wait"
        >
          {isExporting ? <LoadingSpinner className="w-5 h-5"/> : <DownloadIcon className="w-5 h-5"/>}
          {isExporting ? '正在导出...' : '导出报告'}
        </button>
      </div>

      <div ref={reportRef} className="space-y-8">
        {categoriesToShow.map(key => {
          if (key === '形色') {
             return <ContourAnalysisDisplay key={key} data={result.形色} />;
          }
          if(key === '肤色' || key === '气色') {
            const { title, icon } = categoryMeta[key];
            const data = result[key];
            return <CategoryCard key={key} title={title} data={data} icon={icon} onKeywordClick={handleKeywordClick}/>;
          }
          return null;
        })}
        {categoriesToShow.length === 0 && (
            <div className="text-center py-10 text-text-secondary">
                <p>请先分析一张照片以查看结果。</p>
            </div>
        )}
      </div>

       <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.title}>
            {modalState.isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <LoadingSpinner className="w-8 h-8 text-primary" />
                </div>
            ) : (
                <p className="text-base leading-relaxed text-text-secondary">{modalState.content}</p>
            )}
        </Modal>
    </div>
  );
};