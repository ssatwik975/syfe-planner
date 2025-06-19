# Syfe Savings Planner

The Syfe Savings Planner is a client-side web application that allows users to define, track, and manage financial goals in INR or USD. The app includes live exchange rate conversion, detailed contribution tracking, and a refined user interface. 

This project was built as part of the Syfe Frontend Intern Assignment. It demonstrates a responsive, modular frontend architecture using modern React with TypeScript and raw CSS Modules, and a bit of passionate over-engineering :) 

I chose to stick with the given design and tweak it slightly, taking liberties to add functionalities and behaviours that I believe would greatly enhance user experience, such as auto-conversions, smooth toggles, contribution notes with history of contributions.

---

## Links

- **Live App**: [syfe.satwik.in](https://syfe.satwik.in/)
- **GitHub Repository**: [github.com/ssatwik975/syfe-planner](https://github.com/ssatwik975/syfe-planner)

---

## Features

### Core Functionality

- Create and track multiple financial goals in INR or USD
- Real-time conversion rates using ExchangeRate API
- Add contributions with amount, date, and optional note
- Track progress with intuitive progress bars
- Dashboard summary with totals and progress average
- Data persistence using `localStorage`

### Additional Enhancements

- Notes support for each contribution
- Contribution history and timestamps per goal
- Editable goal amounts and goal deletion
- Sorting by most recently added goals
- Smart validation (character limits, amount caps, unique names)
- Refined conversion logic for real-time bidirectional toggling
- UI polish with animations, edge-case handling, and goal completion states
- Caching and fallback support for exchange rates
- Cross-tab data synchronization using browser events

---

## Technology Stack

| Layer                | Tool/Framework                         |
|----------------------|----------------------------------------|
| Framework            | React 18 + Vite                        |
| Language             | TypeScript                             |
| Styling              | CSS Modules (with raw CSS)             |
| State Management     | React Context API + `useReducer`       |
| Persistence          | `localStorage` with sync events        |
| API Integration      | ExchangeRate API                       |

---

## Project Structure

```txt
public/                 # For small static files like SVGs 
src/
├── components/         # Modular UI components (each in its own folder)
├── context/            # Contexts for global state management
├── types/              # Centralized TypeScript type definitions
├── utils/              # Utility functions (formatting, conversion, etc.)
├── App.tsx             # Root layout
└── main.tsx            # Application entry point
and others
````

Example of component encapsulation:

```
/GoalCard
├── GoalCard.tsx
├── GoalCard.module.css
```

---

## Design Decisions

* **Component-first architecture**: Components are fully encapsulated, reusable, and located with respective their styling.
* **Type-safe development**: TypeScript used across all state and props to reduce bugs and increase maintainability.
* **React Context with Reducers**: Chosen for scalable and predictable state transitions.
* **No external UI libraries**: All UI components are handcrafted for performance and fine-tuned control.
* **Edge-case resilient**: From form validations to fallback data logic, the app is engineered to handle bad states gracefully.
* **Accessible by design**: Focus states, semantic markup, and a beautiful UI, matching the given design (including INR for Header Total)

---

## Getting Started

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/ssatwik975/syfe-planner.git
cd syfe-planner

# Install dependencies
npm install

# Add your ExchangeRate API key
echo "VITE_EXCHANGE_RATE_API_KEY=your_key_here" > .env

# Start development server
npm run dev
```


---

## Known Trade-offs

* Backend-less by design; all data is stored client-side in localStorage.
* Currency support is limited to INR and USD as per the assignment scope.
* Since the app runs entirely in-browser, the API key is exposed in the frontend bundle.

---

## Thank you!
Made by
**Satwik Singh**                                                        
Frontend Developer & Designer                         
[Resume](https://resume.satwik.in) • [LinkedIn](https://linkedin.com/in/singhsatwik) • [GitHub](https://github.com/ssatwik975)




