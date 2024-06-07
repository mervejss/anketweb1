FROM node:18
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY ./server .
EXPOSE 3000
CMD [ "node", "index.js" ]
