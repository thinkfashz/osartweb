# Base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS dependencies
RUN npm install --legacy-peer-deps

# Build stage
FROM dependencies AS build
COPY . .
# Add environment variables for build time if necessary
# ENV NEXT_PUBLIC_API_URL=http://your-api-url:3001
RUN npm run build

# Production stage
FROM node:20-alpine AS release
WORKDIR /app

ENV NODE_ENV=production

# Copy standalone build and static assets
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000

# Next.js standalone server
CMD ["node", "server.js"]
