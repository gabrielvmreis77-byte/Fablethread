# Nó de Tinta

Um estúdio desktop local para escrever e planejar livros. Inspirado no que as pessoas mais valorizam em ferramentas de notas conectadas — propriedade dos dados, links e visão visual — sem exigir plugins ou uma configuração longa antes de começar.

## O que já funciona

- Editor de capítulos com salvamento automático local
- Metas de palavras por capítulo e por livro
- Planejamento em quadro por etapa: ideia, rascunho, revisão e pronto
- Mapa visual de personagens, lugares, temas, objetos e eventos
- Criação de conexões no mapa em dois cliques
- Busca em título, resumo e conteúdo
- Modo foco para escrita sem distrações
- Exportação do manuscrito completo em Markdown
- Aplicativo Windows instalável e versão portátil

## Rodar localmente

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

## Testar e empacotar

```bash
npm test
npm run build
npm run dist
```

Os instaladores são criados em `release/`.

## Privacidade

Seus livros ficam no computador, na pasta de dados do aplicativo. O Nó de Tinta não exige conta e não envia o manuscrito a nenhum serviço. Ao exportar, você escolhe onde salvar uma cópia `.md`.

## Princípios do produto

1. Escrever vem antes de configurar.
2. A estrutura de um livro deve existir desde o primeiro uso.
3. Conexões visuais precisam ajudar a história, não virar decoração.
4. O autor deve manter a posse e a portabilidade do texto.
5. Recursos essenciais não podem depender de uma coleção de plugins.

## Licença

MIT
