import './App.css';
import {TopBoxComment} from './Components/index'
import { ContextProvider } from './Context/Context';
import PesanGulir from './PesanGulir';

function App() {
  return (
    // Konsep:
    // <ContentProvider/> === <ContentProvider></ContentProvider>

    <ContextProvider>
    <div className="App col-grid">
      <TopBoxComment autoFocus={false}/>
      <PesanGulir/>
    </div>
    </ContextProvider>
  );
}

export default App;
