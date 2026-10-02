import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StoryIllustration from '../components/StoryIllustration'

type Book = {
  slug: string
  title: string
  cover: string
  theme: string
  level: 'Começando' | 'Praticando' | 'Desafio'
  age: string
  summary: string
  paragraphs: string[]
}

const books: Book[] = [
  {
    slug: 'semente-na-janela', title: 'A semente na janela', cover: '🌱', theme: 'Natureza', level: 'Começando', age: '1º ao 3º ano',
    summary: 'Bia acompanha uma pequena semente e descobre que cuidar também é saber esperar.',
    paragraphs: [
      'Bia encontrou uma semente redonda no bolso da mochila. A professora explicou que ela poderia virar uma planta. Em casa, Bia colocou terra num potinho, fez um buraquinho com o dedo e cobriu a semente com cuidado.',
      'Todos os dias, ela pingava um pouco de água e deixava o potinho perto da janela. No começo, nada aconteceu. Bia pensou que a semente tinha esquecido de crescer. Seu avô sorriu e disse: “Algumas mudanças começam escondidas.”',
      'Uma manhã, um pontinho verde apareceu na terra. Bia chamou a família para ver. Nos dias seguintes, o broto ficou mais alto e abriu duas folhas. Ela aprendeu que a planta precisava de água, luz e tempo.',
      'Bia continuou cuidando do vasinho. Quando a planta ficou forte, levou-a para o jardim da escola. Agora, outras crianças também podiam acompanhar aquela pequena vida crescendo.'
    ]
  },
  {
    slug: 'guarda-chuva-amarelo', title: 'O guarda-chuva amarelo', cover: '☂️', theme: 'Amizade', level: 'Começando', age: '1º ao 3º ano',
    summary: 'Num dia de chuva, Tomás percebe que dividir espaço pode transformar o caminho de todos.',
    paragraphs: [
      'Na saída da escola, o céu ficou cinza e a chuva começou. Tomás abriu seu guarda-chuva amarelo. Ele era grande o bastante para cobrir a mochila e quase todo o seu corpo.',
      'Perto do portão, Nina esperava a chuva passar. Ela tinha esquecido a capa em casa. Tomás chamou a colega para caminhar junto até a esquina. Os dois precisaram andar bem devagar para não esbarrar nas poças.',
      'No caminho, encontraram o senhor Raul carregando uma sacola de livros. O guarda-chuva parecia pequeno demais para três pessoas e uma pilha de histórias. Mesmo assim, eles se apertaram e seguiram juntos.',
      'Quando chegaram à esquina, a chuva já estava fraquinha. Nina e o senhor Raul agradeceram. Tomás percebeu que seu guarda-chuva não tinha ficado maior, mas o caminho pareceu mais leve porque foi compartilhado.'
    ]
  },
  {
    slug: 'biblioteca-cochichava', title: 'A biblioteca que cochichava', cover: '📚', theme: 'Imaginação', level: 'Praticando', age: '2º ao 4º ano',
    summary: 'Luna escuta um barulho entre as estantes e encontra uma aventura esperando por ela.',
    paragraphs: [
      'Quando a biblioteca ficou vazia, Luna ouviu um cochicho vindo da estante azul. Ela olhou para os lados. Não havia ninguém por perto. O som veio outra vez: “Por aqui!”',
      'Luna puxou um livro de capa verde. Ao abri-lo, encontrou um desenho de uma ilha, um barco e uma chave dourada. Na primeira página havia um recado: “Toda aventura começa com uma pergunta.”',
      'Ela leu sobre uma menina que procurava a origem de uma luz no farol. A cada página, Luna tentava adivinhar o que aconteceria. Às vezes acertava; em outras, a história a surpreendia.',
      'Quando terminou, a biblioteca estava quieta. Luna devolveu o livro à estante, mas levou outro para casa. Talvez aquele também tivesse um segredo. Na semana seguinte, ela voltou para descobrir.'
    ]
  },
  {
    slug: 'mapa-de-joaquim', title: 'O mapa de Joaquim', cover: '🧭', theme: 'Aventura', level: 'Praticando', age: '2º ao 5º ano',
    summary: 'Um mapa desenhado à mão conduz Joaquim por lugares conhecidos e uma descoberta especial.',
    paragraphs: [
      'Joaquim encontrou um mapa dobrado dentro de um livro antigo. O desenho mostrava a praça, a ponte e uma árvore enorme. Uma linha vermelha começava na escola e terminava perto do rio.',
      'No sábado, ele convidou a prima Eva para investigar. Primeiro, os dois seguiram até a praça. Depois cruzaram a ponte e conferiram cada curva do caminho. Joaquim queria correr, mas Eva lembrava que era melhor observar as placas.',
      'Perto do rio, encontraram a árvore desenhada no mapa. Sob um banco havia uma caixa de madeira. Dentro dela não existia ouro: havia sementes, um bilhete e o desenho de um jardim comunitário.',
      'O bilhete convidava as crianças do bairro a plantar flores no terreno vazio. Joaquim e Eva levaram as sementes para a escola e contaram a novidade. Aquele mapa não mostrava onde estava um tesouro; mostrava como criar um.'
    ]
  },
  {
    slug: 'rio-limpo', title: 'A turma e o rio limpo', cover: '💧', theme: 'Natureza', level: 'Desafio', age: '3º ao 5º ano',
    summary: 'Uma turma investiga de onde vem o lixo do rio e organiza uma solução com a comunidade.',
    paragraphs: [
      'Na visita ao rio, a turma de Miguel percebeu embalagens presas entre as pedras. Algumas estavam perto da margem; outras tinham sido carregadas pela correnteza. A professora sugeriu que a classe investigasse antes de escolher uma solução.',
      'Os estudantes conversaram com moradores e observaram as ruas depois da feira. Descobriram que havia poucas lixeiras no caminho até a água. Também viram que a chuva levava folhas e resíduos das calçadas para os bueiros.',
      'Com ajuda da associação do bairro, a turma colocou lixeiras em pontos movimentados e preparou placas explicando como separar os materiais. No sábado, famílias e estudantes recolheram o lixo da margem usando luvas e sacos resistentes.',
      'O rio não ficou limpo para sempre em um único dia. Por isso, a turma combinou de voltar todo mês e acompanhar o resultado. Miguel entendeu que cuidar de um lugar exige atenção constante e a participação de muitas pessoas.'
    ]
  },
  {
    slug: 'estrela-sem-brilho', title: 'A estrela que perdeu o brilho', cover: '⭐', theme: 'Sentimentos', level: 'Desafio', age: '3º ao 5º ano',
    summary: 'Uma estrela aprende que pedir companhia é uma forma corajosa de encontrar seu brilho.',
    paragraphs: [
      'No alto do céu, a estrela Aurora achava que precisava brilhar mais do que todas as outras. Quando uma nuvem passava, ela se esforçava tanto para aparecer que acabava cansada. Com o tempo, seu brilho ficou fraquinho.',
      'Aurora tentou se esconder atrás da Lua. Pensou que ninguém notaria sua ausência. Mas uma estrela vizinha, chamada Celeste, percebeu o silêncio e foi conversar com ela.',
      '“Não estou conseguindo brilhar como antes”, contou Aurora. Celeste não deu uma solução mágica. Apenas ficou ao seu lado e ouviu. Depois, chamou outras estrelas para formar uma constelação.',
      'Juntas, elas iluminaram o céu de um jeito diferente: nenhuma precisava ser a mais brilhante. Aurora descansou e entendeu que podia pedir ajuda quando estivesse cansada. Na noite seguinte, voltou a brilhar no seu próprio ritmo.'
    ]
  }
]

