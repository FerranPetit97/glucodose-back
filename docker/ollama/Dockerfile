FROM ollama/ollama

RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY start-ollama.sh ./start-ollama.sh
RUN chmod +x /start-ollama.sh

ENTRYPOINT ["/bin/bash", "/start-ollama.sh"]
CMD []