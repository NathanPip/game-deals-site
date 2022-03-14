import Header from "./components/Header.jsx";
import GamesList from "./components/GamesList.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import { GlobalStateProvider } from "./contexts/globalContext.jsx";

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
