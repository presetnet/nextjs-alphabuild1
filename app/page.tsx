// app/page.tsx
import Game from '@/components/Game'; // Adjust path: '@/components' is an alias for root 'components' folder
import { Metadata } from 'next';

// Export metadata instead of using <Head>
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
