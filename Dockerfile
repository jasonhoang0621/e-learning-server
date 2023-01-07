FROM node:16.13.0
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]