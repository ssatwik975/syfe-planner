import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="header-section">
        <div className="header-title-row">
          <div className="logo">
            {/* Target/Bullseye Icon */}
            <svg className="target-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" stroke="#4F67FF" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="20" r="12" stroke="#4F67FF" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="20" r="6" fill="#4F67FF"/>
              <circle cx="20" cy="20" r="2" fill="white"/>
            </svg>
            <h1 className="header-title">Syfe Savings Planner</h1>
          </div>
          <p className="header-subtitle">Track your financial goals and build your future</p>
        </div>
      </header>
      
      <main className="main-content">
        <section className="goals-section">
          <div className="goals-header">
            <h2 className="goals-title">Your Goals</h2>
            <button className="add-goal-button">
              <span className="plus-icon">+</span>
              Add Goal
            </button>
          </div>
          <div className="goals-container">
            {/* Goals will be displayed here */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;