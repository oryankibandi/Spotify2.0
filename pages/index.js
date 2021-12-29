import Head from 'next/head';
import Centre from '../components/Centre';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className='bg-black h-screen overflow-hidden'>
      <Head>
        <title>Spotify 2.0</title>
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>

      <main className='flex'>
        {/* Sidebar */}
        <Sidebar />
        {/* Centre */}
        <Centre />
      </main>
      <div>{/* Player */}</div>
    </div>
  );
}
