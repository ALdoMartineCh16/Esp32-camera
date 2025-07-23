// src/components/CameraStream.tsx
interface Props {
  streamUrl: string;
}

export default function CameraStream({ streamUrl }: Props) {
  return (
    <div className="rounded overflow-hidden shadow-lg border bg-white">
      <img
        src={streamUrl}
        alt="Cámara en vivo"
        className="w-full h-auto"
      />
    </div>
  );
}
