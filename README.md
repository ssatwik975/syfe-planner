💰 Goal-Based Savings Planner
Take-home Assignment – Frontend Intern (React / Next.js / React Native — or any framework of
your choice)
Welcome! Your task is to build a lightweight (client-side only) Savings Planner that lets a user
create multiple financial goals (e.g. “Emergency Fund — ₹1 L”, “Trip to Japan — $2 000”) and
track progress.

Reference image for layout of the app. Feel free to tweak the design.

1. Scope & Time-box
Deadline: 2 days from when you receive the assignment
Tech choices:
- React 18+, Next.js 15, React Native or any framework of your choice
- TypeScript encouraged but not mandatory
- Any styling solution you like (Tailwind, CSS Modules, CSS-in-JS — do not use a component
library like ChakraUI, MUI or Bootstrap)
Deliverables:
1. A GitHub repo (public)

2. A short README describing setup & decisions
3. A live demo link (Vercel / Netlify / your choice) OR a video attached in the README file.

2. Core Requirements
What to build:
Goals Creation
- “Add Goal” form with: Name, Target amount, Currency (INR or USD)
Goals Display
- Display goals as cards showing: Name, Target (original currency), Target converted to the
other currency, Current saved amount (starts with 0) and Progress bar.
- Each card has an “Add Contribution” button → opens a modal where the user enters amount +
date. Update progress and totals accordingly.
Live Exchange Rate
- Fetch the latest INR ↔ USD rate from https://app.exchangerate-api.com (provides up to 1.5k
requests for free)
- Display “Last updated: {{time}}” for when the exchange rate was last fetched.
Dashboard Totals
- Top banner that shows: Total target, Total saved so far, Overall progress (total completion
percentage across all goals — average)
Interaction & UX
- “Refresh Rate” button to re-fetch forex data.
- Form validation (no negatives, required fields, reasonable number length).
- Loading & error states for async requests.
- Responsive layout.
Code Quality
- Clear component structure & naming.
- Using TypeScript is encouraged but not mandatory.
- Meaningful and multiple commit messages. (Do not commit all the code in a single commit)
- Write as if your code will go to production.

3. How We’ll Review
We’ll run the app, browse the code, and read your README.

We care most about:
1. Correctness & Completeness – do the core flows work?
2. Code Quality & Structure – is it easy to follow, modular, typed?
3. UI / UX Polish – responsive and visually coherent.
4. Communication – clear README, thoughtful commit history.
5. “Shiny Extras” are pure bonus points ✨.
No need for pixel-perfect design; prioritize clarity and functionality.

4. Gotchas
If you hit rate limits on the exchange-rate API, feel free to cache the response locally or mock it
using your own API.