
## Integração Contínua (GitHub Actions)

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml). Executa em todo Pull Request para `main`.

| Job | O que faz |
| --- | --- |
| `api-unit-tests` | Java 17 + `./mvnw test` (JUnit, Mockito, MockMvc com H2) |
| `client-unit-tests` | Node 20 + `npm test` (Jest/Testing Library) + `npm run build` (lint + type check) |
| `e2e-tests` | Sobe MySQL, API (8080) e client (3000) e roda `npx playwright test` (E2E + API) |

Rodar os testes localmente:

```bash
cd api && ./mvnw test                     # caixa-branca API
cd client && npm test                     # caixa-branca client
cd playwright && npx playwright test      # caixa-preta (API e client rodando)
```
