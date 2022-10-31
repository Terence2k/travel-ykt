FROM node:14.6 AS builder
WORKDIR /app/
ADD .npmrc .
ADD package.json .
RUN npm install -g pnpm  && pnpm install
ADD . .
RUN npm run build:{build_env}

FROM nginx:1.20.2
LABEL GitRepo=#GIT_URL
COPY Shanghai /etc/localtime
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /opt/web