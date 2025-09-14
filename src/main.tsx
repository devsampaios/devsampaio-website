import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import PanelView from './views/Panel/Panel.view'
import { AlertProvider } from '@moreirapontocom/npmhelpers'
import { ThemeProvider } from './contexts/ThemeContext'
import HomeView from './views/Home/Home.view'
import SnakeGame from './views/Snake/SnakeGame.view'
import TicTacToeView from './views/TicTacToe/TicTacToe.view'
import MarioRunnerView from './views/Mario/Mario.view'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PanelView />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <HomeView />,
      },
      {
        path: 'games/snake',
        element: <SnakeGame />,
      },
      {
        path: 'games/tictactoe',
        element: <TicTacToeView />,
      },
      {
        path: 'games/mario-runner',
        element: <MarioRunnerView />,
      },
    ],
  },
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </ThemeProvider>
  </StrictMode>,
)
