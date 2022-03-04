import Header from "./components/Header.js";
import GamesList from "./components/GamesList.js";
import { AuthProvider } from "./contexts/authContext.js";
import { GlobalStateProvider } from "./contexts/globalContext.js";

function App() {
  return (
    <GlobalStateProvider>
      <AuthProvider>
        <div className="container">
          <Header />
          <GamesList />
          <div className="footer"></div>
        </div>
      </AuthProvider>
    </GlobalStateProvider>
  );
}

export default App;
