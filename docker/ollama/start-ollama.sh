#!/bin/bash
set -e

echo "🚀 Iniciando Ollama server..."
ollama serve &

# Guardamos PID del servidor para esperar al final si quieres
SERVER_PID=$!

HOST="localhost"
PORT=11434

echo "⏳ Esperando a Ollama en $HOST:$PORT..."

until nc -z $HOST $PORT; do
  sleep 1
done

echo "✅ Ollama está listo."

echo "🔽 Descargando modelo ${IA_MODEL}..."
ollama pull ${IA_MODEL}

# Esperamos al servidor
wait $SERVER_PID
