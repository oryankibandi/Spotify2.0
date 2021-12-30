import { signOut, useSession } from 'next-auth/react';
import {
  ChevronDownIcon,
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  LogoutIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
  UserIcon,
} from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import { shuffle } from 'lodash';
import { useRecoilState } from 'recoil';
import { playlistIdState, playlistState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-yellow-500',
  'from-orange-500',
  'from-pink-500',
  'from-purple-500',
];

function Centre() {
  const spotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilState(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const { data: session, status } = useSession();
  const fallbackIcon =
    'https://w7.pngwing.com/pngs/524/676/png-transparent-computer-icons-user-my-account-icon-cdr-eps-rim.png';

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => {
        console.log('Something went wrong -> ' + err);
      });
  }, [playlist, spotifyApi, session]);
  console.log('playlist -> ' + playlist);

  if (status === 'authenticated') {
    console.log('user session -->' + session.user.username);
    console.log(session.user.email);
  }

  return (
    <div className='text-white flex-grow h-screen overflow-y-scroll scrollbar-hide '>
      <header className='absolute top-5 right-8'>
        <div
          className='flex items-center space-x-3 rounded-full bg-black opacity-90 hover:opacity-80 p-1 pr-2 '
          onClick={signOut}
        >
          <img
            src={session?.user.image ?? fallbackIcon}
            alt='Profile image'
            className='rounded-full w-10 h-10'
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='w-5 h-5' />
        </div>
      </header>
      <section
        className={`bg-gradient-to-b to-black ${color} w-full h-80 items-end space-x-7 p-8`}
      >
        <img
          className='h-10px w-10 shadow-2xl'
          src={playlist?.images?.[0].url}
          alt='Spotify playlist'
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>
            {playlist?.name}
          </h1>
        </div>
        <div>
          <Songs />
        </div>
      </section>
    </div>
  );
}

export default Centre;
