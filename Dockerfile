# Imagen base de Node.js
FROM node:20

# Instala netcat para wait-for-it.sh
RUN apt-get update && apt-get install -y netcat-openbsd

# Instala pnpm globalmente
RUN npm install -g pnpm

# Establece el directorio de trabajo
WORKDIR /app

# Copia archivos de dependencias primero (para aprovechar cache)
COPY package.json pnpm-lock.yaml ./

# Instala dependencias (locked)
RUN pnpm install --frozen-lockfile

# Copia el resto del código
COPY . .

# Da permisos de ejecución al script wait-for-it.sh
RUN chmod +x ./wait-for-it.sh

# Compila el código TypeScript
RUN pnpm run build

# Expone el puerto 3000 para NestJS
EXPOSE 3000

# Comando por defecto (espera a DB y aplica migraciones)
CMD ["sh", "-c", "./wait-for-it.sh db 5432 -- pnpm start"]

