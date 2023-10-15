## MoneyMatters - React Native App Setup Instructions

Welcome to the setup guide for MoneyMatters. This app is built with React Native and uses Expo for development. Please follow these instructions to set up the app on your local machine.

### Prerequisites

1. **Node.js and npm:**
   - **Installation:**
     - Visit the [Node.js official website](https://nodejs.org/).
     - Download the latest LTS version.
     - Follow the installation prompts.
     - To confirm the installation, open your system's command line or terminal and run:

```
node -v
npm -v
```

You should see version numbers for both Node and npm.

2. **Expo CLI:**

   - **Installation:**
     - Open your terminal or command line.
     - Run the following command to install Expo CLI globally:
       npm install -g expo-cli

3. **Expo Go (For Testing on Physical Devices):**

   - **Installation:**
     - **Android**: Download Expo Go from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
     - **iOS**: Download Expo Go from the [App Store](https://apps.apple.com/us/app/expo-go/id982107779).

4. **PostgreSQL 16:**

   - **Installation:**
     - Visit the [official PostgreSQL website](https://www.postgresql.org/download/).
     - Choose the right version for your operating system and follow the installation prompts.
     - Ensure the PostgreSQL server is running once installed. You might need its credentials when configuring the app's database connection.

5. **Nodemon:**
   - **Installation:**
     - Open your terminal or command line.
     - Install **nodemon** globally to enable a smooth development experience:
       `npm install -g nodemon`

### Setup Instructions

1. **Clone the Repository:**

   - **Steps:**
     - Open your terminal or command line.
     - In your local directory, run:
       `git clone https://github.com/ECSE428-Money-Matters/Finance-App.git`

2. **Setup the Backend:**

   - In the terminal, navigate to the `Finance-App/MoneyMatters/Backend` directory.
   - Install dependencies by running: `npm install`
   - Start the backend server by running:
     `nodemon index`
   - **Do not close this terminal**. This is the backend server running. Open a new separate terminal to continue with the database setup.

3. **Setup the Database:**

   - **Steps:**
     - In your new terminal, still in the `Finance-App/MoneyMatters/Backend` directory, create a user and a database for the app, this should look something like:
       ```
       psql -U postgres
       CREATE USER MoneyMatters WITH PASSWORD 'ECSE428';
       CREATE DATABASE MoneyMatters;
       \q
       ```
     - Code examples are provided in the project, in the file `index.js` to perform CRUD operations (create, get, update, delete, etc.).
     - Feel free to create new files for function definitions and other things to keep the project organized.

4. **Running the Frontend with Expo:**
   - Navigate to the `Finance-App/MoneyMatters/Frontend` directory:
   - **Steps:**
     - Install dependencies by running: `npm install`
     - In the terminal, run:
       `npx expo start`
     - A QR code and other options will appear.
     - Open the Expo Go app on your phone and scan the QR code to run the app on your device, or run an android/ios emulator that you may have installed on your pc following the commands listed in the console.
     - **Note:** Feel free to create new files for every react component you define. A "pages" and "navigation" folder have already been setup, with empty `SignUpPage.js` and `SignInPage.js` react components defined. They are imported into the `AppNavigator.js` Stack Navigator, which is where we define how users navigate through our app.

---
