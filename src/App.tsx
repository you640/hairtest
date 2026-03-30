import { useEffect } from 'react';
import { useAppStore } from './lib/store';
import { VisualBuilder } from './components/builder/VisualBuilder';

export default function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <VisualBuilder />
    </div>
  );
}
