import './App.css';
import TaskGraph from './components/TaskGraph';
import Author from './components/Author';
import Description from './components/Description';

function App() {
  return (
    <div className="App">
      <TaskGraph />
      <Author />
      <Description />
    </div>
  );
}

export default App;
