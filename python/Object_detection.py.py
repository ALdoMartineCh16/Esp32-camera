import cv2 #opencv
import urllib.request #to open and read URL
import numpy as np
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
classFile = os.path.join(script_dir, 'coco.names')
weightsPath = os.path.join(script_dir, 'frozen_inference_graph.pb')
configPath  = os.path.join(script_dir, 'ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt')

#OBJECT CLASSIFICATION PROGRAM FOR VIDEO IN IP ADDRESS

url = 'http://192.168.18.26/cam-hi.jpg'
#url = 'http://192.168.0.159/'
winName = 'ESP32 CAMERA'
cv2.namedWindow(winName,cv2.WINDOW_AUTOSIZE)
#scale_percent = 80 # percent of original size    #for image processing

classNames = []

for path in (classFile, configPath, weightsPath):
    if not os.path.isfile(path):
        raise FileNotFoundError(f"No existe el archivo: {path}")

with open(classFile,'rt') as f:
    classNames = f.read().rstrip('\n').split('\n')


net = cv2.dnn_DetectionModel(weightsPath,configPath)
net.setInputSize(320,320)
#net.setInputSize(480,480)
net.setInputScale(1.0/127.5)
net.setInputMean((127.5, 127.5, 127.5))
net.setInputSwapRB(True)

while(1):
    imgResponse = urllib.request.urlopen (url) # here open the URL
    imgNp = np.array(bytearray(imgResponse.read()),dtype=np.uint8)
    img = cv2.imdecode (imgNp,-1) #decodificamos

    img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE) # vertical
    #img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) #black and white

    

    classIds, confs, bbox = net.detect(img,confThreshold=0.5)
    print(classIds,bbox)

    if len(classIds) != 0:
        for classId, confidence,box in zip(classIds.flatten(),confs.flatten(),bbox):
            cv2.rectangle(img,box,color=(0,255,0),thickness = 3) #mostramos en rectangulo lo que se encuentra
            cv2.putText(img, classNames[classId-1], (box[0]+10,box[1]+30), cv2.FONT_HERSHEY_COMPLEX, 1, (0,255,0),2)


    cv2.imshow(winName,img) #  show the picture

    #wait for ESC to be pressed to end the program
    tecla = cv2.waitKey(5) & 0xFF
    if tecla == 27:
        break
cv2.destroyAllWindows()
