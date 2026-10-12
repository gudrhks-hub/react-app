import TodayDate from './TodayDate';
import WeatherWidget from './WeatherWidget';

function Header() {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Work Diary</h1>
        <p className="mt-1 text-sm text-gray-500">오늘의 할일을 기록하세요</p>
      </div>
      <div className="flex flex-col gap-0.5 sm:items-end">
        <TodayDate />
        <WeatherWidget />
      </div>
    </header>
  );
}

export default Header;
