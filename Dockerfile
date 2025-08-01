FROM mcr.microsoft.com/playwright:v1.44.1-jammy

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["node", "scrape_batidoras.js"]
