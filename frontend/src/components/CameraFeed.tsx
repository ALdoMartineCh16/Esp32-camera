// frontend/src/components/CameraFeed.tsx
import React, { useEffect, useRef, useState } from "react";

export type CameraFeedProps = {
  url?: string;
  onCapture?: (src: string) => void;
};

const DEFAULT_URL = "http://192.168.18.26/cam-lo.jpg";

const CameraFeed: React.FC<CameraFeedProps> = ({
  url = DEFAULT_URL,
  onCapture,
}) => {
  const [imgSrc, setImgSrc] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(0);
  const lastFrameTime = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Actualiza la imagen y calcula FPS
  const updateImage = () => {
    const now = Date.now();
    const elapsed = now - lastFrameTime.current;
    lastFrameTime.current = now;
    setFps(Math.round(1000 / elapsed));
    setImgSrc(`${url}?t=${now}`);
  };

  // Inicia el loop de polling
  const startStream = () => {
    if (intervalRef.current) return;
    updateImage();
    intervalRef.current = window.setInterval(updateImage, 200);
  };

  // Detiene el loop
  const stopStream = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleImageError = () => setIsConnected(false);
  const handleImageLoad = () => setIsConnected(true);

  // Captura: dispara callback y descarga
  const captureImage = () => {
    if (!imgRef.current) return;
    // Notificar al padre
    if (onCapture) onCapture(imgSrc);

    // Descargar JPEG
    const canvas = document.createElement("canvas");
    canvas.width = imgRef.current.naturalWidth || 320;
    canvas.height = imgRef.current.naturalHeight || 240;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(imgRef.current, 0, 0);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = `captura-${Date.now()}.jpg`;
      link.click();
    }
  };

  useEffect(() => {
    startStream();
    return stopStream;
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 p-4 w-full">
      <div className="relative">
        <img
          ref={imgRef}
          src={imgSrc}
          onLoad={handleImageLoad}
          onError={handleImageError}
          alt="ESP32-CAM stream"
          className="rounded-lg border shadow-lg w-full max-w-5xl object-contain"
        />
        <div
          className={`absolute top-2 right-2 w-4 h-4 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
          title={isConnected ? "Conectado" : "Sin conexión"}
        />
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700">FPS: {fps}</span>
        <button
          onClick={startStream}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Iniciar
        </button>
        <button
          onClick={stopStream}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Detener
        </button>
        <button
          onClick={captureImage}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Capturar
        </button>
      </div>
    </div>
  );
};

export default CameraFeed;
