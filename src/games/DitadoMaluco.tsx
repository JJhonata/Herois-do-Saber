import { useEffect, useMemo, useState } from 'react'
import { playCorrect } from '../lib/sfx'
import { addStars } from '../lib/progress'

const PHRASES = [
  { text: 'Os heróis estudam todos os dias.', hint: 'Rotina dos heróis' },
  { text: 'A escola é um lugar de aprender.', hint: 'Onde aprendemos' },
  { text: 'Eu gosto de matemática e leitura.', hint: 'Matérias favoritas' },
  { text: 'O computador ajuda nos estudos.', hint: 'Tecnologia' },
]

export default function DitadoMaluco() {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const frase = PHRASES[idx].text
  const iguais = useMemo(()=> (
    [...frase].map((ch, i) => ({ ch, ok: text[i] === ch }))
  ), [text, frase])

  function ouvir() {
    const utter = new SpeechSynthesisUtterance(frase)
    utter.lang = 'pt-BR'
    window.speechSynthesis.speak(utter)
  }

  const completo = text === frase
  const [awarded, setAwarded] = useState(false)
  useEffect(()=>{
    if (completo && !awarded) {
      playCorrect();
      addStars('ditado', 1);
      setAwarded(true)
    }
    if (!completo && awarded) setAwarded(false)
  }, [completo, awarded])

  return (
    <div className="container">
      <div className="game">
        <h2>Ditado Maluco ✍️</h2>
        <p>Ouça e digite a frase. Use a dica se precisar.</p>
        <div className="row">
          <button className="secondary" onClick={ouvir}>🔊 Ouvir</button>
          <span>Dica: {PHRASES[idx].hint}</span>
        </div>
        <textarea rows={3} value={text} onChange={e=>setText(e.target.value)} style={{ width: '100%' }} />
        <div style={{ marginTop: 8, padding: 8, border: '1px dashed #e3e8f0', borderRadius: 8 }}>
          {iguais.map((c, i)=> (
            <span key={i} style={{ color: c.ok ? 'green' : '#d00' }}>{text[i] ?? '·'}</span>
          ))}
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <p>{completo ? 'Excelente! 🎉' : 'Continue tentando, você consegue!'}</p>
          {completo && (
            <button className="accent" onClick={()=> { setIdx((idx+1)%PHRASES.length); setText('') }}>Próximo ditado</button>
          )}
        </div>
      </div>
    </div>
  )
}


