# Etapa 1: Instalar dependências
FROM node:18 AS dependencies
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

# Instalação do libjemalloc
RUN apt-get update \
  && apt-get install -y --no-install-recommends libjemalloc2 \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Configuração do LD_PRELOAD
ENV LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libjemalloc.so.2"

# Instalação das dependências
RUN npm ci --production

# Copia as dependências instaladas na etapa anterior
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copia o restante do código-fonte
COPY . .

CMD [ "npm", "run", "prod" ]
