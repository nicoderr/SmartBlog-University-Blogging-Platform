---
title: "Getting Started with TypeScript"
author: "Emily Johnson"
date: "March 16, 2025"
---

# Getting Started with TypeScript

TypeScript is a **superset of JavaScript** that provides static typing, better tooling, and improved code maintainability.

## 🎯 Why Use TypeScript?
✅ **Static Typing** – Helps catch errors during development.  
✅ **Improved Code Readability** – Enhances team collaboration.  
✅ **Better IntelliSense** – Provides autocompletion & type hints in IDEs.

## 🔹 Basic TypeScript Example

Here’s a simple TypeScript function with type annotations:

```ts
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("Alice")); // Output: Hello, Alice!
