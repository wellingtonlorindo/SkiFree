FROM node:14-alpine as base

WORKDIR /usr/src/app
COPY package*.json ./
EXPOSE 8080

FROM base as prod
ENV NODE_ENV=production
RUN npm i -g webpack webpack-cli
RUN npm i
COPY . .
# RUN npm run build
# COPY . .
CMD [ "npm", "start" ]

FROM base as dev
ENV NODE_ENV=development
RUN npm i
COPY . .
CMD [ "npm", "run", "dev" ]