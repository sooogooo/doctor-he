
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage, AnalysisReport, SettingsData } from '../types';
import { sendMessageToChat, generateSuggestedQuestions } from '../services/geminiService';
import { SendIcon, ChatIcon, LoadingSpinner } from './icons';

interface AIChatProps {
    analysisReport: AnalysisReport | null;
    settings: SettingsData;
}

const commonQuestions = {
    "皮肤问题": [
        "如何改善痘痘和痘印？",
        "我的毛孔粗大怎么办？",
        "如何有效去除黑头和白头？",
        "脸上的色斑和晒斑怎么淡化？",
        "皮肤很敏感，容易泛红，有什么建议吗？"
    ],
    "抗衰老": [
        "如何预防和减少眼部细纹和鱼尾纹？",
        "法令纹很明显，有什么非手术的改善方法吗？",
        "如何提升面部轮廓，改善皮肤松弛？",
        "颈纹怎么去除？",
    ],
    "日常护肤": [
        "我应该如何选择适合自己肤质的防晒霜？",
        "正确的护肤步骤是怎样的？",
        "哪些护肤成分对我的皮肤有益？",
        "医美项目后，日常护肤需要注意什么？"
    ]
};

export const AIChat: React.FC<AIChatProps> = ({ analysisReport, settings }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "您好！今天有什么可以帮您的吗？您可以随时询问关于您的皮肤分析或一般健康的问题。" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [showQuestionSelector, setShowQuestionSelector] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const fetchSuggestedQuestions = useCallback(async (currentMessages: ChatMessage[]) => {
        setIsLoadingSuggestions(true);
        try {
            const questions = await generateSuggestedQuestions(currentMessages);
            setSuggestedQuestions(questions);
        } catch (e) {
            console.error("Failed to fetch suggested questions", e);
            setSuggestedQuestions([]); // Clear on error
        } finally {
            setIsLoadingSuggestions(false);
        }
    }, []);

    useEffect(() => {
        if (messages.length > 1) return;
        const initialMessages: ChatMessage[] = analysisReport 
            ? [{ role: 'system', content: `用户刚刚完成了一次面部分析，以下是报告摘要：${JSON.stringify(analysisReport)}` }, ...messages]
            : messages;
        fetchSuggestedQuestions(initialMessages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSendMessage = useCallback(async (messageContent: string) => {
        if (!messageContent.trim() || isLoading) return;
        
        setShowQuestionSelector(false); // Hide selector on any message send

        const userMessage: ChatMessage = { role: 'user', content: messageContent };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setSuggestedQuestions([]);

        try {
            const response = await sendMessageToChat(userMessage.content, settings);
            const modelMessage: ChatMessage = { role: 'model', content: response };
            const finalMessages = [...newMessages, modelMessage];
            setMessages(finalMessages);
            fetchSuggestedQuestions(finalMessages);
        } catch (error) {
            const errorMessage: ChatMessage = { role: 'model', content: "抱歉，我遇到了一个错误。请重试。" };
            const errorMessages = [...newMessages, errorMessage]
            setMessages(errorMessages);
            fetchSuggestedQuestions(errorMessages);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, messages, fetchSuggestedQuestions, settings]);
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    };

    const handleSuggestedQuestionClick = (question: string) => {
        handleSendMessage(question);
    };

    const handleQuestionSelect = (question: string) => {
        setSelectedQuestions(prev => {
            if (prev.includes(question)) {
                return prev.filter(q => q !== question);
            } else {
                if (prev.length >= 5) {
                    // Optional: show a message that limit is reached
                    return prev;
                }
                return [...prev, question];
            }
        });
    };

    const handleAskSelected = () => {
        if (selectedQuestions.length === 0) return;
        const combinedQuestion = "请根据我的情况，回答以下几个问题：\n- " + selectedQuestions.join('\n- ');
        handleSendMessage(combinedQuestion);
    };

    const UserAvatar = () => {
        const { avatar, nickname } = settings.userProfile;
        if (avatar) {
            return <img src={avatar} alt={nickname} className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />;
        }
        return (
            <div className="w-8 h-8 rounded-full flex-shrink-0 bg-secondary flex items-center justify-center text-white font-bold text-sm">
                {(nickname || 'U').charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-220px)] max-w-3xl mx-auto bg-surface rounded-2xl shadow-soft">
             <h2 className="text-xl font-medium p-4 border-b border-border text-center flex items-center justify-center">
                <ChatIcon className="w-6 h-6 mr-2 text-primary"/>
                AI 助手
            </h2>

            {showQuestionSelector && messages.length <= 1 && (
                <div className="p-4 border-b border-border bg-background/50">
                    <h3 className="text-sm font-medium text-text-primary mb-3">或者，选择您关心的问题开始（最多5个）:</h3>
                    <div className="space-y-3">
                        {Object.entries(commonQuestions).map(([group, questions]) => (
                            <div key={group}>
                                <p className="text-xs font-semibold text-text-secondary mb-2">{group}</p>
                                <div className="flex flex-wrap gap-2">
                                    {questions.map(q => {
                                        const isSelected = selectedQuestions.includes(q);
                                        return (
                                            <button 
                                                key={q}
                                                onClick={() => handleQuestionSelect(q)}
                                                className={`px-3 py-1.5 text-xs rounded-lg transition-colors text-left ${
                                                    isSelected 
                                                        ? 'bg-accent text-white shadow-md' 
                                                        : 'bg-background hover:bg-black/5 dark:hover:bg-white/10 border border-border'
                                                }`}
                                            >
                                                {q}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedQuestions.length > 0 && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={handleAskSelected}
                                disabled={isLoading}
                                className="px-6 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                向 AI 提问 ({selectedQuestions.length}/5)
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => (
                    msg.role !== 'system' &&
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <img src="https://docs.bccsw.cn/logo.png" alt="AI Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />}
                        <div className={`markdown-content max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user'
                            ? 'bg-accent text-white rounded-br-lg'
                            : 'bg-black/5 dark:bg-white/10 text-text-primary rounded-bl-lg'
                            }`}>
                             <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                         {msg.role === 'user' && <UserAvatar />}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="flex items-start gap-3">
                             <img src="https://docs.bccsw.cn/logo.png" alt="AI Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                            <div className="px-4 py-2 rounded-2xl bg-background shadow-sm flex items-center justify-center">
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.15s] mx-1.5"></div>
                                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border">
                {isLoadingSuggestions ? (
                    <div className="flex justify-center items-center h-10 mb-2">
                        <LoadingSpinner className="w-6 h-6 text-text-secondary"/>
                    </div>
                ) : (
                    suggestedQuestions.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-3">
                            {suggestedQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestedQuestionClick(q)}
                                    className="px-3 py-1.5 text-xs font-medium bg-secondary/20 text-secondary rounded-full hover:bg-secondary/30 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )
                )}

                <form onSubmit={handleFormSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="提个问题..."
                        disabled={isLoading}
                        className="flex-1 w-full px-4 py-2.5 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="flex-shrink-0 w-10 h-10 bg-accent text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-transform active:scale-90 hover:opacity-90">
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};