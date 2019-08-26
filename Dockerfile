FROM node:lts-alpine

# Install dependencies
RUN npm install -g @jasonetco/action-record --registry https://npm.pkg.github.com/

# Run `node /index.js`
ENTRYPOINT ["action-record"]
