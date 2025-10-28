# Denúncias API

API REST simples para registro e consulta de denúncias de bairro.

Principais características:
- In-memory database (sem persistência)
- Autenticação JWT para moradores e admin
- Admin fixo: email `ana@qa.com`, senha `abc123`
- Geocoding determinístico das addresses (retorna lat/lng compatíveis com Google Maps)
- Swagger (arquivo em `resources/swagger.json`) e rota `/api-docs`

Como rodar

1. Instalar dependências

```bash
npm install
```

2. Iniciar

```bash
npm start
```

A API ficará disponível em `http://localhost:3333` e a documentação Swagger em `http://localhost:3333/api-docs`.

Fluxo básico

- Registrar morador: POST /residents
- Login: POST /auth/login -> retorna token
- Criar denúncia (morador): POST /complaints (Bearer token)
- Dar like: POST /complaints/{id}/like (Bearer token)
- Buscar por tipo (aprovadas): GET /complaints?type=...
- Buscar por denunciante: GET /complaints/by-reporter?name=...
- Buscar por região: GET /complaints/region (usa CEP do morador logado)
- Admin: login com `ana@qa.com`/`abc123`, depois aprovar: POST /admin/complaints/{id}/approve, deletar: DELETE /admin/complaints/{id}, listar pendentes: GET /admin/complaints/pending

Notas

- O geocoding é um mock determinístico (para não depender de APIs externas). Retorna `{ lat, lng }` como floats.
- Todos os dados são mantidos apenas na memória. Reiniciar o servidor limpa os dados.
