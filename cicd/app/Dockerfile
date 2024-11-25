FROM python:3.8-slim

WORKDIR /app

RUN pip install --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

ENV PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION=python
ENV CUDA_VISIBLE_DEVICES=-1
ENV TF_FORCE_GPU_ALLOW_GROWTH=true

CMD ["python", "app.py"]
