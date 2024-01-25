# Etapa 1: Instalar dependências e jemalloc
FROM node:18 AS dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

# Instalação do libjemalloc
RUN apt-get update && apt-get install libjemalloc-dev -y && apt-get clean
ENV LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libjemalloc.so" 

# Configuração do LD_PRELOAD
ENV LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libjemalloc.so.2"

# Instalação das dependências
RUN npm ci --production

# Etapa 2: Copiar código-fonte
FROM node:18 AS app
WORKDIR /usr/src/app

# Copia as dependências instaladas na etapa anterior, incluindo o jemalloc
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copia o restante do código-fonte
COPY . .

CMD [ "npm", "run", "prod" ]
