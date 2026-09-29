// Confete simples com canvas temporário
export function shootConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.inset = '0'
  canvas.style.pointerEvents = 'none'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')!
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    r: 4 + Math.random() * 6,
    c: `hsl(${Math.random()*360},90%,60%)`,
    vy: 2 + Math.random() * 3,
  }))
  let t = 0
  function frame() {
    t++
    ctx.clearRect(0,0,canvas.width, canvas.height)
    pieces.forEach(p => {
      p.y += p.vy
      ctx.fillStyle = p.c
      ctx.beginPath()
      ctx.arc(p.x + Math.sin(t/10)*5, p.y, p.r, 0, Math.PI*2)
      ctx.fill()
    })
    if (t < 160) requestAnimationFrame(frame)
    else canvas.remove()
  }
  frame()
}