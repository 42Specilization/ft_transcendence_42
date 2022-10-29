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
ENV CLIENT_ID "u-s4t2ud-1a271168fad6ea9cf350d1d8b91210e566a716367e518fed6875721305fc8050"
ENV CLIENT_SECRET "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"
ENV REDIRECT_URI "http://3.86.245.190/oauth"
ENV URL_ME "https://api.intra.42.fr/v2/me"
ENV PORT "3000"
ENV CLIENT_PORT "80"
ENV HOST "3.86.245.190"

WORKDIR /app/

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/

CMD [ "node", "dist/main.js" ]



