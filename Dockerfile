FROM node:10

WORKDIR '/var/www/app'

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


EXPOSE 3002

CMD ["node","dist/index.js"]
