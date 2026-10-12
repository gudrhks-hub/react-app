const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// 서울 현재 날씨 조회
export async function fetchSeoulWeather() {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('API Key가 없습니다.');

  const url = `${API_URL}?q=Seoul&units=metric&lang=kr&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`날씨 조회 실패 (${res.status})`);

  const data = await res.json();
  return {
    description: data.weather[0].description,
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
  };
}
