
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { CameraIcon, UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageReady: (imageDataUrl: string, fileType: string) => void;
  onError: (message: string) => void;
  ['data-tour-id']?: string;
}

interface CameraViewProps {
    onCapture: (blob: Blob) => void;
    onClose: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user" },
                audio: false 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            onClose();
        }
    }, [onClose]);

    const handleCapture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if(context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                canvas.toBlob(blob => {
                    if (blob) {
                        onCapture(blob);
                    }
                    stopCamera();
                    onClose();
                }, 'image/jpeg');
            }
        }
    };
    
    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
            <div className="relative bg-surface p-4 rounded-lg shadow-xl">
                <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg rounded-md"></video>
                <div className="mt-4 flex justify-center space-x-4">
                    <button onClick={handleCapture} className="px-6 py-3 bg-accent text-white rounded-full font-bold hover:opacity-90 transition-colors">拍摄</button>
                    <button onClick={() => { stopCamera(); onClose(); }} className="px-6 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-500 transition-colors">取消</button>
                </div>
            </div>
        </div>
    );
};


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageReady, onError, ...props }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCamera, setShowCamera] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        onError("文件类型无效。请上传图片。");
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        onImageReady(reader.result as string, file.type);
    };
    reader.onerror = () => {
        onError("读取文件失败。");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleCameraCapture = (blob: Blob) => {
    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
    processFile(file);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto bg-surface p-6 md:p-8 rounded-2xl shadow-soft" data-tour-id={props['data-tour-id']}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowCamera(true)}
            className="flex flex-col items-center justify-center p-6 bg-primary/10 text-primary rounded-xl border-2 border-dashed border-primary/30 hover:bg-primary/20 transition-colors"
          >
            <CameraIcon className="w-12 h-12 mb-2" />
            <span className="font-medium text-lg">拍照</span>
            <span className="text-sm font-light text-text-secondary">使用您设备的摄像头</span>
          </button>
          <button
            onClick={handleUploadClick}
            className="flex flex-col items-center justify-center p-6 bg-secondary/10 text-secondary rounded-xl border-2 border-dashed border-secondary/30 hover:bg-secondary/20 transition-colors"
          >
            <UploadIcon className="w-12 h-12 mb-2" />
            <span className="font-medium text-lg">上传图片</span>
            <span className="text-sm font-light text-text-secondary">从您的相册中浏览</span>
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
      {showCamera && <CameraView onCapture={handleCameraCapture} onClose={() => setShowCamera(false)} />}
    </>
  );
};
