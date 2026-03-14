# Usamos una imagen liviana de Python
FROM python:3.11-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos e instalamos dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . .

# Comando para arrancar FastAPI con recarga automática
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]