import TaskList from './TaskList';

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Task Manager</h1>
      <TaskList />
    </div>
  );
}

export default App;