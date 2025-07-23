import React, { useEffect, useRef, useState } from "react";

const CAMERA_URL = "http://192.168.18.26/cam-hi.jpg";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const timerRef = useRef<number |null>(null);

  // Polling de la cámara para mostrar vista previa
  const [liveSrc, setLiveSrc] = useState("");
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setLiveSrc(`${CAMERA_URL}?t=${Date.now()}`);
    }, 300);
    return () => {
        if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        }
    };
  }, []);

  // Toma foto: añade el dataURL actual al array
  const takePhoto = () => {
    if (!imgRef.current) return;
    const canvas = document.createElement("canvas");
    const w = imgRef.current.naturalWidth;
    const h = imgRef.current.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(imgRef.current, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setPhotos((p) => [dataUrl, ...p]);
  };

  // Envía todas las fotos al backend
  const registerAll = async () => {
    if (!name) return setMsg("Debes indicar un nombre");
    if (photos.length === 0) return setMsg("Toma al menos una foto");
    setMsg("Registrando…");
    try {
      for (const [i, dataUrl] of photos.entries()) {
        const blob = await (await fetch(dataUrl)).blob();
        const form = new FormData();
        form.append("name", name);
        form.append("file", blob, `${name}-${i}.jpg`);
        const res = await fetch("http://127.0.0.1:8000/register", {
          method: "POST",
          body: form,
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
      }
      setMsg(`Registrado correctamente como “${name}” (${photos.length} fotos)`);
      setPhotos([]);
    } catch (e: any) {
      setMsg(`Error: ${e.message}`);
    }
  };

  return (
    <div className="p-6 flex-1 overflow-auto">
      <h1 className="text-2xl font-semibold mb-4">Registrar Nueva Persona</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-64"
        />
      </div>

      <div className="mb-4">
        <div className="relative inline-block">
          <img
            ref={imgRef}
            src={liveSrc}
            alt="Vista previa para registro"
            className="rounded border shadow-md w-80 h-60 object-cover"
          />
          <div className="absolute bottom-1 right-1 bg-white bg-opacity-75 px-2 py-1 text-xs rounded">
            Live
          </div>
        </div>
      </div>

      <div className="space-x-4 mb-6">
        <button
          onClick={takePhoto}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tomar Foto
        </button>
        <button
          onClick={registerAll}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Registrar Todas
        </button>
      </div>

      {msg && <p className="mb-4 text-gray-700">{msg}</p>}

      {photos.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Fotos a registrar</h2>
          <div className="grid grid-cols-3 gap-4">
            {photos.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Registro ${i}`}
                className="border rounded w-40 h-32 object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
