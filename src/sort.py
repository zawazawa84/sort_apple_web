from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin
from keras.models import load_model
import pickle
import cv2
import numpy as np

app = Flask(__name__)
CORS(app) 

# モデルとクラス名の読み込み
model = load_model('cnn.h5')
classes = pickle.load(open('classes.sav', 'rb'))

@app.route('/classify', methods=['POST'])
def classify():
    print("リクエスト来ました")
    img = request.files['image'].read()
    img = np.fromstring(img, np.uint8)
    img = cv2.imdecode(img, cv2.IMREAD_COLOR)
    img = cv2.resize(img,dsize=(224,224))
    img = img.astype('float32')
    img /= 255.0
    img = img[None, ...]
    result = model.predict(img)
    pred = result.argmax()
    pred2 = str(classes[pred])
    print(pred2)
    return {'result': pred2}

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=3001, debug=True)