FROM node:18
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY ./server .
CMD [ "node", "index.js" ]
