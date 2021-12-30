import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  VolumeDownIcon,
  VolumeOffIcon,
} from '@heroicons/react/solid';
import { debounce } from 'lodash';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify';

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);
        console.log(data.body?.item);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
        });
      });
    }
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, session, spotifyApi]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume();
    }
  }, [volume]);

  const debouncedAdjustVolume = () => {
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {
        console.log('Something went wrong ' + err);
      });
    }, 200),
      [];
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  return (
    <div className='text-white h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      <div>
        <img
          className='hidden md:inline h-10 w-10'
          src={songInfo?.album.images?.[0].url}
          alt=''
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className='flex flex-row justify-evenly items-center'>
        <SwitchHorizontalIcon className='button' />
        <RewindIcon className='button' />
        {isPlaying ? (
          <PauseIcon className='button' />
        ) : (
          <PlayIcon className='button' onClick={handlePlayPause()} />
        )}
        <FastForwardIcon className='button' onClick={handlePlayPause()} />
        <ReplyIcon className='button' />
      </div>
      <div className='flex items-center space-x-3 md:space-x-4 justify-end'>
        <VolumeOffIcon
          className='button'
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          className='w-14 md:w-28'
          type='range'
          onChange={(e) => setVolume(Number(e.target.value))}
          value={volume}
          min={0}
          max={100}
        />
        <VolumeUpIcon
          className='button'
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
