// app/page.tsx
import PreGame from '../components/PreGame'; // Ensure this is the entry point
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ezra Meeker\'s Oregon Trail Adventure',
  description: 'A challenging 8-bit themed Oregon Trail game with mini-games and survival mechanics',
};

export default function Page() {
  return (
    <div style={{ backgroundColor: '#8B4513', minHeight: '100vh', padding: '20px' }}>
      <main>
        <h1 style={{ color: '#32CD32', fontFamily: 'monospace', textAlign: 'center' }}>
          Ezra Meeker's Oregon Trail Adventure
        </h1>
        <PreGame />
      </main>
    </div>
  );
}
