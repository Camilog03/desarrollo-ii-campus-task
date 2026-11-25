FROM node:24-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

ARG VERSION=dev
ARG COMMIT=lowcal
RUN printf '{"version": "%s", "commit": "%s"}' "$VERSION" "$COMMIT" > version.json

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/main"]