FROM node:lts-alpine

# Weird hack to install and run the library
RUN npm install -g @jasonetco/action-record
ENTRYPOINT ["action-record"]
