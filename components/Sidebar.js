import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  LogoutIcon,
  PlusCircleIcon,
  RssIcon,
  SearchIcon,
} from '@heroicons/react/outline';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';
import useSpotify from '../hooks/useSpotify';

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

  console.log('you selected ' + playlistId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        console.log('Retrieved playlists', data.body.items);
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  console.log(session);
  console.log(status);
  //console.log('playlists --->' + playlists[0].name);

  return (
    <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:ax-w-[15rem] hidden md:inline-flex'>
      <div className='space-y-4 pb-36'>
        <button className='flex items-center space-x-2 hover:text-white'>
          <HomeIcon className='h-5 w-5' />
          <p>Home</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <SearchIcon className='h-5 w-5' />
          <p>Search</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <LibraryIcon className='h-5 w-5' />
          <p>Your Library</p>
        </button>
        <hr className='border-t-[1.5px] border-gray-900' />

        <button className='flex items-center space-x-2 hover:text-white'>
          <PlusCircleIcon className='h-5 w-5' />
          <p>Create Playlist</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <HeartIcon className='h-5 w-5' />
          <p>Liked Songs</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <RssIcon className='h-5 w-5' />
          <p>Your Episodes</p>
        </button>
        <hr className='border-t-[1.5px] border-gray-900' />
        {/* Playlist */}
        {playlists.map((playlist) => (
          <p
            className='cursor-pointer hover:text-white'
            key={playlist.id}
            onClick={() => {
              setPlaylistId(playlist.id);
            }}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;

// export async function getServerSideProps() {
//   const spotifyApi = useSpotify();

//   if (spotifyApi.getAccessToken()) {
//     spotifyApi.getUserPlaylists().then((data) => {
//       console.log('Retrieved playlists from getSSP', data.body.items);
//       const userPlaylist = data.body.items;
//     });
//   }
//   return {
//     props: {
//       userPlaylist: userPlaylist,
//     },
//   };
// }
