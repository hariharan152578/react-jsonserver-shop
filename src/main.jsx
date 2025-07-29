import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ViewStory } from './ViewStory.jsx';
import {Search} from './Search.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/story/:id/:tot',
    element: <ViewStory />
  }
]);

createRoot(document.getElementById('root')).render(
<BrowserRouter basename="/react-jsonserver-shop">
  <App />
</BrowserRouter>

);
