# node.js 이미지를 바탕으로 컨테이너를 실행한 후
# http://localhost:3333으로 접속했을 때 hello from server 메시지가 표시되게 만드세요 
FROM node:16-alpine

# 앱 디렉터리 생성 - 컨테이너 디렉토리 
WORKDIR /usr/src/app

# 호스트 계정에 있는 package.json, package-lock.json 파일을 컨테이너 현재 디렉토리 안에 복사
COPY package*.json ./

# 앱 의존성 설치
RUN npm install

# 호스트 계정(' . ')에 있는 소스파일 전체를 dockerfile과 동일한 위치한 컨테이너 위치에 복사
COPY . .

#포트 3000연결
EXPOSE 3000

# 컨테이너 running시 실행
CMD [ "npm", "start" ]