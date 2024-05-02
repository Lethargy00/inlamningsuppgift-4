# Just ToDo It!
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. Clone the repository to you local client
2. Open the application in VS Code or a similar IDE
3. Open a terminal window and run <i><b>npm install</b></i>
4. Start the application with <i><b>npm run dev</b></i> in the terminal
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result

## About the app
This is a simple task management application. Tasks can be assigned a category, priority and status.

## Data management
- Task related data is stored on the client using IndexedDB
- Settings related data is stored in Local Storage

## UX Improvements (assignment part 2)
- Search bar added that enables the user to search for specific todos based on its title. Improved user experience when the list contains many todos
- Sort button added. Possible for the user to toggle sorting from A>Z or Z>A. A common feature in many lists that can be useful in some circumstances

## Performance optimizations (assignment part 2)
- Lazy loading of the component containing the list of todos was added but due to the minimal amount of data used the difference in performance is negligible.

## Accessability (assignment part 2)
- ARIA-labels has been added
- Title's on buttons
- Colours so it has better contrast

## Coding challenges
### Part 1
The most difficult part of building this application was understanding IndexedDB using the installed idb-package.
### Part 2
In the second part of the assignment we did not encounter any notable obstacles due to the relatively simple improvements that were made.

