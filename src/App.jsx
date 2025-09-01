import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from "./pages/indie";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

