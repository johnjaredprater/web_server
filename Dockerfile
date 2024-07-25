FROM node:22.3.0-alpine3.19

RUN npm install -g serve

COPY build/ /build

EXPOSE 3000

CMD [ "serve", "-s", "/build"]