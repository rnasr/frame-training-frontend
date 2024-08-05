import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
import ApplicationRoutes from './pages/ApplicationRoutes.jsx';

import './main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
      <BrowserRouter>
        <ApplicationRoutes/>
      </BrowserRouter>
)
