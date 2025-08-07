#!/usr/bin/env bash
set -e

# Separar servicios (host:port) y comando (resto)
SERVICES=()
CMD=()
found_command=0

for arg in "$@"; do
  if [[ $found_command -eq 0 && "$arg" == *:* ]]; then
    SERVICES+=("$arg")
  else
    found_command=1
    CMD+=("$arg")
  fi
done

# Validar servicios
for service in "${SERVICES[@]}"; do
  HOST="${service%%:*}"
  PORT="${service##*:}"

  echo "DEBUG -> HOST='$HOST', PORT='$PORT'"

  if [[ -z "$HOST" || -z "$PORT" || ! "$PORT" =~ ^[0-9]+$ ]]; then
    echo "❌ Error: Servicio '$service' no tiene formato host:puerto válido"
    exit 1
  fi

  echo "🔄 Esperando a $HOST:$PORT..."
  while ! nc -z "$HOST" "$PORT"; do
    sleep 1
  done
  echo "✅ $HOST:$PORT está disponible."
done

# Ejecutar comando
echo "🚀 Ejecutando comando: ${CMD[*]}"
exec "${CMD[@]}"
