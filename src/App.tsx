import './App.css';
import Header from './components/Header/Header';
import GoalsSection from './components/GoalsSection/GoalsSection';
import { GoalProvider } from './context/GoalContext';
import { ModalProvider } from './context/ModalContext';
import DashboardTotal from './components/DashboardTotal/DashboardTotal';
import RefreshRate from './components/RefreshRate/RefreshRate';
import GlobalContributionModal from './components/AddContribution/GlobalContributionModal';

function App() {
  return (
    <GoalProvider>
      <ModalProvider>
        <div className="app-container">
          <Header />
          
          <main className="main-content">
            <DashboardTotal />
            <RefreshRate />
            <GoalsSection />
          </main>
          
          <GlobalContributionModal />
        </div>
      </ModalProvider>
    </GoalProvider>
  );
}

export default App;