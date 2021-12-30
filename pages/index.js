import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Centre from '../components/Centre';
import Player from '../components/Player';
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
        {/* Player */}
      </main>
      <div className='text-white sticky bottom-0 w-full items-center'>
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log('session forn index getServer -->' + session.user.accessToken);
  return {
    props: {
      session,
    },
  };
}
