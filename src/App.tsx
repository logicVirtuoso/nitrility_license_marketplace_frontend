import ThemeRoutes from './routes'
import { Toaster } from 'react-hot-toast'
import GlobalMusicPlayerbar from './components/globalMusicPlayerbar'
import SpotifyAuthDlg from './components/spotifyAuthDlg'
import { useState } from 'react'
import 'react-multi-carousel/lib/styles.css'
import './App.css'

function App() {
  // const [openSpotifyAuthDlg, setOpenSpotifyAuthDlg] = useState<boolean>(true)
  return (
    <>
      {/* <SpotifyAuthDlg
        open={openSpotifyAuthDlg}
        setOpen={setOpenSpotifyAuthDlg}
      /> */}
      <Toaster />
      <ThemeRoutes />
      <GlobalMusicPlayerbar />
    </>
  )
}

export default App
