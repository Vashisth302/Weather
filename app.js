const CITY = "Delhi"; // default like the video

const $ = (id) => document.getElementById(id);
const iconUrl = (code) => `https://openweathermap.org/img/w/${code}.png`;

function setBusy(busy){
  const card = document.querySelector('.card');
  if (card) card.setAttribute('aria-busy', busy ? 'true' : 'false');
}

function titleCase(s){ return s.replace(/\b\w/g, (m) => m.toUpperCase()); }

async function fetchWeather(city){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OWM_API_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

function render(data){
  const w = data.weather?.[0] ?? {};
  const m = data.main ?? {};
  const wind = data.wind ?? {};

  $('location').textContent = data.name ?? '—';
  $('weather').textContent = w.description ? titleCase(w.description) : '—';
  $('temp').textContent = Math.round(m.temp ?? 0);
  $('humidity').textContent = Math.round(m.humidity ?? 0);
  $('wind').textContent = (wind.speed ?? 0).toFixed(1);

  if (w.icon) {
    $('icon').src = iconUrl(w.icon);
    $('icon').alt = w.description || 'Weather icon';
  }
}

async function update(){
  try{
    setBusy(true);
    const data = await fetchWeather(CITY);
    render(data);
  }catch(e){
    console.error(e);
  }finally{
    setBusy(false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  update();
  $('refreshBtn').addEventListener('click', update); // fetch latest (no reload)
});
