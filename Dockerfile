FROM node:14-alpine as base

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i --only=production
COPY . .

FROM base as prod
ENV NODE_ENV=production
RUN npm run build
COPY . .
CMD [ "npm", "start" ]

FROM base as dev
ENV NODE_ENV=development
RUN npm i
COPY . .
CMD [ "npm", "run", "dev" ]