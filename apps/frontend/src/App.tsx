import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@xyflow/react/dist/style.css';
import CreatWorkFlow from './components/CreatWorkFlow';

export default function App(){

  return <div>
    <BrowserRouter>
    <Routes>
      <Route path="/create-workflow" element={<CreatWorkFlow/>}/>
    </Routes>
    </BrowserRouter>

  </div>
}