import { createRoot } from 'react-dom/client';
import Challenge from '../components/Challenge.jsx';
import './index.css'; // optional: if you have global styles

createRoot(document.getElementById('root')).render(
  <Challenge />
);
