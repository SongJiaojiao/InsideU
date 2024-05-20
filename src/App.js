import './App.css';
import CBTFlow from './Components/CBTFlow';


export default function App() {
  return (

      <div style={globalStyles}>
        <CBTFlow />
      </div>

  );
}
const globalStyles = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // Horizontally center items
  alignItems:'center',
  margin: 0,
  padding: 0,
  height: '100vh',

};

