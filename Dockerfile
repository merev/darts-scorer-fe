FROM node:20-alpine

WORKDIR /app
COPY . .

# Enable and install correct Yarn version
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

RUN yarn install
RUN yarn build

RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "3180"]