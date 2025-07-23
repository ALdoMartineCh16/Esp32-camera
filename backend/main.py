import os
import pickle
from io import BytesIO
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import face_recognition

REGISTRY_DIR = "registry"
ENC_PATH = os.path.join(REGISTRY_DIR, "encodings.pkl")
PHOTOS_DIR = os.path.join(REGISTRY_DIR, "photos")

# Carga o inicializa el registro
if not os.path.isdir(PHOTOS_DIR):
    os.makedirs(PHOTOS_DIR)
if os.path.exists(ENC_PATH):
    with open(ENC_PATH, "rb") as f:
        encodings_dict = pickle.load(f)
else:
    encodings_dict = {}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajustar en producción
    allow_methods=["*"],
    allow_headers=["*"],
)

def save_encodings():
    with open(ENC_PATH, "wb") as f:
        pickle.dump(encodings_dict, f)

@app.post("/register")
async def register_person(
    name: str = Form(...),
    file: UploadFile = File(...)
):
    # Guarda la foto
    img_bytes = await file.read()
    img = face_recognition.load_image_file(BytesIO(img_bytes))
    encs = face_recognition.face_encodings(img)
    if not encs:
        return {"error": "No se detectó ninguna cara en la imagen."}
    encodings_dict[name] = encs[0]
    # Escribe el archivo
    photo_path = os.path.join(PHOTOS_DIR, f"{name}.jpg")
    with open(photo_path, "wb") as out_f:
        out_f.write(img_bytes)
    save_encodings()
    return {"status": "ok", "name": name}

@app.post("/recognize")
async def recognize_intruder(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img = face_recognition.load_image_file(BytesIO(img_bytes))
    encs = face_recognition.face_encodings(img)
    if not encs:
        return {"result": "no-face"}
    intruder_enc = encs[0]
    # Compara con cada encoding guardado
    for name, known_enc in encodings_dict.items():
        matches = face_recognition.compare_faces([known_enc], intruder_enc, tolerance=0.5)
        if matches[0]:
            return {"result": "known", "name": name}
    return {"result": "intruder"}
