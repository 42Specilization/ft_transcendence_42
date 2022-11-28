########################
# BUILD FOR PRODUCTION #
########################

FROM node:18.12.1-alpine as builder

ENV NODE_ENV build

WORKDIR /app/

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build \
	&& npm prune --production

########################
#      PRODUCTION      #
########################

FROM node:18.12.1-alpine as production

ENV NODE_ENV production
EXPOSE 3000

WORKDIR /app/
RUN mkdir data

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/

CMD [ "node", "dist/main.js" ]
