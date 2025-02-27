// app/page.tsx
import Game from '../components/Game'; // Relative path assuming components/ is at root
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Oregon Trail Adventure',
  description: 'A simple Oregon Trail drag-and-drop game',
};

export default function Page() {
  return (
    <div>
      <main>
        <h1>Welcome to the Oregon Trail</h1>
        <Game />
      </main>
    </div>
  );
}
