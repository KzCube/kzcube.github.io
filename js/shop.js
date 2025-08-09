// shop.js — витрина и корзина. Магазин показывает рандомные товары при каждой загрузке.
// По умолчанию симуляция покупки: отправка данных на "webhook" — замените на свой серверный endpoint.
const ALL_ITEMS = [
  {id:'vip', name:'VIP Доступ', desc:'Скидки, приватные зоны', price:1500, img:'assets/items/vip.png'},
  {id:'fly', name:'Команда /fly', desc:'Полёт на сервере 7 дней', price:700, img:'assets/items/fly.png'},
  {id:'coins1000', name:'1000 монет', desc:'Внутренняя валюта', price:300, img:'assets/items/coins.png'},
  {id:'legend', name:'Legend Ранг', desc:'Премиум-ранг с префиксом', price:3200, img:'assets/items/legend.png'},
  {id:'pet', name:'Питомец-капибара', desc:'Следует за вами', price:800, img:'assets/items/pet.png'},
  {id:'crate', name:'Сундук случайный', desc:'Шанс на редкие вещи', price:500, img:'assets/items/crate.png'},
  {id:'title', name:'Уникальный титул', desc:'Короткий текст в табе', price:200, img:'assets/items/title.png'},
  {id:'effect', name:'Частицы эффект', desc:'Перманентный визуальный эффект', price:1200, img:'assets/items/effect.png'}
];

let VITRINA = []; // текущая витрина
let CART = [];

// helpers
const $ = id => document.getElementById(id);
const format = n => n.toLocaleString('ru-RU') + '₸';

function randomPick(arr, n){
  const copy = arr.slice();
  const res = [];
  for(let i=0;i<n;i++){
    const idx = Math.floor(Math.random()*copy.length);
    res.push(copy.splice(idx,1)[0]);
  }
  return res;
}

function renderVitrina(){
  const grid = $('shop-grid');
  grid.innerHTML = '';
  VITRINA.forEach(item => {
    const div = document.createElement('div');
    div.className = 'shop-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p class="muted">${item.desc}</p>
      <div class="price">${format(item.price)}</div>
      <div style="margin-top:8px">
        <button class="btn" data-id="${item.id}" data-action="add">Добавить в корзину</button>
        <button class="btn ghost" data-id="${item.id}" data-action="info">Подробнее</button>
      </div>
    `;
    grid.appendChild(div);
  });
  // Делегирование
  grid.onclick = (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if(action === 'add') addToCart(id);
    if(action === 'info') alert(JSON.stringify(VITRINA.find(i=>i.id===id), null, 2));
  }
}

function addToCart(id){
  const item = ALL_ITEMS.find(i=>i.id===id);
  if(!item) return;
  CART.push(item);
  renderCart();
}

function renderCart(){
  const list = $('cart-list');
  list.innerHTML = '';
  CART.forEach((it, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `${it.name} — ${format(it.price)} <button data-idx="${idx}" class="btn small ghost remove">✕</button>`;
    list.appendChild(li);
  });
  $('cart-count').textContent = CART.length;
  const sum = CART.reduce((s,i)=>s+i.price,0);
  $('cart-sum').textContent = format(sum);
  // события удаления
  list.onclick = (e) => {
    const btn = e.target.closest('button.remove');
    if(!btn) return;
    const idx = Number(btn.dataset.idx);
    CART.splice(idx,1);
    renderCart();
  }
}

function shuffleVitrina(){
  VITRINA = randomPick(ALL_ITEMS, Math.min(6, ALL_ITEMS.length));
  renderVitrina();
}

// Checkout — симуляция
async function checkout(){
  if(CART.length === 0) { alert('Корзина пуста'); return; }
  const username = prompt('Введите ник в Minecraft для покупки (пример: KapibaraDEV)');
  if(!username) return;
  const payload = {
    nick: username,
    items: CART.map(i=>({id:i.id, name:i.name, price:i.price})),
    total: CART.reduce((s,i)=>s+i.price,0),
    ts: new Date().toISOString()
  };

  // Вариант A (рекомендуется): отправлять на свой серверный webhook, где хранится Telegram-token
  const webhook = 'PLACEHOLDER_CHECKOUT_WEBHOOK'; // замените на свой endpoint
  if(webhook && !webhook.includes('PLACEHOLDER')){
    try{
      const res = await fetch(webhook, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      alert('Заказ отправлен: ' + (json.message || 'OK'));
      CART = [];
      renderCart();
    }catch(e){
      alert('Ошибка отправки на сервер: ' + e.message);
    }
    return;
  }

  // Вариант B (локальная симуляция и подсказка)
  alert('Симуляция покупки: ' + JSON.stringify(payload, null, 2));
  CART = [];
  renderCart();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  shuffleVitrina();
  renderCart();

  $('shuffle-btn').addEventListener('click', shuffleVitrina);
  $('checkout-btn').addEventListener('click', checkout);
  $('clear-cart').addEventListener('click', () => { CART = []; renderCart(); });
});
