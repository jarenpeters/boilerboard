import './App.css'
import HomePage from "./Pages/HomePage.jsx";
import Calendar from "./Pages/Calendar.jsx"
import About from "./Pages/About.jsx"
import SearchResults from "./Pages/Search.jsx"
import NavBar from "./Components/NavBar.jsx"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import React from "react";
import ScrollToTop from "./Components/ScrollToTop.jsx";
function App() {

  return (
    <BrowserRouter>
        <ScrollToTop />
      {/* Background blobs - fixed to viewport, behind everything */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-t from-boilerdark to-boilergray">
        <div className="absolute top-[-10%] left-[0%] w-120 h-120 bg-boilerorange rounded-full filter blur-[200px] opacity-20 pulse-slow-10"></div>
        <div className="absolute bottom-[15%] right-[-15%] w-120 h-120 bg-boilerorange rounded-full filter blur-[200px] opacity-20 pulse-slow-8"></div>
        <div className="absolute bottom-[-40%] right-[50%] w-120 h-120 bg-boilerorange rounded-full filter blur-[200px] opacity-20 pulse-slow-12"></div>
      </div>
      
      {/* Content wrapper - no background so blobs show through */}
      <div className="relative min-h-screen z-10">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
        <footer className="p-7 text-center text-sm opacity-70 mt-auto text-white">
            <div>
                designed by <u><a href={"https://jarenpeters.com/"} target="_blank" rel="noopener noreferrer" title="jarenpeters.com">jaren peters</a></u> © 2025 - all rights reserved.
            </div>
        </footer>
    </BrowserRouter>
  )
}

export default App
