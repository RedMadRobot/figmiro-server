FROM node:12

WORKDIR /usr/src/app

RUN rm -rf node_modules && \
    rm package-lock.json && \
    npm cache clean --force

COPY package*.json ./

COPY . .

RUN npm ci && \
	npm run build

EXPOSE 5000
CMD [ "npm", "start"]
