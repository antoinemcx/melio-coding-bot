FROM node:25-alpine

# Install system dependencies necessary for canvas nodejs module
RUN apk update && apk add --no-cache \
    build-base \
    g++ \
    python3 \
    cairo-dev \
    pango-dev \
    giflib-dev \
    jpeg-dev \
    pixman-dev

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

CMD ["npm", "start"]