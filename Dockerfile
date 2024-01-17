FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install Jemalloc
RUN apt-get update && apt-get install libjemalloc-dev -y && apt-get clean
ENV LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libjemalloc.so" 

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json package-lock.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install --production

# Bundle app source
COPY . .

CMD [ "npm", "run", "prod" ]