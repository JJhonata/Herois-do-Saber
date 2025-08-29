# Heróis do Saber 🦸✨

<img alt="Heróis do Saber" src="public/logo.png" width="140" />

Aplicativo web educativo com mini-jogos para crianças, feito com React + Vite + TypeScript.

## Jogos incluídos
- ➗ Matemática: contas rápidas com níveis e pontuação.
- 🧠 Memória: jogo de cartas com efeito flip.
- ❓ Quiz: 4 categorias (Geral, Ciências, Português, Geografia), 20 perguntas cada.
- 🔐 Segurança Online: 20 perguntas e dicas; botão Próxima ao errar.
- ✍️ Ditado Maluco: 20 frases, leitura em voz alta com volume, pular frase.
- 🔤 Desembaralhar Palavras: 30 palavras, baralho embaralhado globalmente, botão Próxima.
- ⌨️ Digitação: 20 frases por nível (fácil, médio, difícil).
- 🎨 Pintura: quadro de desenho com ferramentas básicas.

As atividades concedem ⭐ estrelas ao acertar. O total aparece no topo.

## Requisitos
- Node.js 18+ (recomendado 20+)

## Instalação
```bash
npm install
```

## Desenvolvimento
```bash
npm run dev
```
Servidor local padrão: `http://localhost:5173`.

## Build de produção
```bash
npm run build
```
Arquivos em `dist/`. Para pré-visualizar:
```bash
npm run preview
```

## Estrutura
- `src/components/Navbar.tsx`: barra superior (som e navegação para Início).
- `src/pages/Home.tsx`: cards de acesso aos jogos.
- `src/games/*`: jogos.
- `src/styles/styles.css`: estilos globais.
- `src/lib/*`: utilitários (sons, progresso, confete).

## Acessibilidade ♿
- Foco visível em botões/links.
- Contrastes e tamanhos de fonte amigáveis.
- Leitura por voz no Ditado (SpeechSynthesis) com controle de volume.

## Notas
- Este projeto usa React Router; os jogos podem ser acessados pelos cards da Home.
- Sons podem ser ativados/desativados pelo botão de som no topo.

## Licença
Uso educacional. Ajuste conforme sua necessidade.