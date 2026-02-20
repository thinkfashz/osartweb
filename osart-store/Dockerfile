# Base stage
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS dependencies
RUN npm install

# Build stage
FROM dependencies AS build
COPY . .
# Add environment variables for build time if necessary
# ENV NEXT_PUBLIC_API_URL=http://your-api-url:3001
RUN npm run build

# Production stage
FROM node:18-alpine AS release
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000
CMD ["npm", "start"]
