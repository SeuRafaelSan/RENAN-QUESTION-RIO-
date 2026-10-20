# MadMak • Perfil DISC — pacote de exportação

Versão exportada em 20/10/2026.

## Conteúdo

- Formulário de identificação do participante.
- Questionário DISC com 40 afirmações.
- Escala de cinco níveis: discordo totalmente a concordo totalmente.
- Afirmações diretas e inversas para reduzir respostas automáticas.
- Resultado individual com gráfico e opção de salvar em PDF.
- Painel administrativo com exportação em CSV.
- Banco de dados D1 e migrações.

## Requisitos

- Node.js 22 ou superior.
- pnpm.
- Ambiente compatível com Next.js/Vinext e Cloudflare Workers.
- Banco Cloudflare D1 conectado pelo binding `DB`.

## Instalação

1. Extraia o ZIP.
2. Abra um terminal dentro da pasta.
3. Execute `pnpm install`.
4. Configure as variáveis descritas em `.env.example`.
5. Execute `pnpm build`.

Para desenvolvimento local, use `pnpm dev`.

## Variáveis obrigatórias

- `ADMIN_USERNAME`: usuário do painel administrativo.
- `ADMIN_PASSWORD`: senha do painel administrativo.
- `ADMIN_SESSION_SECRET`: sequência longa e aleatória usada para a sessão.

As credenciais do site publicado não estão incluídas neste pacote.

## Arquivos principais

- `app/avaliacao/page.tsx`: formulário, perguntas e resultado.
- `lib/disc.ts`: banco das 40 afirmações e cálculo dos perfis.
- `app/admin/page.tsx`: painel administrativo.
- `app/api/`: gravação e consulta dos resultados.
- `db/schema.ts`: estrutura do banco de dados.
- `drizzle/`: migrações do banco.

## Observação

O resultado representa tendências comportamentais para autoconhecimento e desenvolvimento de equipe. Não constitui diagnóstico psicológico nem substitui instrumento psicométrico validado.
