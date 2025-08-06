
import { GoogleGenAI, GenerateContentResponse, Chat, Type } from "@google/genai";
import type { AnalysisReport, ChatMessage, SettingsData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
  
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chat: Chat | null = null;
let currentChatSettings: SettingsData | null = null;

const analysisCategorySchema = {
    type: Type.OBJECT,
    properties: {
        findings: {
            type: Type.ARRAY,
            description: "Specific findings about the skin, e.g., spots, wrinkles. Includes coordinates if localized.",
            items: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING, description: "Description of the finding." },
                    coordinates: {
                        type: Type.OBJECT,
                        description: "Optional normalized coordinates (x, y) of the finding.",
                        properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER }
                        },
                        required: ['x', 'y']
                    }
                },
                required: ['description']
            }
        },
        aesthetic_suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        medical_insights: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ['findings', 'aesthetic_suggestions', 'medical_insights', 'recommendations']
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        error: { type: Type.STRING, description: "Error message if analysis cannot be performed." },
        '肤色': { ...analysisCategorySchema, description: "Analysis of skin tone and color." },
        '气色': { ...analysisCategorySchema, description: "Analysis of complexion and vitality." },
        '形色': {
            type: Type.OBJECT,
            description: "Deep aesthetic analysis of facial structure.",
            properties: {
                regions: {
                    type: Type.OBJECT,
                    description: "Analysis of 8 key facial regions.",
                    properties: {
                        上面部: { type: Type.OBJECT, properties: { 物象: { type: Type.STRING }, 意象: { type: Type.STRING }, 意境: { type: Type.STRING } }, required: ['物象', '意象', '意境'] },
                        中面部: { type: Type.OBJECT, properties: { 物象: { type: Type.STRING }, 意象: { type: Type.STRING }, 意境: { type: Type.STRING } }, required: ['物象', '意象', '意境'] },
                        下面部: { type: Type.OBJECT, properties: { 物象: { type: Type.STRING }, 意象: { type: Type.STRING }, 意境: { type: Type.STRING } }, required: ['物象', '意象', '意境'] },
                        下颌线: { type: Type.OBJECT, properties: { 物象: { type: Type.STRING }, 意象: { type: Type.STRING }, 意境: { type: Type.STRING } }, required: ['物象', '意象', '意境'] },
                        颈部: { type: Type.OBJECT, properties: { 物象: { type: Type.STRING }, 意象: { type: Type.STRING }, 意境: { type: Type.STRING } }, required: ['物象', '意象', '意境'] },
                        眼部: { type: Type.OBJECT, properties: { 物象: { type: Type.STRING }, 意象: { type: Type.STRING }, 意境: { type: Type.STRING } }, required: ['物象', '意象', '意境'] },
                        鼻部: { type: Type.OBJECT, properties: { 物象: { type: Type.STRING }, 意象: { type: Type.STRING }, 意境: { type: Type.STRING } }, required: ['物象', '意象', '意境'] },
                        口唇部: { type: Type.OBJECT, properties: { 物象: { type: Type.STRING }, 意象: { type: Type.STRING }, 意境: { type: Type.STRING } }, required: ['物象', '意象', '意境'] },
                    },
                    required: ['上面部', '中面部', '下面部', '下颌线', '颈部', '眼部', '鼻部', '口唇部']
                },
                gestalt_summary: { type: Type.STRING }
            },
            required: ['regions', 'gestalt_summary']
        }
    }
};


const getAnalysisPrompt = () => {
  return `You are a world-class AI expert in health, beauty technology, and classical aesthetics. Your task is to analyze a facial image based on three concepts: "肤色" (Skin Tone & Color), "气色" (Complexion & Vitality), and a highly detailed "形色" (Facial Form & Aesthetics).

  **Analysis Criteria:**
  1.  **"肤色" (Skin Tone & Color):** Analyze skin tone uniformity, pigmentation, redness, and undertones. Specifically look for signs of 斑 (spots), 敏 (sensitivity), 痘 (acne), 疤 (scars), and 疣 (warts). For each specific finding, if it is clearly visible and localized, provide its normalized coordinates (x, y) where (0,0) is top-left and (1,1) is bottom-right. Also provide aesthetic suggestions, potential medical insights (ALWAYS add '（此内容不做医疗诊断，请咨询专业医疗人士。）' to each point), and actionable recommendations.
  2.  **"气色" (Complexion & Vitality):** Look for indicators of overall health. Specifically look for signs of 干 (dryness), 黄 (yellowish tint), 粗 (rough texture), 松 (sagging), and 皱 (wrinkles). For each specific, localized finding, provide its normalized coordinates. Provide the same three categories of suggestions and insights as for "肤色".
  3.  **"形色" (Facial Form & Aesthetics):** This is the most critical part. Provide a deep, aesthetic analysis of the facial structure.
      *   Deconstruct the face into 8 key regions: 上面部 (Upper Face), 中面部 (Mid Face), 下面部 (Lower Face), 下颌线 (Jawline), 颈部 (Neck), 眼部 (Eyes), 鼻部 (Nose), 口唇部 (Lips).
      *   For **each of the 8 regions**, provide an analysis from three perspectives:
          *   **物象 (Wùxiàng):** An objective, descriptive observation of the form. (e.g., "The jawline is clearly defined with a soft curve.")
          *   **意象 (Yìxiàng):** A poetic or artistic image/analogy. (e.g., "The curve of the lips resembles a budding lotus flower.")
          *   **意境 (Yìjìng):** The overall feeling, mood, or artistic conception the form evokes. (e.g., "The eyes convey a sense of serene introspection.")
      *   **Provide a "gestalt_summary":** A concluding summary based on Gestalt principles (harmony, balance, symmetry, proportion) of the entire facial structure.

  **Instructions:**
  1.  **Image Quality Check:** First, assess the provided image. If the lighting is poor, the face is obscured, or it's not a photo of a face, please use the error field in your JSON response to state: 'Image quality is insufficient for analysis. Please use a clear, well-lit photo of a face.'.
  2.  **Generate Analysis:** If the image is suitable, provide a detailed analysis according to the schema. Your response must be a single, valid JSON object that conforms to the schema.
  3.  **Content Guidelines:**
      *   Be positive, helpful, and responsible.
      *   Ensure all medical insights are presented as possibilities, not diagnoses, and always include the disclaimer.
      *   Provide at least 2-3 points for each sub-category in "肤色" and "气色".
      *   For "形色", provide thoughtful, concise descriptions for each "象".
  4.  **Language:** ALL responses MUST be in Simplified Chinese.`;
};


