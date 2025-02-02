FROM node:20-alpine
RUN apk update && apk add git
COPY asset /asset/
COPY pages /pages/
COPY public /public/
COPY src /src/
COPY styles /styles/
COPY *.js /
COPY *.json /
RUN yarn
RUN npm run build
EXPOSE 5700
ENTRYPOINT yarn start -p 5700