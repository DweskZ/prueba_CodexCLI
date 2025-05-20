## Dashboard Backend

### Requisitos
- Node.js 18+
- PostgreSQL (corriendo en Docker)

### Instalación

```bash
npm install
cp .env.example .env


En weatherController.ts, cambia esto:

const apiKey = "tu_api_key_aqui";  Por la api que te da Openweather

Ejecutar el backend npm run dev

