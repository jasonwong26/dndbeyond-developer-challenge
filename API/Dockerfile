FROM node:15

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY tsconfig.json ./ 

RUN npm install

COPY . /src

EXPOSE 3000
CMD [ "npm", "start" ]