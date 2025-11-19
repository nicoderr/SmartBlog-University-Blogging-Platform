---
title: "Understanding JavaScript Closures"
author: "Sarah Thompson"
date: "March 12, 2025"
---

# Understanding JavaScript Closures

JavaScript closures can be a tricky concept to grasp. However, they are one of the most powerful features of the language.

## 🔹 What is a Closure?
A closure is a function that **remembers** the variables from its lexical scope **even after the function is executed**.

```js
function outerFunction(outerVariable) {
  return function innerFunction(innerVariable) {
    console.log(`Outer: ${outerVariable}, Inner: ${innerVariable}`);
  };
}

const newFunction = outerFunction("Hello");
newFunction("World"); // Output: Outer: Hello, Inner: World
