# Monorepo root — Railway web service (Root Directory not set)
FROM node:20-alpine AS deps
WORKDIR /app
COPY haral-shop/package.json haral-shop/package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY haral-shop/ .
ARG NEXT_PUBLIC_API_URL
ARG RAILWAY_GIT_COMMIT_SHA=unknown
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BUILD_SHA=$RAILWAY_GIT_COMMIT_SHA
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
EXPOSE 3000
CMD ["sh", "-c", "npm run start"]
