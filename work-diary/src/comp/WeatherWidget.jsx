import { useEffect, useState } from 'react';
import { fetchSeoulWeather } from '../service/weatherService';

const ONE_HOUR = 60 * 60 * 1000;

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setWeather(await fetchSeoulWeather());
        setError(false);
      } catch {
        setError(true);
      }
    };
    // 실행 시 1회 + 1시간마다 갱신
    load();
    const timer = setInterval(load, ONE_HOUR);
    return () => clearInterval(timer);
  }, []);

  if (error && !weather) {
    return <p className="text-xs text-gray-400">날씨 정보를 불러올 수 없습니다</p>;
  }
  if (!weather) {
    return <p className="text-xs text-gray-400">날씨 불러오는 중...</p>;
  }

  return (
    <p className="text-xs text-gray-500">
      서울 · {weather.description} · {weather.temp}℃ · 습도 {weather.humidity}%
    </p>
  );
}

export default WeatherWidget;
