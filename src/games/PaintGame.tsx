import { useEffect, useRef, useState } from 'react'
import { addStars } from '../lib/progress'

const COLORS = ['#000000', '#ff3b3b', '#ff9f1c', '#ffd166', '#7bb661', '#00d1b2', '#2c6cff', '#7c4dff', '#ff5c8a', '#ffffff']

export default function PaintGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const drawingRef = useRef(false)
  const dprRef = useRef(1)
  const snapshotRef = useRef<ImageData | null>(null)
  const historyRef = useRef<ImageData[]>([])
  const [color, setColor] = useState('#2c6cff')
  const [brush, setBrush] = useState(10)
  const [drawnPixels, setDrawnPixels] = useState(0)
  const [tool, setTool] = useState<'brush' | 'eraser' | 'picker' | 'fill' | 'line' | 'rect' | 'circle'>('brush')
  const shapeStartRef = useRef<{ x: number, y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const dpr = Math.max(1, window.devicePixelRatio || 1)
    dprRef.current = dpr
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    ctxRef.current = ctx
    // snapshot inicial para undo
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
  }, [])

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  function pushHistory() {
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height)
      historyRef.current.push(snap)
      if (historyRef.current.length > 20) historyRef.current.shift()
    } catch {}
  }

  function start(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    const { x, y } = getPos(e)
    const ctx = ctxRef.current!
    if (tool === 'picker') {
      const picked = pickColorAt(x, y)
      if (picked) setColor(picked)
      return
    }
    if (tool === 'fill') {
      pushHistory()
      floodFill(x, y, color)
      snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      return
    }
    drawingRef.current = true
    pushHistory()
    if (tool === 'brush' || tool === 'eraser') {
      ctx.beginPath()
      ctx.moveTo(x, y)
    } else {
      shapeStartRef.current = { x, y }
      // snapshot para preview
      const canvas = canvasRef.current!
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
    }
  }

  function move(e: React.MouseEvent | React.TouchEvent) {
    if (!drawingRef.current) return
    e.preventDefault()
    const { x, y } = getPos(e)
    const ctx = ctxRef.current!
    if (tool === 'brush' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
      ctx.lineWidth = brush
      ctx.lineTo(x, y)
      ctx.stroke()
      setDrawnPixels(p => p + 1)
      return
    }
    // formas com preview
    if (shapeStartRef.current && snapshotRef.current) {
      const canvas = canvasRef.current!
      // restaurar snapshot
      ctx.putImageData(snapshotRef.current, 0, 0)
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(2, Math.min(brush, 12))
      const sx = shapeStartRef.current.x
      const sy = shapeStartRef.current.y
      if (tool === 'line') {
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(x, y)
        ctx.stroke()
      } else if (tool === 'rect') {
        const w = x - sx
        const h = y - sy
        ctx.strokeRect(sx, sy, w, h)
      } else if (tool === 'circle') {
        const dx = x - sx
        const dy = y - sy
        const r = Math.sqrt(dx*dx + dy*dy)
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  function end() {
    if (!drawingRef.current) return
    drawingRef.current = false
    // finalizar forma: já foi desenhada no preview, snapshot atualiza
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    try { snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height) } catch {}
    shapeStartRef.current = null
  }

  function clearCanvas() {
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    const rect = canvas.getBoundingClientRect()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
    try { snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height) } catch {}
  }

  function saveImage() {
    const canvas = canvasRef.current!
    const dataUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'minha-pintura.png'
    a.click()
    addStars('paint', 1)
  }

  function undo() {
    const ctx = ctxRef.current!
    const prev = historyRef.current.pop()
    if (prev) {
      ctx.putImageData(prev, 0, 0)
      snapshotRef.current = prev
    }
  }

  function pickColorAt(x: number, y: number) {
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    const dpr = dprRef.current
    const px = Math.floor(x * dpr)
    const py = Math.floor(y * dpr)
    try {
      const data = ctx.getImageData(px, py, 1, 1).data
      const [r, g, b, a] = data
      if (a === 0) return '#ffffff'
      return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
    } catch {
      return null
    }
  }

  function floodFill(x: number, y: number, hex: string) {
    const canvas = canvasRef.current!
    const ctx = ctxRef.current!
    const dpr = dprRef.current
    const w = canvas.width
    const h = canvas.height
    const startX = Math.floor(x * dpr)
    const startY = Math.floor(y * dpr)
    const img = ctx.getImageData(0, 0, w, h)
    const data = img.data
    const idx = (startY * w + startX) * 4
    const target = [data[idx], data[idx+1], data[idx+2], data[idx+3]] as const
    const fill = hexToRgba(hex)
    if (colorsEqual(target, fill)) return
    const stack: number[] = [startX, startY]
    while (stack.length) {
      const cy = stack.pop() as number
      const cx = stack.pop() as number
      if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue
      const i = (cy * w + cx) * 4
      if (!colorsEqual([data[i], data[i+1], data[i+2], data[i+3]] as any, target)) continue
      data[i] = fill[0]; data[i+1] = fill[1]; data[i+2] = fill[2]; data[i+3] = 255
      stack.push(cx+1, cy, cx-1, cy, cx, cy+1, cx, cy-1)
    }
    ctx.putImageData(img, 0, 0)
  }

  function hexToRgba(hex: string): [number, number, number, number] {
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0,2), 16)
    const g = parseInt(h.substring(2,4), 16)
    const b = parseInt(h.substring(4,6), 16)
    return [r, g, b, 255]
  }

  function colorsEqual(a: readonly number[], b: readonly number[]) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && (a[3] ?? 255) === (b[3] ?? 255)
  }

  useEffect(() => {
    if (drawnPixels > 400) {
      addStars('paint', 1)
      setDrawnPixels(0)
    }
  }, [drawnPixels])

  return (
    <div className="container">
      <div className="game">
        <h2>Pintura 🎨</h2>
        <p>Desenhe, use borracha, conta-gotas, balde de tinta e formas. Salve sua arte!</p>
        <div className="row" style={{ alignItems: 'stretch' }}>
          <div className="paint-toolbar">
            <div className="tools">
              <button className={'tool-btn' + (tool==='brush' ? ' selected' : '')} onClick={()=>setTool('brush')} title="Pincel">🖌️</button>
              <button className={'tool-btn' + (tool==='eraser' ? ' selected' : '')} onClick={()=>setTool('eraser')} title="Borracha">🩹</button>
              <button className={'tool-btn' + (tool==='picker' ? ' selected' : '')} onClick={()=>setTool('picker')} title="Conta-gotas">🎯</button>
              <button className={'tool-btn' + (tool==='fill' ? ' selected' : '')} onClick={()=>setTool('fill')} title="Balde de tinta">🪣</button>
              <button className={'tool-btn' + (tool==='line' ? ' selected' : '')} onClick={()=>setTool('line')} title="Linha">／</button>
              <button className={'tool-btn' + (tool==='rect' ? ' selected' : '')} onClick={()=>setTool('rect')} title="Retângulo">▭</button>
              <button className={'tool-btn' + (tool==='circle' ? ' selected' : '')} onClick={()=>setTool('circle')} title="Círculo">◯</button>
              <button className={'tool-btn'} onClick={undo} title="Desfazer">↩️</button>
            </div>
            <div className="palette">
              {COLORS.map(c => (
                <button key={c} className={"swatch" + (c===color ? ' selected' : '')} style={{ background: c, color: c==='#ffffff'?'#333':'#fff' }} onClick={() => setColor(c)} aria-label={`Cor ${c}`} />
              ))}
            </div>
            <div className="row" style={{ gap: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                Tamanho: <input type="range" min={2} max={40} value={brush} onChange={e=>setBrush(parseInt(e.target.value))} />
              </label>
              <button className="secondary" onClick={clearCanvas}>Limpar</button>
              <button className="accent" onClick={saveImage}>Salvar</button>
            </div>
          </div>
          <div className="paint-canvas-wrap">
            <canvas
              ref={canvasRef}
              className="paint-canvas"
              onMouseDown={start}
              onMouseMove={move}
              onMouseUp={end}
              onMouseLeave={end}
              onTouchStart={e=>{ e.preventDefault(); start(e) }}
              onTouchMove={e=>{ e.preventDefault(); move(e) }}
              onTouchEnd={e=>{ e.preventDefault(); end() }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}