########################
# BUILD FOR PRODUCTION #
########################

FROM node:16.17-alpine3.15 as builder

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

FROM node:16.17-alpine3.15 as production

ENV NODE_ENV production
ENV VITE_API_PORT "3000"
ENV VITE_GAME_NAMESPACE "game"

WORKDIR /app/

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/
COPY --from=builder /app/server.cjs /app/

CMD [ "node", "server.cjs" ]