export const analyzeImage = async (base64ImageData: string, mimeType: string): Promise<AnalysisReport> => {
    const imagePart = {
        inlineData: {
            mimeType: mimeType, 
            data: base64ImageData,
        },
    };

    const textPart = {
        text: getAnalysisPrompt(),
    };

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            }
        });

        const parsedJson = JSON.parse(response.text);

        if (parsedJson.error) {
            throw new Error(parsedJson.error);
        }

        // Only return analysis report fields if error is not present
        const { error, ...reportData } = parsedJson;
        return reportData as AnalysisReport;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("未能从 AI 模型获取有效的分析。");
    }
};

const startNewChat = (settings: SettingsData) => {
    const { aiPersonality, aiStyle, aiResponseStyle, userProfile } = settings;
    const { nickname, mbti, aestheticNeeds, beautyExpectations } = userProfile;

    const systemInstruction = `你是一位AI助手。
    你的MBTI性格是【${aiPersonality}】。请在回答中体现出这种性格的特点。
    你的沟通风格是【${aiStyle}】。
    你的回答详细程度被设定为【${aiResponseStyle}】。
    你的专业领域是皮肤病学、美容学和健康。请基于这个角色回答用户关于他们皮肤分析的问题，推荐产品，并提供一般性的健康提示。

    以下是关于你的对话者的信息，请在对话中运用这些信息，提供更个性化的服务：
    - 用户的昵称: ${nickname || '用户'} (如果昵称存在，请用它来称呼用户)
    - 用户的MBTI: ${mbti || '未提供'}
    - 用户的医美需求: ${aestheticNeeds || '未提供'}
    - 用户的美丽期望: ${beautyExpectations || '未提供'}

    始终保持鼓励和积极的态度，并提醒用户就医疗问题咨询专业人士。
    所有回答都必须使用简体中文。`;

    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
    currentChatSettings = settings;
};

export const resetChat = () => {
    chat = null;
    currentChatSettings = null;
};

export const sendMessageToChat = async (message: string, settings: SettingsData): Promise<string> => {
    // If chat doesn't exist OR settings have changed, create a new chat
    if (!chat || JSON.stringify(currentChatSettings) !== JSON.stringify(settings)) {
        startNewChat(settings);
    }
    try {
        const response: GenerateContentResponse = await chat!.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Chat API call failed:", error);
        throw new Error("未能从 AI 助手获取回应。");
    }
};

export const getExplanationForTerm = async (term: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `请用简体中文，为非专业人士简单解释一下在皮肤和面部美学背景下的术语：“${term}”。解释应包括它是什么，以及可能的常见原因。保持回答简洁，大约2-3句话。请强制使用简体中文。`,
        });
        return response.text;
    } catch (error) {
        console.error(`Failed to get explanation for ${term}:`, error);
        throw new Error("无法获取该术语的解释。");
    }
};

const suggestedQuestionsSchema = {
    type: Type.ARRAY,
    description: "A list of three suggested follow-up questions for the user.",
    items: { type: Type.STRING }
};

export const generateSuggestedQuestions = async (conversationHistory: ChatMessage[]): Promise<string[]> => {
    const historyText = conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n');
    const prompt = `根据以下的对话历史，为用户生成3个相关的、可操作的追问问题。用户正在与一位AI健康与美容顾问交谈。
    请确保问题是开放式的，能够引导更有深度的对话。
    你的回答必须是一个有效的JSON数组，只包含三个字符串。
    所有问题都必须是简体中文。
    
    对话历史:
    ${historyText}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
             config: {
                responseMimeType: "application/json",
                responseSchema: suggestedQuestionsSchema,
            }
        });

        const questions = JSON.parse(response.text);

        if (Array.isArray(questions) && questions.length > 0 && questions.every(q => typeof q === 'string')) {
            return questions;
        }
        throw new Error("AI返回的格式无效。");
    } catch (error) {
        console.error("Failed to generate suggested questions:", error);
        // Fallback to generic questions
        return [
            "我的皮肤类型是什么？",
            "我应该使用哪些护肤成分？",
            "如何改善我的整体气色？"
        ];
    }
};
