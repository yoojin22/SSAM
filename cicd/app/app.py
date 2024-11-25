from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from keras.preprocessing.sequence import pad_sequences
import torch.nn.functional as F
import numpy as np
import os

app = Flask(__name__)

# 전역 변수로 모델과 토크나이저 선언
model = None
tokenizer = None
device = None
category_map = {
    "0": "일반발언",
    "1": "공격발언",
    "2": "혐오발언"
}

def load_model():
    global model, tokenizer, device
    model_path = '/app/models/letr-sol-profanity-filter'
    model = BertForSequenceClassification.from_pretrained(model_path)
    tokenizer = BertTokenizer.from_pretrained(model_path)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model.to(device)
    print('Model load Finished!')

# 입력 데이터 변환
def convert_input_data(sentences):
    tokenized_texts = [tokenizer.tokenize(sent) for sent in sentences]
    MAX_LEN = 128
    input_ids = [tokenizer.convert_tokens_to_ids(x) for x in tokenized_texts]
    input_ids = pad_sequences(input_ids, maxlen=MAX_LEN, dtype="long", truncating="post", padding="post")
    attention_masks = []

    for seq in input_ids:
        seq_mask = [float(i>0) for i in seq]
        attention_masks.append(seq_mask)

    inputs = torch.tensor(input_ids)
    masks = torch.tensor(attention_masks)

    return inputs, masks

def test_sentences(sentences):
    model.eval()
    inputs, masks = convert_input_data(sentences)
    b_input_ids = inputs.to(device)
    b_input_mask = masks.to(device)
            
    with torch.no_grad():     
        outputs = model(b_input_ids, 
                        token_type_ids=None, 
                        attention_mask=b_input_mask)
    logits = outputs[0]
    logits = np.array(F.softmax(logits.detach().cpu()))
    category = np.argmax(logits)
    return {
        'normal': format(logits[0][0], ".4f"),
        'offensive': format(logits[0][1], ".4f"),
        'hate': format(logits[0][2],".4f"),
        'category': category_map[str(category)]
    }

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    sentence = data['sentence']
    result = test_sentences([sentence])
    return jsonify(result)

if __name__ == '__main__':
    load_model()  # 서버 시작 시 모델 로드
    app.run(host='0.0.0.0', port=5000)
