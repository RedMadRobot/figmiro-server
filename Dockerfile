FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install && \
	npm run build

EXPOSE 5000
CMD [ "npm", "start"]