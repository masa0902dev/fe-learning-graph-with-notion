import './App.css';
import InputTask from './components/InputTask';
import GraphTask from './components/GraphTask';
import Author from './components/Author';
import Description from './components/Description';

function App() {
  return (
    <div className="App">
      <GraphTask />
      <InputTask />
      <Author />
      <Description />
    </div>
  );
}

export default App;
