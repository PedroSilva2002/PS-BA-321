FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY . .
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

RUN pip install --no-cache-dir -r requirements.txt

CMD ["sh", "-c", "./wait-for-it.sh db 5432 -- ./wait-for-it.sh rabbitmq 5672 -- uvicorn main:app --host 0.0.0.0 --port 8000"]
