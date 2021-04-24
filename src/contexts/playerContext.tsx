import { createContext, useState, ReactNode, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void; // '=> void' significa que a função não possui retorno nenhum.
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  playList: (list: Episode[], index: number) => void;
  setPlayingState: (state: boolean) => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

type PlayerContextProviderProps = {
    children: ReactNode; //ou seja, qualquer coisa que o react aceita
}

export const PlayerContext = createContext({} as PlayerContextData);

//para indicar que a função vai receber algo por volta dela,
//colocamos {children} 
export function PlayerContextProvider({children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]); //colocando um array com um único elemento dentro da função
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
      setEpisodeList(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext(){
    if(isShuffling) {
        const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
        setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if(hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious(){
      if (hasPrevious){
          setCurrentEpisodeIndex(currentEpisodeIndex - 1)
      }
  }

  function togglePlay() {
    setIsPlaying(!isPlaying); //transforma no contrário
  }

  function toggleLoop() {
    setIsLooping(!isLooping); //transforma no contrário
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling); //transforma no contrário
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        playNext,
        playPrevious,
        isPlaying,
        isLooping,
        isShuffling,
        toggleLoop,
        togglePlay,
        toggleShuffle,
        setPlayingState,
        clearPlayerState,
        hasNext,
        hasPrevious
      }}
    >
        {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
    return useContext(PlayerContext)
}