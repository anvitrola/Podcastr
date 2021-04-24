import Image from 'next/image';
import {useRef, useEffect, useState} from 'react';
import {usePlayer} from '../../contexts/playerContext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export default function Player (){
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        clearPlayerState,
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        isLooping,
        isShuffling,
        toggleLoop,
        toggleShuffle,
        hasPrevious,
        hasNext
    } = usePlayer();
    //dentro desse array episodeList está o episódio que foi passado para a função play
    //no momento em que o botão foi clicado na Home.

    useEffect(() => {
        if (!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play()
        } else{
            audioRef.current.pause()
        }

    }, [isPlaying]);

    function handleSeek (amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        } else{
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]; 
    //current episode foi setado como 0, logo, aqui estou acessando episodeList[0]
    //acessando, portanto, o primeiro elemento do array.

    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg"/>
                <strong>
                    Tocando agora
                </strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                    width={592}
                    height={592}
                    src={episode.thumbnail}
                    objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>
                        Selecione um podcast para ouvir!
                    </strong>
                </div>)
            }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{backgroundColor: '#04d361'}}
                                railStyle={{backgroundColor: '#9f75ff'}}
                                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider}/>
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                
                {episode && (
                    <audio src={episode.url}
                    ref={audioRef}
                    autoPlay
                    loop={isLooping}
                    onEnded={handleEpisodeEnded}
                    onPlay={() =>setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button 
                    type="button" 
                    onClick={toggleShuffle} 
                    disabled={!episode || episodeList.length == 1}
                    className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg"/>
                    </button>

                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg"/>
                    </button>

                    <button 
                    type="button" 
                    className={styles.playButton} 
                    disabled={!episode}
                    onClick={togglePlay}
                    >
                        {isPlaying 
                            ? <img src="/pause.svg"/>
                            : <img src="/play.svg"/>
                        }
                    </button>

                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg"/>
                    </button>

                    <button 
                    type="button" 
                    onClick={toggleLoop} 
                    disabled={!episode}
                    className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}