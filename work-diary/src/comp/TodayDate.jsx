import { useEffect, useState } from 'react';
import { formatDateTime } from '../utils/date';

function TodayDate() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // 1분마다 갱신
    const timer = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  return <p className="text-sm font-medium text-gray-700 tabular-nums">{formatDateTime(now)}</p>;
}

export default TodayDate;
