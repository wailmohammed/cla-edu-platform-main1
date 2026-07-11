import { router, publicProcedure } from "./_core/trpc";
import { z } from "zod";

const TOP_10_COURSES = [
  {
    id: 1,
    title: "Python Fundamentals",
    description: "Master Python basics and become proficient in one of the most popular programming languages",
    category: "Programming",
    difficulty: "Beginner",
    lessons: 25,
    instructor: "Sarah Chen",
    rating: 4.8,
    students: 15420,
    price: 49.99,
    duration: "40 hours",
    detailedDescription: `Learn Python from scratch with this comprehensive course. This course covers:
    
    • Python basics: variables, data types, operators
    • Control flow: if statements, loops, functions
    • Data structures: lists, dictionaries, tuples, sets
    • Object-oriented programming: classes and inheritance
    • File handling and error management
    • Working with libraries: NumPy, Pandas basics
    • Real-world projects and best practices
    
    By the end of this course, you'll be able to write clean, efficient Python code and solve real-world problems.`,
    lessons_list: [
      {
        number: 1,
        title: "Getting Started with Python",
        duration: "1.5 hours",
        topics: ["Installation", "IDE Setup", "First Program", "Variables and Types"],
      },
      {
        number: 2,
        title: "Control Flow and Functions",
        duration: "2 hours",
        topics: ["If Statements", "Loops", "Functions", "Scope"],
      },
      {
        number: 3,
        title: "Data Structures",
        duration: "2.5 hours",
        topics: ["Lists", "Dictionaries", "Tuples", "Sets"],
      },
    ],
    codeExamples: [
      {
        title: "Hello World",
        code: `print("Hello, World!")`,
      },
      {
        title: "Variables and Types",
        code: `name = "Alice"
age = 25
height = 5.8
is_student = True

print(f"{name} is {age} years old")`,
      },
      {
        title: "Functions",
        code: `def greet(name):
    return f"Hello, {name}!"

message = greet("Bob")
print(message)`,
      },
    ],
  },
  {
    id: 2,
    title: "React Fundamentals",
    description: "Build modern web applications with React, the most popular JavaScript library",
    category: "Web",
    difficulty: "Beginner",
    lessons: 26,
    instructor: "James Wilson",
    rating: 4.9,
    students: 18950,
    price: 59.99,
    duration: "45 hours",
    detailedDescription: `Master React and become a professional frontend developer. This course covers:
    
    • React fundamentals: components, JSX, props
    • State management: useState, useContext
    • Hooks: useEffect, useCallback, useReducer
    • Component lifecycle and optimization
    • Routing with React Router
    • API integration and data fetching
    • Building real-world projects
    
    Learn best practices and modern React patterns used by top companies.`,
    lessons_list: [
      {
        number: 1,
        title: "React Basics",
        duration: "2 hours",
        topics: ["Components", "JSX", "Props", "Rendering"],
      },
      {
        number: 2,
        title: "State and Hooks",
        duration: "2.5 hours",
        topics: ["useState", "useEffect", "Custom Hooks", "Hook Rules"],
      },
      {
        number: 3,
        title: "Advanced Patterns",
        duration: "3 hours",
        topics: ["Context API", "Performance", "Error Boundaries", "Suspense"],
      },
    ],
    codeExamples: [
      {
        title: "Functional Component",
        code: `function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}`,
      },
      {
        title: "useState Hook",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 3,
    title: "JavaScript Advanced",
    description: "Master advanced JavaScript concepts and become an expert developer",
    category: "Programming",
    difficulty: "Advanced",
    lessons: 32,
    instructor: "Michael Brown",
    rating: 4.7,
    students: 12340,
    price: 69.99,
    duration: "50 hours",
    detailedDescription: `Take your JavaScript skills to the next level with advanced concepts:
    
    • Closures and scope chains
    • Prototypes and inheritance
    • Async/await and Promises
    • Event handling and delegation
    • Design patterns in JavaScript
    • Performance optimization
    • Advanced debugging techniques
    
    Perfect for developers looking to master JavaScript.`,
    lessons_list: [
      {
        number: 1,
        title: "Advanced Functions",
        duration: "2 hours",
        topics: ["Closures", "Higher-order Functions", "Currying"],
      },
      {
        number: 2,
        title: "Async Programming",
        duration: "2.5 hours",
        topics: ["Promises", "Async/Await", "Error Handling"],
      },
    ],
    codeExamples: [
      {
        title: "Closure",
        code: `function outer() {
  let count = 0;
  
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2`,
      },
    ],
  },
  {
    id: 4,
    title: "Machine Learning Basics",
    description: "Introduction to machine learning algorithms and practical applications",
    category: "Data Science",
    difficulty: "Intermediate",
    lessons: 30,
    instructor: "Dr. Emily Zhang",
    rating: 4.8,
    students: 9870,
    price: 79.99,
    duration: "55 hours",
    detailedDescription: `Get started with machine learning and AI:
    
    • ML fundamentals and terminology
    • Supervised learning algorithms
    • Unsupervised learning techniques
    • Model evaluation and validation
    • Feature engineering
    • Real-world ML projects
    • Using scikit-learn and TensorFlow
    
    Hands-on projects with real datasets.`,
    lessons_list: [
      {
        number: 1,
        title: "ML Fundamentals",
        duration: "2 hours",
        topics: ["Concepts", "Datasets", "Training/Testing"],
      },
    ],
    codeExamples: [
      {
        title: "Simple Linear Regression",
        code: `from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4]])
y = np.array([2, 4, 6, 8])

model = LinearRegression()
model.fit(X, y)

prediction = model.predict([[5]])
print(prediction)  # [10.]`,
      },
    ],
  },
  {
    id: 5,
    title: "TypeScript Mastery",
    description: "Write type-safe JavaScript with TypeScript",
    category: "Programming",
    difficulty: "Intermediate",
    lessons: 24,
    instructor: "David Lee",
    rating: 4.6,
    students: 11200,
    price: 59.99,
    duration: "38 hours",
    detailedDescription: `Master TypeScript and build robust applications:
    
    • TypeScript basics and types
    • Interfaces and type aliases
    • Generics and advanced types
    • Decorators and metadata
    • Module system
    • Integration with popular frameworks
    
    Learn how top companies use TypeScript.`,
    lessons_list: [
      {
        number: 1,
        title: "TypeScript Basics",
        duration: "1.5 hours",
        topics: ["Types", "Interfaces", "Classes"],
      },
    ],
    codeExamples: [
      {
        title: "Basic Types",
        code: `interface User {
  name: string;
  age: number;
  email?: string;
}

const user: User = {
  name: "Alice",
  age: 30
};`,
      },
    ],
  },
  {
    id: 6,
    title: "Next.js Full Stack",
    description: "Build full-stack applications with Next.js",
    category: "Web",
    difficulty: "Intermediate",
    lessons: 28,
    instructor: "Jessica Martinez",
    rating: 4.8,
    students: 14560,
    price: 69.99,
    duration: "48 hours",
    detailedDescription: `Create full-stack web applications with Next.js:
    
    • Next.js fundamentals
    • Server-side rendering and static generation
    • API routes and backend integration
    • Database integration
    • Authentication and authorization
    • Deployment strategies
    • Performance optimization
    
    Build production-ready applications.`,
    lessons_list: [
      {
        number: 1,
        title: "Getting Started",
        duration: "1.5 hours",
        topics: ["Setup", "Pages", "Routing"],
      },
    ],
    codeExamples: [
      {
        title: "API Route",
        code: `// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World' })
}`,
      },
    ],
  },
  {
    id: 7,
    title: "Java Fundamentals",
    description: "Learn Java and object-oriented programming",
    category: "Programming",
    difficulty: "Beginner",
    lessons: 30,
    instructor: "Robert Kim",
    rating: 4.7,
    students: 10890,
    price: 54.99,
    duration: "42 hours",
    detailedDescription: `Master Java programming from basics to advanced:
    
    • Java syntax and data types
    • Object-oriented programming
    • Collections and generics
    • Exception handling
    • File I/O and streams
    • Multithreading basics
    • Building real applications
    
    Perfect foundation for enterprise development.`,
    lessons_list: [
      {
        number: 1,
        title: "Java Basics",
        duration: "2 hours",
        topics: ["Syntax", "Variables", "Operators"],
      },
    ],
    codeExamples: [
      {
        title: "Hello World",
        code: `public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
      },
    ],
  },
  {
    id: 8,
    title: "Deep Learning Fundamentals",
    description: "Introduction to deep learning and neural networks",
    category: "Data Science",
    difficulty: "Advanced",
    lessons: 32,
    instructor: "Prof. Alex Kumar",
    rating: 4.9,
    students: 8765,
    price: 89.99,
    duration: "60 hours",
    detailedDescription: `Dive into deep learning:
    
    • Neural network fundamentals
    • Convolutional neural networks (CNN)
    • Recurrent neural networks (RNN)
    • Transformers and attention mechanisms
    • Training and optimization
    • Transfer learning
    • Real-world applications
    
    Hands-on projects with TensorFlow and PyTorch.`,
    lessons_list: [
      {
        number: 1,
        title: "Neural Networks Basics",
        duration: "2.5 hours",
        topics: ["Perceptrons", "Backpropagation", "Activation Functions"],
      },
    ],
    codeExamples: [
      {
        title: "Simple Neural Network",
        code: `import tensorflow as tf

model = tf.keras.Sequential([
  tf.keras.layers.Dense(128, activation='relu', input_shape=(784,)),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')`,
      },
    ],
  },
  {
    id: 9,
    title: "Vue.js Essentials",
    description: "Progressive JavaScript framework for building user interfaces",
    category: "Web",
    difficulty: "Beginner",
    lessons: 24,
    instructor: "Lisa Anderson",
    rating: 4.6,
    students: 9234,
    price: 49.99,
    duration: "36 hours",
    detailedDescription: `Learn Vue.js and build interactive web applications:
    
    • Vue basics and templates
    • Component system
    • State management with Vuex
    • Vue Router for navigation
    • Composition API
    • Performance optimization
    • Integration with backend APIs
    
    Create modern, responsive web applications.`,
    lessons_list: [
      {
        number: 1,
        title: "Vue Basics",
        duration: "1.5 hours",
        topics: ["Templates", "Directives", "Data Binding"],
      },
    ],
    codeExamples: [
      {
        title: "Vue Component",
        code: `<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!',
      count: 0
    }
  }
}
</script>`,
      },
    ],
  },
  {
    id: 10,
    title: "Angular Mastery",
    description: "Enterprise-level framework for building large-scale applications",
    category: "Web",
    difficulty: "Advanced",
    lessons: 32,
    instructor: "Thomas White",
    rating: 4.7,
    students: 7654,
    price: 74.99,
    duration: "52 hours",
    detailedDescription: `Master Angular and build enterprise applications:
    
    • Angular architecture and CLI
    • Components and templates
    • Services and dependency injection
    • RxJS and reactive programming
    • Routing and navigation
    • HTTP client and API integration
    • Testing and debugging
    • Deployment strategies
    
    Industry-standard framework for large projects.`,
    lessons_list: [
      {
        number: 1,
        title: "Angular Fundamentals",
        duration: "2 hours",
        topics: ["Components", "Modules", "Services"],
      },
    ],
    codeExamples: [
      {
        title: "Angular Component",
        code: `import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  template: '<h1>{{ title }}</h1>'
})
export class HelloComponent {
  title = 'Hello Angular!';
}`,
      },
    ],
  },
];

export const courseContentRouter = router({
  getTopCourses: publicProcedure.query(async () => {
    return TOP_10_COURSES;
  }),

  getCourseById: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return TOP_10_COURSES.find((c) => c.id === input.courseId);
    }),

  getCoursesByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return TOP_10_COURSES.filter((c) => c.category === input.category);
    }),

  searchCourses: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const query = input.query.toLowerCase();
      return TOP_10_COURSES.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );
    }),

  getCourseContent: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      const course = TOP_10_COURSES.find((c) => c.id === input.courseId);
      if (!course) throw new Error("Course not found");
      return {
        ...course,
        lessons: course.lessons_list,
        codeExamples: course.codeExamples,
      };
    }),
});
