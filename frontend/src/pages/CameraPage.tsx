// frontend/src/pages/CameraPage.tsx
import React from "react";
import CameraFeed from "../components/CameraFeed";

type CameraPageProps = {
  onCapture: (src: string) => void;
};

const CameraPage: React.FC<CameraPageProps> = ({ onCapture }) => {
  return (
    <div className="flex-1 p-4 overflow-auto">
      <h2 className="text-2xl font-semibold mb-4">Vista de Cámara</h2>
      <CameraFeed onCapture={onCapture} />
    </div>
  );
};

export default CameraPage;
