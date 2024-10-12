import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Document from './pages/Document';
import Home from './pages/Home';
import Register from './pages/Register';
import './../src/App.css';

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home setIsUserSignedIn={setIsUserSignedIn} />} />
          <Route path='/dashboard' element={<Dashboard setIsUserSignedIn={setIsUserSignedIn} />} />
          <Route path='/document/:documentId' element={<Document />} />
          <Route path='/register' element={<Register setIsUserSignedIn={setIsUserSignedIn} />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

/**
    <Router>
      <Routes>
        <Route path='/' element={<Home setIsUserSignedIn={setIsUserSignedIn} />} />
        <Route path='/dashboard' element={isUserSignedIn ? (<Dashboard setIsUserSignedIn={setIsUserSignedIn} />) : (<Navigate to='/' />)} />
        <Route path='/document/:documentId' element={isUserSignedIn ? (<Document />) : (<Navigate to='/' />)} />
        <Route path='/register' element={<Register setIsUserSignedIn={setIsUserSignedIn} />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
*/