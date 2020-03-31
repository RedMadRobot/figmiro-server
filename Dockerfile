FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN rm -rf node_modules && \
    npm cache clean --force && \
    npm ci && \
	npm run build

EXPOSE 5000
CMD [ "npm", "start"]
