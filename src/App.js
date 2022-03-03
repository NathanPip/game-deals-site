import Header from "./components/Header.js";
import GamesList from "./components/GamesList.js";
import { AuthProvider } from "./contexts/authContext.js";

function App() {
  return (
    <AuthProvider>
      <div className="container">
        <Header />
        <GamesList />
        <div className="footer"></div>
      </div>
    </AuthProvider>
  );
}

export default App;
