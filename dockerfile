FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

# 이미지 생성:
#    docker build -t cashman-backend .
# 이미지로 컨테이너 실행
#     docker run -d -p 3000:3000 --name app cashman-backend

