# syntax=docker/dockerfile:1
# check=error=true

# ----------------
# 1. builder stage
# ----------------
FROM node:16 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build


# ----------------
# 2. runtime stage
# ----------------
FROM node:16-slim

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm ci --omit=dev

RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

ENTRYPOINT ["node"]
CMD ["dist/src/server.js"]

# 이미지 생성:
#    docker build -t cashman-backend .
# 이미지로 컨테이너 실행
#     docker run -p 3000:3000 -d --name app --env-file .env cashman_backend:1.0



