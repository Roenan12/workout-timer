# Workout Timer

Workout Timer is a simple application built with React. It allows the user to set custom durations for different types of workouts, specify the number of sets, adjust the speed of each exercise, and set break lengths.

## Features

- **Custom Workout Durations**: Set specific times for different types of workouts.
- **Set Management**: Define the number of sets for each workout session.
- **Exercise Speed Control**: Adjust how fast each exercise should be performed.
- **Break Lengths**: Set custom break durations between exercises.
- **Sound Notifications**: Audible sound when the duration state changes and timer finish.
- **Play, Pause, Stop Functionality**: Control the timer with these functionalities.
- **Increment and Decrement**: Adjust the time duration manually.
- **Alarm Sound**: An alarm sound plays when the timer reaches zero.
- **Performance Optimization**: Utilizes `useEffect` for state synchronization, `memo` for component memoization, and `useMemo` for optimizing constant arrays with reactive values.

## Learning Objectives

This project was primarily developed to understand and apply the following React concepts:

- **useEffect**: Synchronizing state updates with other state changes.
- **memo**: Preventing unnecessary re-renders of components.
- **useMemo**: Memoizing constant arrays with reactive values to enhance performance.
- **useReducer**: State management using the `useReducer` hook.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/workout-timer.git

   ```
2. Navigate to the project directory:

   ```bash
   cd workout-timer

   ```

3. Install dependencies
   ```bash
   npm install

   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open the app in your browser. Navigate to `localhost:3000`.
2. Set the desired workout type, adjust number of sets, exercise speed, and break length.
3. Start the timer and follow your workout routine.

## Acknowledgements
This app was developed as part of the [Udemy course](https://www.udemy.com/course/the-ultimate-react-course/) by Jonas Schmedtmann. Special thanks to Jonas for being an excellent instructor throughout the course.
