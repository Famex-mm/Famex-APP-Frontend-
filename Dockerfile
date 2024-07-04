FROM node:20-alpine
COPY asset /asset/
COPY pages /pages/
COPY public /public/
COPY src /src/
COPY styles /styles/
COPY *.js /
COPY *.json /
RUN npm install --force
RUN npm run build
EXPOSE 5700
ENTRYPOINT yarn start -p 5700