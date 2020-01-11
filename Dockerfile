FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
#COPY package*.json ./
COPY --chown=node:node . .
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080
CMD [ "/home/node/app/node_modules/.bin/nodemon", "app.js" ]
#CMD [ "nodejs", "app.js" ]
