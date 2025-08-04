import { Routes, Route } from "react-router-dom";
import "./global.scss";
import { CONSTANTS } from "./utils/constants.utils";
import { SignUpPage } from "./pages/SignUp";
import { SignInPage } from "./pages/SignIn";
import { GameStats } from "./pages/GameStats";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthCheck } from "./hooks/useAuthCheck";
import TicTacToe from "./pages/TicTacToe";

function App() {
  
  useAuthCheck();

  return (
    <div className="app">
      <Routes>
        <Route path={CONSTANTS.SIGN_UP_PAGE} element={<SignUpPage />} />
        <Route path={CONSTANTS.SIGN_IN_PAGE} element={<SignInPage />} />
        <Route
          path={CONSTANTS.GAME_STATS_PAGE}
          element={
            <ProtectedRoute>
              <GameStats />
            </ProtectedRoute>
          }
        />
        <Route
          path={CONSTANTS.TIC_TAC_TOE_PAGE}
          element={
            <ProtectedRoute>
              <TicTacToe />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

