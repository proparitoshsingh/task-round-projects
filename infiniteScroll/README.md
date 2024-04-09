# Infinite Scroll Projects

Welcome to the Infinite Scroll Projects! This repository contains two implementations of infinite scroll functionality, one using vanilla JavaScript and the other using React.js. These projects allow users to seamlessly load more content as they scroll down the page, providing an enhanced user experience for browsing large datasets or lists.

## About

The Infinite Scroll Projects showcase two different approaches to implementing infinite scroll functionality:

1. **Vanilla JavaScript Implementation:** The vanilla JavaScript project demonstrates how to achieve infinite scroll using pure JavaScript without any additional libraries or frameworks. It provides a basic example of how to create a simple infinite scroll effect without fetching data from an API.

2. **React Implementation:** The React project showcases how to incorporate infinite scroll functionality into a React application. It utilizes the useState and useEffect hooks to manage state and trigger data loading when the user reaches the end of the element. Generates a random color for every quote and it has a nice loader, check it out :)

| ![CPT2209251134-1528x742 (1)](./react-infinite-scroll/src/assets/Screenshot%202024-04-09%20234034.jpg)
|-|
|

## Features

- **Dynamic Content Loading:** The React implementation dynamically loads more content as the user scrolls down the page, fetching data from an API.
- **Efficient Resource Management:** Content is loaded in batches to optimize performance and prevent excessive server requests.
- **Responsive Design:** Both projects are designed to be responsive and work seamlessly across different devices and screen sizes.

## Getting Started

To get started with the Infinite Scroll Projects, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the `vanilla-js-infinite-scroll` folder for the vanilla JavaScript implementation or the `react-infinite-scroll` folder for the React implementation.
3. For `react-infinite-scroll` just do an 
`npm install`
and then `npm run dev` and you will be good to go.

## Folder Structure

- **`vanilla-js-infinite-scroll/`**: Contains three files (html,css and js) for the vanilla JavaScript implementation.

- **`react-infinite-scroll/`**: Contains the files for the React implementation. Folder stucture is same as any typical vite react app.

## Issues

In the `react-infinite-scroll` when the site is loaded for the first time it has 9 cards as mentioned but suddenly it re-renders and has like 15 cards at start. I dont know what is causing the twice loading , I suspect it has something to do with the intersection logic. I will look into it later or maybe you can and let me know ;)

## Contributions

Contributions to the Infinite Scroll Projects are welcome! If you have suggestions for improvements, bug fixes, or would like to contribute new features, feel free to open an issue or submit a pull request.

## Contact

If you have any questions or feedback about the Task Manager project, feel free to reach out:

- [LinkedIn](https://www.linkedin.com/in/proparitoshsingh)
- [Twitter](https://twitter.com/proparitosh1609)
- [Send me an email](mailto:paritoshsingh1609@gmail.com)
<br><br><br>
<center>--- Paritosh Singh ---</center>