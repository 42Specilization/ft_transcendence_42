########################
# BUILD FOR PRODUCTION #
########################

FROM node:lts-alpine as builder

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
FROM nginx:stable-alpine as production-stage
ENV NODE_ENV production
RUN mkdir /app
COPY --from=builder /app/dist/ /app
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 4220
CMD ["nginx", "-g", "daemon off;"]