########################
# BUILD FOR PRODUCTION #
########################

FROM node:16.17-alpine3.15 as builder

ENV NODE_ENV build


WORKDIR /app/

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build \
	&& npm prune --production

########################
#      PRODUCTION      #
########################

FROM node:16.17-alpine3.15 as production

ENV NODE_ENV production
ENV ACCESS_TOKEN_URI "https://api.intra.42.fr/oauth/token"
ENV CLIENT_ID "5c183cd72e3fb479931c134cc21a5a4a34df39f54ad42fb9ccb31c6bdc419b6e"
ENV CLIENT_SECRET "586712872eed5e0bb971838369167525fe7515b1a7e47fb5b151f47ead840102"
ENV REDIRECT_URI "http://localhost:8080/oauth"
ENV URL_ME "https://api.intra.42.fr/v2/me"

WORKDIR /app/

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/

CMD [ "node", "dist/main.js" ]