const COMPLETED_KEY = 'herois_books_completed_v1'

function readCompleted(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]')
    return Array.isArray(saved) ? saved.filter((slug): slug is string => typeof slug === 'string') : []
  } catch { return [] }
}

export default function BookLibrary() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('Todos')
  const [theme, setTheme] = useState('Todos')
  const [completed, setCompleted] = useState(readCompleted)
  const [fontSize, setFontSize] = useState(20)
  const [page, setPage] = useState(0)
  const [turnDirection, setTurnDirection] = useState<'next' | 'previous'>('next')
  const [voiceMessage, setVoiceMessage] = useState('')
  const book = books.find((item) => item.slug === slug)
  const themes = [...new Set(books.map((item) => item.theme))]
  const visibleBooks = useMemo(() => books.filter((item) => {
    const matchesText = `${item.title} ${item.summary} ${item.theme}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'))
    return matchesText && (level === 'Todos' || item.level === level) && (theme === 'Todos' || item.theme === theme)
  }), [query, level, theme])

  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }, [])

  function markCompleted() {
    if (!book) return
    const next = completed.includes(book.slug) ? completed : [...completed, book.slug]
    setCompleted(next)
    try { localStorage.setItem(COMPLETED_KEY, JSON.stringify(next)) } catch {}
  }

  function turnPage(nextPage: number) {
    if (!book) return
    const boundedPage = Math.max(0, Math.min(book.paragraphs.length, nextPage))
    setTurnDirection(boundedPage >= page ? 'next' : 'previous')
    setPage(boundedPage)
  }

  function readAloud() {
    if (!book) return
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      setVoiceMessage('A leitura em voz alta não está disponível neste navegador.')
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(`${book.title}. ${book.paragraphs.join(' ')}`)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.88
    utterance.onend = () => setVoiceMessage('Leitura em voz alta concluída.')
    utterance.onerror = () => setVoiceMessage('Não foi possível reproduzir o áudio. Você ainda pode ler o texto na tela.')
    window.speechSynthesis.speak(utterance)
    setVoiceMessage('Lendo a história em voz alta.')
  }

  if (slug && book) {
    const isCompleted = completed.includes(book.slug)
    const atLastPage = page === book.paragraphs.length
    const nextBook = books[(books.findIndex((item) => item.slug === book.slug) + 1) % books.length]
    return <div className="container books-page">
      <Link to="/books" className="books-back-link">← Todos os livros</Link>
      <article className={`book-reader book-theme-${book.theme.toLocaleLowerCase('pt-BR')}`}>
        <header className="book-reader-heading">
          <img className="book-cover reader-cover" src={`/book-art/${book.slug}.jpg`} alt="" decoding="async" />
          <div><span className="eyebrow">{book.theme} · {book.level}</span><h1>{book.title}</h1><p>{book.age} · leitura de aproximadamente 2 minutos</p></div>
        </header>
        <div className="reader-tools" aria-label="Ferramentas de leitura">
          <span>Tamanho do texto</span>
          <button type="button" className="reader-tool-button" aria-label="Diminuir tamanho do texto" disabled={fontSize <= 16} onClick={() => setFontSize((size) => Math.max(16, size - 2))}>A−</button>
          <button type="button" className="reader-tool-button" aria-label="Aumentar tamanho do texto" disabled={fontSize >= 26} onClick={() => setFontSize((size) => Math.min(26, size + 2))}>A+</button>
          <button type="button" className="reader-audio-button" onClick={readAloud}>🔊 Ouvir história</button>
        </div>
        <p className="reader-status" aria-live="polite">{voiceMessage}</p>
        {page === 0 ? <section className="storybook-cover" aria-label={`Capa do livro ${book.title}`}>
          <StoryIllustration slug={book.slug} title={book.title} />
          <div className="storybook-cover-copy"><span>{book.theme} · {book.level}</span><h2>{book.title}</h2><p>{book.summary}</p><small>Uma história original do Heróis do Saber</small></div>
          <button type="button" className="open-book-button" onClick={() => turnPage(1)}>Abrir livro <span aria-hidden="true">→</span></button>
        </section> : <>
          <div className="book-progress-row"><span>Leitura</span><div className="book-reading-progress" role="progressbar" aria-label="Progresso da leitura" aria-valuemin={0} aria-valuemax={book.paragraphs.length} aria-valuenow={page}><span style={{ width: `${(page / book.paragraphs.length) * 100}%` }} /></div><strong>Página {page} de {book.paragraphs.length}</strong></div>
          <div className={`book-spread page-turn-${turnDirection}`} key={`${book.slug}-${page}`} aria-label={`Página ${page} de ${book.paragraphs.length}`} onKeyDown={(event) => { if (event.key === 'ArrowRight') turnPage(page + 1); if (event.key === 'ArrowLeft') turnPage(page - 1) }} tabIndex={0}>
            <section className="book-paper book-art-page" aria-label="Ilustração da história">
              <span className="book-folio">{page}</span>
              <StoryIllustration slug={book.slug} title={book.title} page={page} />
              <p>{book.theme === 'Natureza' ? 'Cada pequeno detalhe faz parte da aventura.' : book.theme === 'Amizade' ? 'Uma boa história fica melhor quando é compartilhada.' : book.theme === 'Aventura' ? 'Siga as pistas e imagine o próximo passo.' : book.theme === 'Sentimentos' ? 'Há muitas maneiras de sentir e de pedir ajuda.' : 'Abra a imaginação e descubra o que vem a seguir.'}</p>
            </section>
            <section className="book-paper book-text-page" aria-label="Texto da página">
              <span className="book-page-kicker">{page === 1 ? 'Era uma vez…' : 'A história continua'}</span>
              <p className="book-page-text" style={{ fontSize }}>{book.paragraphs[page - 1]}</p>
              <span className="book-folio">{page}</span>
            </section>
          </div>
          <div className="book-page-controls" role="group" aria-label="Navegação das páginas">
            <button type="button" className="page-control-button" onClick={() => turnPage(page - 1)}>← Anterior</button>
            <span aria-live="polite">Página {page} de {book.paragraphs.length}</span>
            <button type="button" className="page-control-button next" onClick={() => turnPage(page + 1)} disabled={atLastPage}>Próxima →</button>
          </div>
        </>}
        <footer className="reader-footer">
          <p>{isCompleted ? 'Leitura concluída. Que tal escolher outra história? 🌟' : atLastPage ? 'Você chegou ao fim da história. Parabéns pela leitura!' : page === 0 ? 'Acomode-se e abra a capa para começar.' : 'Vire as páginas no seu ritmo. Você pode voltar quando quiser.'}</p>
          <div><button type="button" className="book-complete-button" onClick={markCompleted} disabled={isCompleted || !atLastPage}>{isCompleted ? '✓ Livro concluído' : 'Marcar como lido'}</button>{atLastPage && <button type="button" className="reader-next-button" onClick={() => { setFontSize(20); setPage(0); setVoiceMessage(''); navigate(`/books/${nextBook.slug}`) }}>Próximo livro →</button>}</div>
        </footer>
      </article>
    </div>
  }

  if (slug && !book) {
    return <div className="container books-page"><section className="books-empty"><span aria-hidden="true">📖</span><h1>Não encontramos esse livro</h1><p>Volte à biblioteca e escolha outra história.</p><Link className="books-primary-link" to="/books">Explorar livros</Link></section></div>
  }

  return <div className="container books-page">
    <header className="books-hero">
      <div><span className="hero-kicker">UM CANTINHO DE HISTÓRIAS</span><h1>Biblioteca de leitura</h1><p>Escolha um livro, encontre um lugar confortável e viaje pelas palavras. 📖</p></div>
      <span className="books-hero-art" aria-hidden="true">📚</span>
    </header>
    <section className="books-toolbar" aria-label="Buscar e filtrar livros">
      <label className="books-search"><span>Buscar uma história</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Título, tema ou assunto" /></label>
      <label><span>Nível de leitura</span><select value={level} onChange={(event) => setLevel(event.target.value)}><option>Todos</option><option>Começando</option><option>Praticando</option><option>Desafio</option></select></label>
      <label><span>Tema</span><select value={theme} onChange={(event) => setTheme(event.target.value)}><option>Todos</option>{themes.map((item) => <option key={item}>{item}</option>)}</select></label>
    </section>
    <div className="books-results-heading"><div><span className="eyebrow">HISTÓRIAS ORIGINAIS</span><h2>Escolha sua próxima leitura</h2></div><span>{visibleBooks.length} {visibleBooks.length === 1 ? 'livro' : 'livros'}</span></div>
    {visibleBooks.length ? <section className="books-grid" aria-label="Livros disponíveis">
      {visibleBooks.map((item) => <article className={`book-card book-theme-${item.theme.toLocaleLowerCase('pt-BR')}`} key={item.slug}>
        <div className="book-card-cover"><img src={`/book-art/${item.slug}.jpg`} alt="" loading="lazy" decoding="async" /><span className="book-level">{item.level}</span><span className="book-cover-corner" aria-hidden="true">{item.cover}</span></div>
        <span className="book-theme-label">{item.theme} · {item.age}</span>
        <h3>{item.title}</h3><p>{item.summary}</p>
        <div className="book-card-bottom"><span>⏱ Cerca de 2 min</span>{completed.includes(item.slug) && <span className="book-read-badge">✓ Lido</span>}</div>
        <Link className="book-open-link" to={`/books/${item.slug}`}>{completed.includes(item.slug) ? 'Ler novamente' : 'Ler história'} <span aria-hidden="true">→</span></Link>
      </article>)}
    </section> : <section className="books-empty" role="status"><span aria-hidden="true">🔎</span><h2>Nenhuma história encontrada</h2><p>Tente outra busca ou ajuste os filtros.</p><button type="button" className="books-primary-link" onClick={() => { setQuery(''); setLevel('Todos'); setTheme('Todos') }}>Limpar filtros</button></section>}
  </div>
}
