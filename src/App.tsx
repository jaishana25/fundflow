import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes';
import { Navigation } from './components/Navigation';
import { ContractProvider } from './contexts/walletContext'

function App() {
  return (
    <Router>
      <ContractProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50">
          <Navigation />
          <main className="max-w-4xl mx-auto p-6">
            <AppRoutes />
          </main>
        </div>
      </ContractProvider>
    </Router>
  );
}

export default App;