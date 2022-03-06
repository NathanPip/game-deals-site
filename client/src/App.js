import Header from "./components/Header.js";
import GamesList from "./components/GamesList.js";
import { AuthProvider } from "./contexts/authContext.js";
import { GlobalStateProvider } from "./contexts/globalContext.js";

function App() {
  return (
    <AuthProvider>
      <GlobalStateProvider>
        <div className="container">
          <Header />
          <GamesList />
          <div className="footer"></div>
        </div>
      </GlobalStateProvider>
    </AuthProvider>
  );
}

export default App;
