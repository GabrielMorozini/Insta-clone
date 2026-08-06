FROM node:20-alpine

WORKDIR /app

# 1. Copia APENAS os arquivos de pacotes para aproveitar o cache do Docker
COPY package*.json ./

# 2. Instala dependências (se package.json não mudou, o Docker pula esta etapa)
RUN npm ci --prefer-offline --no-audit

# 3. Agora sim copia o código restante
COPY . .

CMD ["npm", "run", "dev"]