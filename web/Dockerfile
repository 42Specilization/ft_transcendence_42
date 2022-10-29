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
ENV VITE_REDIRECT_LOGIN_URL "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1a271168fad6ea9cf350d1d8b91210e566a716367e518fed6875721305fc8050&redirect_uri=http%3A%2F%2F3.86.245.190%2Foauth&response_type=code"

WORKDIR /app/

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/
COPY --from=builder /app/server.cjs /app/

CMD [ "node", "server.cjs" ]
