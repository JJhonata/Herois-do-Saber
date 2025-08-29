import { useEffect, useMemo, useState } from 'react'
import { playCorrect } from '../lib/sfx'
import { addStars } from '../lib/progress'

const PHRASES = [
  { text: 'Os heróis estudam todos os dias.', hint: 'Rotina dos heróis' },
  { text: 'A escola é um lugar de aprender.', hint: 'Onde aprendemos' },
  { text: 'Eu gosto de matemática e leitura.', hint: 'Matérias favoritas' },
  { text: 'O computador ajuda nos estudos.', hint: 'Tecnologia' },
  { text: 'A leitura abre portas para o conhecimento.', hint: 'Importância de ler' },
  { text: 'Beber água faz bem para a saúde.', hint: 'Hábitos saudáveis' },
  { text: 'Brincar com amigos é muito divertido.', hint: 'Amizade' },
  { text: 'A professora explicou a lição com calma.', hint: 'Sala de aula' },
  { text: 'Hoje o recreio foi muito animado.', hint: 'Escola' },
  { text: 'Os planetas giram em torno do Sol.', hint: 'Astronomia' },
  { text: 'Devemos respeitar todas as pessoas.', hint: 'Valores' },
  { text: 'O dicionário ajuda a aprender palavras novas.', hint: 'Ferramenta de estudo' },
  { text: 'Pratico esportes para ficar mais forte.', hint: 'Atividade física' },
  { text: 'Cuidar do meio ambiente é nossa missão.', hint: 'Sustentabilidade' },
  { text: 'A música deixa o coração alegre.', hint: 'Arte' },
  { text: 'Escrever todos os dias melhora a criatividade.', hint: 'Prática de escrita' },
  { text: 'A biblioteca é um lugar silencioso.', hint: 'Biblioteca' },
  { text: 'Faço a lição antes de brincar.', hint: 'Organização' },
  { text: 'Comer frutas dá muita energia.', hint: 'Alimentação' },
  { text: 'Dormir bem ajuda no aprendizado.', hint: 'Sono' },
]

export default function DitadoMaluco() {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [speechVolume, setSpeechVolume] = useState(1)
  const frase = PHRASES[idx].text
  const iguais = useMemo(()=> (
    [...frase].map((ch, i) => ({ ch, ok: text[i] === ch }))
  ), [text, frase])

  function ouvir() {
    const utter = new SpeechSynthesisUtterance(frase)
    utter.lang = 'pt-BR'
    utter.volume = speechVolume
    utter.rate = 0.95
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
        <div className="row" style={{ gap: 10, alignItems: 'center' }}>
          <label htmlFor="ditado-volume">Volume:</label>
          <input id="ditado-volume" type="range" min={0} max={1} step={0.1} value={speechVolume} onChange={e=> setSpeechVolume(Number(e.target.value))} />
          <span>{Math.round(speechVolume*100)}%</span>
        </div>
        <textarea rows={3} value={text} onChange={e=>setText(e.target.value)} style={{ width: '100%' }} />
        <div style={{ marginTop: 8, padding: 8, border: '1px dashed #e3e8f0', borderRadius: 8 }}>
          {iguais.map((c, i)=> (
            <span key={i} style={{ color: c.ok ? 'green' : '#d00' }}>{text[i] ?? '·'}</span>
          ))}
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <p>{completo ? 'Excelente! 🎉' : 'Continue tentando, você consegue!'}</p>
          <div className="row" style={{ gap: 8 }}>
            {!completo && (
              <button className="secondary" onClick={()=> { setIdx((idx+1)%PHRASES.length); setText('') }}>Próximo</button>
            )}
            {completo && (
              <button className="accent" onClick={()=> { setIdx((idx+1)%PHRASES.length); setText('') }}>Próximo ditado</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}