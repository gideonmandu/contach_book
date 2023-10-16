# --- Build Stage ---
FROM node:lts-alpine AS build

WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json ./
COPY yarn.lock ./

# Install all dependencies, including dev dependencies.
RUN yarn install

# Copy the source files
COPY . .

# Build the application
RUN yarn build

# --- Development Stage ---
FROM node:lts-alpine AS development

WORKDIR /app

COPY --from=build /app .

CMD [ "yarn", "dev" ]

# --- Production Stage ---
FROM node:lts-alpine AS production

WORKDIR /app

# Copy only production node_modules, build output, and other necessary files
COPY --from=build /app/package*.json ./
COPY --from=build /app/yarn.lock ./
RUN yarn install --production

COPY --from=build /app/dist ./dist

# Expose the port your app runs on
EXPOSE 3000

CMD [ "node", "dist/app.js" ]
