FROM node:12.6.0-alpine

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY ./frontend/ /usr/src/app/

# RUN npm install -g @angular/cli --silent
RUN npm install --silent

# --sourceMap="false"
RUN npm run build -- --prod="true"
