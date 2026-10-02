type Props = {
  slug: string
  title: string
  page?: number
}

export default function StoryIllustration({ slug, title, page }: Props) {
  if (page) {
    const column = page === 2 || page === 4 ? 1 : 0
    const row = page > 2 ? 1 : 0

    return <div className="story-page-scene" role="img" aria-label={`${title} — cena da página ${page}`}>
      <img className="story-illustration" src={`/book-art/${slug}-pages.jpg`} alt="" aria-hidden="true" decoding="async" style={{ left: column ? '-100%' : '0', top: row ? '-100%' : '0' }} />
    </div>
  }

  return <img className="story-illustration" src={`/book-art/${slug}.jpg`} alt={`Ilustração da história ${title}`} decoding="async" />
}
