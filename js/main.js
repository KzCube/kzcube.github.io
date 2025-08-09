// main.js — общая логика: копировать IP, показать QR (canvas), имитировать статус сервера
document.addEventListener('DOMContentLoaded', () => {
  const ipEl = document.getElementById('server-ip');
  const copyBtn = document.getElementById('copy-ip');
  const qrBtn = document.getElementById('qr-btn');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const qrCanvas = document.getElementById('qr-canvas');
  const qrCaption = document.getElementById('qr-caption');
  const serverStatus = document.getElementById('server-status');

  copyBtn.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(ipEl.textContent.trim());
      copyBtn.textContent = 'Скопировано!';
      setTimeout(()=> copyBtn.textContent = 'Копировать', 1500);
    }catch(e){
      alert('Не удалось скопировать. Скопируй вручную: ' + ipEl.textContent);
    }
  });

  // QR: простой генератор (encode to canvas) — минималистичный: рисуем текст как изображение
  qrBtn.addEventListener('click', () => {
    const ctx = qrCanvas.getContext('2d');
    ctx.fillStyle = '#0b0b0f';
    ctx.fillRect(0,0,qrCanvas.width,qrCanvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    const text = ipEl.textContent.trim();
    // простая визуализация: разбиваем и рисуем
    const cols = 6;
    const rows = 6;
    let i = 0;
    for(let y=0;y<rows;y++){
      for(let x=0;x<cols;x++){
        ctx.fillStyle = (Math.random()>0.45)?'#fff':'#071421';
        ctx.fillRect(x*(qrCanvas.width/cols), y*(qrCanvas.height/rows), (qrCanvas.width/cols)-2, (qrCanvas.height/rows)-2)
      }
    }
    ctx.fillStyle='#0b0b0f';
    ctx.fillRect(10,10,40,40); // logo block
    ctx.fillStyle='#fff';
    ctx.fillText('Kz', 20, 36);
    qrCaption.textContent = 'Сканируй IP: ' + text;
    modal.classList.remove('hidden');
  });

  modalClose.addEventListener('click', ()=> modal.classList.add('hidden'));

  // Сервер-статус: имитация + опционально: real check via user provided API endpoint
  async function checkStatus(){
    const ip = ipEl.textContent.trim();
    // if user sets a special endpoint, it can be fetched here; by default — имитация
    serverStatus.textContent = 'Онлайн'; serverStatus.style.color = '#7ed957';
    // небольшой анимационный эффект
    setTimeout(()=> {
      if(Math.random() < 0.08){
        serverStatus.textContent = 'Оффлайн';
        serverStatus.style.color = '#ff6b6b';
      }
    }, 800);
  }
  checkStatus();

  // Открыть магазин с index
  const openShop = document.getElementById('open-shop');
  if(openShop){
    openShop.addEventListener('click', ()=> location.href = 'shop.html');
  }
});
