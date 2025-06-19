import './App.css';
import Header from './components/Header/Header';
import GoalsSection from './components/GoalsSection/GoalsSection';
import { GoalProvider } from './context/GoalContext';
import { ModalProvider } from './context/ModalContext';
import DashboardTotal from './components/DashboardTotal/DashboardTotal';
import GlobalContributionModal from './components/AddContribution/GlobalContributionModal';
import GlobalDetailedGoalModal from './components/DetailedGoal/GlobalDetailedGoalModal';

function App() {
  return (
    <GoalProvider>
      <ModalProvider>
        <div className="app-container">
          <Header />
          
          <main className="main-content">
            <DashboardTotal />
            <GoalsSection />
          </main>
          
          <GlobalContributionModal />
          <GlobalDetailedGoalModal />
        </div>
      </ModalProvider>
    </GoalProvider>
  );
}

export default App;