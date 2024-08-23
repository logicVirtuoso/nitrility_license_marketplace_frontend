import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { Provider } from 'react-redux'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Google } from './utils/utils'
import { SellerAccountDataProvider } from './context/sellerData'
import { NotificationProvider } from './context/notification'
import { CartProvider } from './context/carts'
import { SearchFilterProvider } from './context/searchFilters'
import { SocialLinkingProvider } from './context/socialLinks'
import { GlobalMusicProvider } from './context/globalMusic'
import { Web3ContextProvider } from './context/web3Context'
import { MagicUserProvider } from './context/magicUserContext'
import MyThemeProvider from './themes/themeProvider'
import { GlobalDataProvider } from './context/globalDataContext'
import { PublicProfileProvider } from './context/publicProfileContext'

import 'react-tooltip/dist/react-tooltip.css'
import './index.css'

const id = Google.client_id
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <GoogleOAuthProvider clientId={id}>
          <MyThemeProvider>
            <Web3ContextProvider>
              <MagicUserProvider>
                <SellerAccountDataProvider>
                  <NotificationProvider>
                    <CartProvider>
                      <SearchFilterProvider>
                        <SocialLinkingProvider>
                          <GlobalMusicProvider>
                            <GlobalDataProvider>
                              <PublicProfileProvider>
                                <App />
                              </PublicProfileProvider>
                            </GlobalDataProvider>
                          </GlobalMusicProvider>
                        </SocialLinkingProvider>
                      </SearchFilterProvider>
                    </CartProvider>
                  </NotificationProvider>
                </SellerAccountDataProvider>
              </MagicUserProvider>
            </Web3ContextProvider>
          </MyThemeProvider>
        </GoogleOAuthProvider>
      </DndProvider>
    </Provider>
  </BrowserRouter>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
