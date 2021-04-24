import "../styles/global.scss";

import Header from "../components/header";
import Player from "../components/player";

import styles from "../styles/app.module.scss";
import { PlayerContextProvider } from "../contexts/playerContext";

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp;
