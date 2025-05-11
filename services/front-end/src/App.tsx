import './App.css';
import AppRoutes from './routes/AppRoutes';
import { AlertProvider } from '../src/components/alert/AlertContext';

function App() {
  return (
    <div className="app">
      <AlertProvider>
        <main>
          <AppRoutes />  
        </main>
      </AlertProvider>
    </div>
  );
}

export default App;