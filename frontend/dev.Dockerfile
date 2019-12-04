FROM node:12.6.0-alpine

ENV NODE_ENV development

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app/

COPY ./frontend/ /usr/src/app/

# RUN npm install -g @angular/cli --silent  # Required to HOT-RELOAD if not in dependencies.
RUN npm install --silent

EXPOSE 4200 49153

CMD ["npm", "start"]
