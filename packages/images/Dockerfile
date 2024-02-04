FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install Jemalloc
RUN apt-get update && apt-get install libjemalloc-dev -y && apt-get clean
ENV LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libjemalloc.so" 

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy app source
COPY . .

# Expose port
EXPOSE 4000

# Start command
CMD [ "npm", "run", "prod" ]