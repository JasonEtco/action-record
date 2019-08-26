FROM node:lts-alpine

# Weird hack to install and run the library
RUN npm init -y
RUN npm install @jasonetco/action-record
ENTRYPOINT ["node", "/node_modules/.bin/@jasonetco/action-record/dist"]
