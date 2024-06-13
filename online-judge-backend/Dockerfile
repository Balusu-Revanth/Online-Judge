FROM node:18-alpine

WORKDIR /app

RUN apk update && \
    apk add --no-cache \
    g++ \
    python3 \
    py3-pip \
    openjdk11-jdk

ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "index.js" ]
