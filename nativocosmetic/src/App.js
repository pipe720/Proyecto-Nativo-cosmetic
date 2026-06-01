import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MiContextoProvider } from "./MiContexto";
import Home from './Home';

function App() {                    
  return (   
    <MiContextoProvider>
    <Router>
      <Routes>         
         <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  </MiContextoProvider>  
    /*AQUI SE VAN A CARGAS LAS RUTAS con react-router-do */
  );
}

export default App;
