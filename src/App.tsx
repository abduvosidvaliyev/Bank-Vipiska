import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import FormPage from "./pages/Form/FormPage"

const App = () => {
  return (
    <div className="bg-[#f6f7f9] h-screen">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<FormPage />} />
        <Route path="/edit/:id" element={<FormPage />} />
      </Routes>
    </div>
  )
}

export default App