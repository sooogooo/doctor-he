export interface AnnotatedFinding {
  description: string;
  coordinates?: { x: number; y: number };
}

export interface AnalysisCategory {
  findings: AnnotatedFinding[];
  aesthetic_suggestions: string[];
  medical_insights: string[];
  recommendations: string[];
}

export interface ContourRegionAnalysis {
  物象: string;
  意象: string;
  意境: string;
}

export interface ContourAnalysis {
  regions: {
    上面部: ContourRegionAnalysis;
    中面部: ContourRegionAnalysis;
    下面部: ContourRegionAnalysis;
    下颌线: ContourRegionAnalysis;
    颈部: ContourRegionAnalysis;
    眼部: ContourRegionAnalysis;
    鼻部: ContourRegionAnalysis;
    口唇部: ContourRegionAnalysis;
  };
  gestalt_summary: string;
}

export interface AnalysisReport {
  肤色: AnalysisCategory;
  气色: AnalysisCategory;
  形色: ContourAnalysis;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export type View = 'main' | 'chat' | 'settings';
export type MainTab = 'home' | '肤色' | '气色' | '形色';

// Settings Types
export const mbtiTypes = [
  'ISFJ',
  'ISTJ',
  'INFJ',
  'INTJ',
  'ISFP',
  'ISTP',
  'INFP',
  'INTP',
  'ESFP',
  'ESTP',
  'ENFP',
  'ENTP',
  'ESFJ',
  'ESTJ',
  'ENFJ',
  'ENTJ',
] as const;

export const bloodTypes = ['A', 'B', 'AB', 'O', 'Unknown'] as const;

export type Theme = 'light' | 'dark' | 'roseGold' | 'lilac' | 'mint';
export type FontSize = 'small' | 'medium' | 'large';
export type AIResponseStyle = '精炼' | '标准' | '话痨';
export type AIPersonality = (typeof mbtiTypes)[number];
export type AIStyle = '日常幽默' | '专业严谨' | '新脱口秀';
export type BloodType = (typeof bloodTypes)[number];

export interface UserProfile {
  nickname: string;
  avatar: string;
  bloodType: BloodType;
  mbti: AIPersonality;
  aestheticNeeds: string;
  beautyExpectations: string;
}

export interface SettingsData {
  theme: Theme;
  fontSize: FontSize;
  aiResponseStyle: AIResponseStyle;
  aiPersonality: AIPersonality;
  aiStyle: AIStyle;
  userProfile: UserProfile;
}

// Tour Types
export interface TourStep {
  selector: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
