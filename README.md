# Heróis do Saber 🦸✨

Aplicativo web educativo com minijogos para crianças, feito com React, TypeScript e Vite.

## Jogos

- **Português:** Sílaba Mágica, Ditado, Desembaralhar Palavras, Formar Frases, Pontuação Express, Detetive da Leitura, Caça-Palavras e Categorias.
- **Inglês:** Inglês de Bolso.
- **Matemática:** Matemática, Sequências, Batalha da Tabuada, Relógio e Horas, Mercadinho e Pizzaria das Frações.
- **Ciências:** Verdadeiro ou Falso, Onde Eu Vivo? e Ciclos da Natureza.
- **Geografia:** Regiões do Brasil e Missão no Mapa.
- **Raciocínio:** Memória, Quiz e Detetives da Lógica.
- **Tecnologia:** Segurança Digital e Digitação.
- **Criatividade:** Pintura.

As atividades registram estrelas no navegador. Não há conta de usuário nem sincronização entre dispositivos.

## Requisitos

- Node.js 18 ou superior (20 ou superior recomendado).

## Instalação e execução

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

Os arquivos de produção são gerados em `dist/`.

## Estrutura

- `src/lib/gameCatalog.tsx`: catálogo compartilhado de jogos, rotas e áreas.
- `src/lib/progress.ts`: leitura e gravação das estrelas no `localStorage`.
- `src/components/Navbar.tsx`: navegação e controle de som.
- `src/pages/Home.tsx`: filtro por matéria e cards dos jogos.
- `src/games/`: atividades educativas.
- `src/styles/styles.css`: estilos globais e responsividade.
- `public/_redirects`: regra de fallback de rotas para hospedagens compatíveis.

## Acessibilidade

O projeto inclui foco visível para navegação por teclado, estados acessíveis nos filtros e controles da pintura, além de suporte a preferência por movimento reduzido. O Ditado usa a síntese de voz disponível no navegador.

## Observação

O repositório ainda não contém uma suíte de testes automatizados.
