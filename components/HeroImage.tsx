import React, { useState, useEffect, useRef } from 'react';

const imageUrls = [
  'https://docs.bccsw.cn/images/chacha/faceonly.jpg',
  'https://docs.bccsw.cn/images/chacha/manke1.jpg',
  'https://docs.bccsw.cn/images/chacha/manke2.jpg',
  'https://docs.bccsw.cn/images/chacha/splendeur.jpg',
  'https://docs.bccsw.cn/images/chacha/superorder.jpg',
  'https://docs.bccsw.cn/images/chacha/xinfuyuan1.jpg',
  'https://docs.bccsw.cn/images/chacha/xinfuyuan2.jpg',
  'https://docs.bccsw.cn/images/chacha/xinfuyuan3.jpg',
  'https://docs.bccsw.cn/images/chacha/xinfuyuan4.jpg',
];

interface HeroImageProps {
  pageKey: string;
}

const HeroImageComponent: React.FC<HeroImageProps> = ({ pageKey }) => {
  const [currentImage, setCurrentImage] = useState(imageUrls[0]);
  const lastImageRef = useRef<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    let newImage;
    // Ensure the new image is different from the last one
    do {
      newImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    } while (imageUrls.length > 1 && newImage === lastImageRef.current);

    setCurrentImage(newImage);
    lastImageRef.current = newImage;
    setAnimationKey((prev) => prev + 1); // Reset animation on image change
  }, [pageKey]);

  return (
    <>
      <style>{`
        @keyframes kenburns {
          0% {
            transform: scale(1.1) translate(-2%, -2%);
          }
          100% {
            transform: scale(1) translate(0, 0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hero-image-animate {
          animation: kenburns 20s ease-out forwards, fadeIn 1.5s ease-in-out forwards;
        }
      `}</style>
      <div className="aspect-[2.35/1] w-full overflow-hidden rounded-2xl bg-background shadow-soft">
        <img
          key={animationKey}
          src={currentImage}
          alt="Hero Banner"
          className="w-full h-full object-cover hero-image-animate"
        />
      </div>
    </>
  );
};

export const HeroImage = React.memo(HeroImageComponent);
