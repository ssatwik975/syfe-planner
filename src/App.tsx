import './App.css';
import Header from './components/Header/Header';
import GoalsSection from './components/GoalsSection/GoalsSection';

function App() {
  return (
    <div className="app-container">
      <Header />
      
      <main className="main-content">
        <GoalsSection />
      </main>
    </div>
  );
}

export default App;