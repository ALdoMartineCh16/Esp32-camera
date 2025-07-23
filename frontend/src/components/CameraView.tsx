import { useEffect, useRef, useState } from "react";

export default function CameraView() {
  const [imgSrc, setImgSrc] = useState("");
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const ip = "192.168.18.26"; // ← CAMBIA esto a la IP de tu ESP32
    const url = `http://${ip}/cam-hi.jpg`;

    intervalRef.current = setInterval(() => {
      setImgSrc(`${url}?t=${new Date().getTime()}`);
    }, 200); // Puedes probar 100, 150, etc.

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Vista de la cámara ESP32</h2>
      <img
        src={imgSrc}
        alt="ESP32 Cam"
        className="rounded-xl w-full max-w-md border border-gray-300 shadow"
      />
    </div>
  );
}