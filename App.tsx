import React from 'react';
import './App.css';
import About from './components/About';
import Contact from './components/Contact';
import Blog from './components/Blog';
import Payment from './components/Payment';

function App() {
  return (
    <div className="App">
      <About />
      <Payment />
      <Blog />
      <Contact />
    </div>
  );
}

export default App;
