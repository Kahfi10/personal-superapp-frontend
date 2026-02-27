import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoteApp from './NoteApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NoteApp />} />
        <Route path="/notes" element={<NoteApp />} />
      </Routes>
    </Router>
  );
}

export default App;
