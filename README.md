# Heróis do Saber

Aplicativo web educativo para crianças, com minijogos, histórias interativas e atividades de aprendizagem. O projeto funciona diretamente no navegador, sem conta de usuário e sem necessidade de servidor de aplicação.

## Proposta

O Heróis do Saber transforma conteúdos escolares em atividades curtas e interativas. A criança pode escolher uma matéria, praticar no próprio ritmo, receber feedback, ganhar estrelas e revisar respostas incorretas.

O projeto reúne 26 atividades nas seguintes áreas:

- **Português:** Sílaba Mágica, Ditado, Desembaralhar Palavras, Formar Frases, Pontuação Express, Detetive da Leitura, Caça-Palavras e Categorias.
- **Inglês:** Inglês de Bolso.
- **Matemática:** Matemática, Sequências, Batalha da Tabuada, Relógio e Horas, Mercadinho e Pizzaria das Frações.
- **Ciências:** Verdadeiro ou Falso, Onde Eu Vivo? e Ciclos da Natureza.
- **Geografia:** Regiões do Brasil e Missão no Mapa.
- **Raciocínio:** Memória, Quiz e Detetives da Lógica.
- **Tecnologia:** Segurança Digital e Digitação.
- **Criatividade:** Pintura.

Também existe uma biblioteca com histórias originais, filtros por nível e tema, leitura paginada, controle de tamanho do texto e leitura em voz alta.

## Tecnologias e linguagens

- **TypeScript:** regras de negócio, tipos e componentes tipados.
- **TSX:** componentes e páginas React.
- **CSS:** layout, temas, responsividade, animações e estados de acessibilidade.
- **HTML:** documento inicial e metadados da aplicação.
- **JSON:** configuração de dependências e lockfile do npm.
- **React 18:** interface e composição de componentes.
- **React Router 7:** rotas da Home, Biblioteca, jogos e página 404.
- **Vite 8:** servidor de desenvolvimento e build de produção.
- **Vitest 5:** testes unitários e de componentes.
- **Testing Library:** testes de hooks e interações React.
- **Playwright:** testes de navegador e fluxos E2E.

## Recursos principais

- 26 jogos carregados sob demanda.
- Estrelas, progresso e sessões persistentes por jogo.
- Chaves semânticas para estados salvos no navegador, com compatibilidade com sessões antigas.
- Sugestão de próximo jogo e retomada da última atividade.
- Revisão de erros baseada nas respostas registradas.
- Resumo final com pontuação, percentual, reinício e revisão.
- Sequência de dias ativos de aprendizagem.
- Biblioteca com progresso de leitura salvo por livro.
- Síntese de voz para atividades e histórias quando disponível no navegador.
- Sons opcionais usando Web Audio API.
- Confete condicionado à preferência de movimento reduzido.
- Página 404 e tratamento de erro no carregamento de jogos.

## Persistência

Os dados são armazenados localmente com `localStorage`. O projeto não possui backend, autenticação ou sincronização entre dispositivos.

São persistidos, entre outros dados:

- estrelas por jogo;
- último jogo aberto;
- jogos visitados;
- estado atual de cada atividade;
- respostas para revisão;
- preferências de acessibilidade;
- preferência de som;
- progresso e livros concluídos;
- dias ativos de aprendizagem.

## Requisitos

- Node.js 20.19 ou superior.
- Node.js 22 ou 24 é recomendado.

## Instalação e desenvolvimento

```bash
npm install
npm run dev
```

O Vite inicia o servidor local em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

O build é gerado em `dist/`.

## Testes

Testes unitários e de componentes:

```bash
npm test
```

A suíte cobre progresso, sessões persistentes, revisão de respostas, catálogo de jogos, embaralhamento, Home e resultado final das atividades.

Testes E2E:

```bash
npx playwright install chromium
npm run test:e2e
```

Os cenários E2E cobrem busca na Home, Biblioteca, página 404 e foco do feedback após uma resposta. Em ambientes sem acesso ao servidor de downloads do Playwright, o Chromium precisa ser instalado previamente ou disponibilizado pela imagem de CI.

## Estrutura do projeto

- `src/main.tsx`: ponto de entrada React e configuração do Router.
- `src/App.tsx`: shell global, rotas, carregamento dos jogos e tratamento de erros.
- `src/pages/`: Home, Biblioteca e páginas de navegação.
- `src/games/`: atividades educativas individuais.
- `src/components/`: Navbar, suporte dos jogos, cabeçalhos, resultados e ilustrações.
- `src/lib/gameCatalog.tsx`: catálogo, rotas, áreas, dicas e aprendizagens.
- `src/lib/gameSession.tsx`: estado persistente por jogo.
- `src/lib/progress.ts`: estrelas, visitas, sequência de dias e progresso geral.
- `src/lib/review.ts`: registro e consulta de respostas para revisão.
- `src/lib/preferences.ts`: preferências de tamanho, contraste e movimento.
- `src/lib/sfx.ts`: sons opcionais usando Web Audio API.
- `src/styles/foundation.css`: tokens visuais, reset e tipografia base.
- `src/styles/navigation.css`: navegação e contraste.
- `src/styles/styles.css`: componentes, jogos, páginas e responsividade.
- `public/book-art/`: imagens das capas e ilustrações dos livros.
- `public/_redirects`: fallback de rotas para hospedagens compatíveis.

## Acessibilidade

O projeto inclui:

- foco visível para teclado;
- feedbacks com `aria-live`;
- foco automático no resultado das atividades;
- controles semânticos para filtros e progresso;
- opção de aumentar ou reduzir o texto;
- modo de alto contraste;
- preferência de movimento reduzido;
- leitura em voz alta;
- controles de jogos visuais usando botões acessíveis;
- link para pular diretamente ao conteúdo principal.

## Segurança e qualidade

As dependências de produção e desenvolvimento são verificadas com `npm audit`. O projeto usa TypeScript estrito, testes automatizados e build de produção com Vite.

Antes de abrir uma alteração, recomenda-se executar:

```bash
npm test
npm run build
npm audit
```