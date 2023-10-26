FROM node:16-alpine AS development
ENV NODE_ENV development

# Directory
WORKDIR /app
# Instalacao das dependencias
COPY package.json .
COPY yarn.lock .
RUN npm install
# Copia arquivos do src
COPY . .
RUN npm build
# Expoe a porta
EXPOSE 3000
# Inicia o programa
CMD [ "npm", "start" ]
