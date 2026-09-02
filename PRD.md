# Product Requirement Document (PRD) — Front-end Web (Mobile Shell)

> **Historical document.** For current architecture, demo behaviour, and deployment, use [README.md](README.md) and [docs/](docs/README.md). Notable deltas: Open Finance Connect is disabled in the demo UI; default locale is `pt`; Pluggy widget dependencies were removed from the bundle.

## 1. Identificação do Repositório

- **Nome do Repositório:** `gold-queen-web`
- **Descrição:** *Mobile-first PWA dashboard inspired by royal financial management and dark fantasy medieval aesthetics, featuring bank aggregation cards, category breakdowns, Queen's Tips, and AI Gold Queen advisor using React, TypeScript, and Tailwind CSS.*

---

## 2. Visão Geral do Produto

O **Gold Queen Web** é a interface web responsiva que simula a experiência completa de um aplicativo mobile nativo de gestão financeira sob a temática **Dark Fantasy Medieval**. No desktop, a aplicação é renderizada centralizada dentro de um **frame de tela de smartphone**, simulando um test-drive de app. Em dispositivos móveis, o app se expande para ocupar 100% da viewport do navegador.

---

## 3. Arquitetura e Tech Stack

- **Framework:** React (via Vite)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (Dark Mode padrão — `#0D0D0E`, cartões `#161618`, acentos em dourado nobre `#FFD700`, púrpura místico e bordas em ouro envelhecido)
- **Gráficos:** Recharts
- **Ícones:** Lucide React (escudo dourado de guardrail, coroa real e pergaminhos)
- **Estado/HTTP:** Axios + TanStack Query

> **Nota de implementação:** o setup original previa `npx tailwindcss init -p`, comando removido na v4. O projeto usa o plugin `@tailwindcss/vite` com tokens no bloco `@theme` do CSS, sem `tailwind.config.js`. Veja o README.

---

## 4. Design & Layout (Paleta Dark Fantasy Medieval)

### 4.1 Shell Móvel no Desktop

- **Desktop:** container centralizado (`max-w-[412px] h-[860px] rounded-[48px] border-[8px] shadow-2xl overflow-hidden`).
- **Celular:** `w-full min-h-[100dvh]`, sem borda e sem raio.

### 4.2 Componentes e Telas

1. **Header da Home:** avatar da Mestre da Moeda com coroa dourada, saudação real e badge **"Queen's Court"**.
2. **Botão "Dicas da Rainha":** gradiente dourado com ícone de pergaminho, abre o modal de diagnóstico da IA.
3. **Card "Saldo em contas":** valor total consolidado e barra multi-colorida com a proporção entre os bancos conectados.
4. **Card "Gastos do mês":** gráfico de curva suave em gradiente dourado com a evolução acumulada do mês.
5. **Card "Gastos por categoria":** barra segmentada e contagem de categorias.
6. **Feed de Transações:** ícone do banco, data, nome, categoria e valor, com **tag de guardrail auditado** (`ShieldCheck` dourado) quando `is_guarded` é verdadeiro.
7. **Barra de Navegação Flutuante:** Home, botão central oval **"Consulte a Queen"** e Perfil/Cartões.

---

## 5. Modais do Sistema

### 5.1 "Dicas da Rainha" (Diagnóstico Real)

Três seções em formato de pergaminho nobre:

- **Corte de Gastos Crítico** (`critical_expense`)
- **Gestão do Tesouro** (`management_status`)
- **Direcionamento Inteligente** (`smart_guidance`)

### 5.2 Chatbot "Consulte a Gold Queen"

Bate-papo com a persona Soberana Medieval. Ao receber `429` do backend, exibe o balão de fala com o texto que a própria API devolve em `detail`, na voz da Rainha.

---

## 6. Telas Futuras (Roadmap)

- **Galeria de Cartões:** Standard (Free) e Platinum (Pro Demo) com artes medievais.
- **Aba de Investimentos:** painel com dicas para multiplicar o ouro do tesouro.

Ambas estão presentes na tela de Perfil como placeholders — a API ainda não expõe endpoints para elas.

---

## 7. Contrato com o Backend

Todos os dados vêm de [`gold-queen-api`](https://github.com/luizssantiago92/gold-queen-api):

| Tela | Endpoint |
| --- | --- |
| Login | `POST /v1/auth/login`, `GET /v1/auth/me` |
| Card Saldo | `GET /v1/dashboard/overview` |
| Card Gastos do mês | `GET /v1/dashboard/monthly-series` |
| Card Categorias | `GET /v1/dashboard/categories` |
| Feed | `GET /v1/dashboard/transactions` |
| Modal Dicas | `GET /v1/advisor/queen-tips` |
| Modal Chat | `POST /v1/chat/query` |
| Conexão bancária | `POST /v1/connections/connect`, `POST /v1/connections/sync` |

## 8. Setup

Veja o [README](README.md).
