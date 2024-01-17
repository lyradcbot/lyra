# Etapa 1: Instalar dependências
FROM node:20 AS dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apt-get update && apt-get install libjemalloc-dev -y && apt-get clean
ENV LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libjemalloc.so"
RUN npm install --production

# Etapa 2: Copiar código-fonte
FROM node:20 AS app
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

CMD [ "npm", "run", "prod" ]
