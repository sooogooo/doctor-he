import React, { useEffect, useRef, useState, useMemo } from 'react';

const aestheticTexts = [
    "美，是和谐，是比例，是完整。 ——托马斯·阿奎那",
    "艺术的目的是净化我们的心灵。 ——亚里士多德",
    "万物皆有裂痕，那是光照进来的地方。 ——莱昂纳德·科恩",
    "对称是美的根源，但不对称才是生活的本质。",
    "我们审美的不是对象，而是我们投射在对象上的生命感。"
];
const internetMemes = [
    "命运的齿轮开始转动...",
    "主打一个陪伴。",
    "泰酷辣！",
    "听懂掌声。",
    "你还怪好嘞。"
];
const talkShowTexts = [
    "每个人都是自己人生的导演，我的这个剧本，有点费演员。",
    "世界以痛吻我，我扇他巴掌。",
    "有些事情，你把它想得太透彻，就跟把花看死了一样。",
    "人生的真谛，是找到一个你愿意跟他一起浪费人生的人。"
];
const lifeAestheticsTexts = [
    "生活不止眼前的苟且，还有诗和远方的田野。",
    "重要的不是治愈，而是带着伤痛活下去。",
    "你所经历的，都会在未来的某个节点，串联成线。",
    "真正的平静，不是避开车马喧嚣，而是在心中修篱种菊。"
];
const drHeWhispers = [
    "发现你的独特之美，每一种形态都值得被欣赏。",
    "美不是标准化的公式，而是你与生俱来的气质与神采。",
    "科技之光，映照你的自然之美。",
    "真正的美，源于对自己的认知与接纳。",
    "每一次微小的改变，都是与更美好的自己相遇。"
];

class Particle {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocity: { x: number; y: number; };
    lifespan: number;
    initialLifespan: number;
    generation: number;

    constructor(x: number, y: number, radius: number, color: string, velocity: {x: number, y: number}, lifespan: number, generation: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.lifespan = lifespan;
        this.initialLifespan = lifespan;
        this.generation = generation;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.globalAlpha = this.lifespan / this.initialLifespan;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    update(ctx: CanvasRenderingContext2D) {
        this.draw(ctx);
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.lifespan -= 1;
    }
}


export const SplashScreen: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const allTexts = useMemo(() => [
        ...aestheticTexts, ...internetMemes, ...talkShowTexts, ...lifeAestheticsTexts, ...drHeWhispers
    ], []);

    const [currentText, setCurrentText] = useState(() => allTexts[Math.floor(Math.random() * allTexts.length)]);
    const [textKey, setTextKey] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText(allTexts[Math.floor(Math.random() * allTexts.length)]);
            setTextKey(prev => prev + 1);
        }, 4000);
        return () => clearInterval(interval);
    }, [allTexts]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const withConstellations = Math.random() > 0.5;
        const colorBaseHue = 280 + Math.random() * 60; // Shifted to purple/pink hues

        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
        };
        
        setCanvasDimensions();

        const spawnParticle = (x: number, y: number, generation = 1) => {
            const radius = Math.max(0.5, 3 - generation) * window.devicePixelRatio;
            const color = `hsl(${colorBaseHue + Math.random() * 40 - 20}, 70%, 70%)`;
            const velocity = {
                x: (Math.random() - 0.5) * 1.5,
                y: (Math.random() - 0.5) * 1.5,
            };
            const lifespan = 100 + Math.random() * 80;
            particles.push(new Particle(x, y, radius, color, velocity, lifespan, generation));
        };
        
        for (let i = 0; i < 60; i++) {
            spawnParticle(Math.random() * canvas.width, Math.random() * canvas.height);
        }

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(18, 18, 20, 0.1)'; // Slightly softer than pure black
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                if (particle.lifespan <= 0) {
                    if (particle.generation < 3 && Math.random() > 0.5) {
                         for (let i = 0; i < 2; i++) {
                            spawnParticle(particle.x, particle.y, particle.generation + 1);
                        }
                    }
                    particles.splice(index, 1);
                } else {
                    particle.update(ctx);
                }
            });
            
            if (withConstellations) {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        const maxDistance = 100 * window.devicePixelRatio;

                        if (distance < maxDistance) {
                            ctx.save();
                            ctx.beginPath();
                            ctx.strokeStyle = `hsla(${colorBaseHue}, 70%, 70%, ${1 - distance / maxDistance})`;
                            ctx.lineWidth = 0.5 * window.devicePixelRatio;
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                            ctx.restore();
                        }
                    }
                }
            }

            if (Math.random() < 0.05 && particles.length < 200) {
                spawnParticle(Math.random() * canvas.width, Math.random() * canvas.height);
            }
        };

        animate();

        window.addEventListener('resize', setCanvasDimensions);

        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 text-center p-4 flex flex-col items-center">
                 <div className="mb-8 inline-block p-1 rounded-full bg-gradient-to-tr from-purple-400 via-pink-500 to-rose-400 shadow-xl shadow-pink-500/20">
                    <img 
                        src="https://docs.bccsw.cn/images/dr-he/dr-he.jpg" 
                        alt="贺秋月医生" 
                        className="w-32 h-32 rounded-full object-cover"
                    />
                </div>
                <style>{`
                    @keyframes fadeInOut {
                      0%, 100% { opacity: 0; transform: translateY(10px); }
                      20%, 80% { opacity: 1; transform: translateY(0); }
                    }
                    .fade-text {
                      animation: fadeInOut 4s ease-in-out forwards;
                    }
                `}</style>
                <div style={{ animationDelay: `${textKey * 4}s` }}>
                    <p className="text-white text-lg md:text-xl mb-8 font-light tracking-wider leading-relaxed max-w-2xl mx-auto fade-text">
                        {currentText}
                    </p>
                </div>
                <p className="text-gray-400 text-sm animate-pulse">
                    资源加载中，请稍候 ...
                </p>
            </div>
        </div>
    );
};