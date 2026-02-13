FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
#The first version I made of this had the stage 1 installing the production dependencies but then i realize thats not
#needed as node ./standalone already contains this

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# This creates the non root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
ENV HOSTNAME "0.0.0.0"
ENTRYPOINT ["node", "server.js"]