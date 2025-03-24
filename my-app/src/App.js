import logo from './logo.svg';
import './App.css';
import UserList from './component/UserList.jsx';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider>
      <div className="w-full max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4">User App</h1>
        <UserList />
      </div>
    </SnackbarProvider>
  );
}

export default App;
