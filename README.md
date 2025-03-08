# AUORA - React Native Application

## Overview
AORA is a mobile application built with React Native as part of the MMA301 course. This project demonstrates the implementation of core React Native concepts, components, and API usage.

## Features
- Cross-platform mobile application (iOS and Android)
- Responsive UI with React Native components
- Platform-specific implementations where necessary
- Integration with device APIs

## Prerequisites
- Node.js (v12 or newer)
- npm or Yarn package manager
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd aora
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the Metro bundler:
   ```
   npm start
   # or
   yarn start
   ```

4. Run on iOS:
   ```
   npm run ios
   # or
   yarn ios
   ```

5. Run on Android:
   ```
   npm run android
   # or
   yarn android
   ```

## Project Structure
```
aora/
├── android/          # Android native code
├── ios/              # iOS native code
├── src/              # JavaScript/TypeScript source code
│   ├── components/   # Reusable components
│   ├── screens/      # Screen components
│   ├── navigation/   # Navigation configuration
│   ├── assets/       # Images, fonts, etc.
│   └── utils/        # Utility functions
├── app.json          # Application configuration
└── package.json      # Project dependencies and scripts
```

## Development
This project was developed as part of the MMA301 course, applying concepts learned from the following sessions:
- Introduction to React Native
- Core Components for Mobile development
- Styles and Layouts
- Platform API
- Native modules

## Dependencies
- React Native
- React Navigation
- [Other major libraries used in the project]

## **Contributing**
This is an academic project for MMA301. Contributions should follow the course guidelines.

## License
[Specify license or mention that it's for academic purposes only]