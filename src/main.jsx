import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";

import setupInterceptors from "./_helpers/axiosInterceptors.js";
import rootStore from "./stores/rootStore.js";

import ApplicationRoutes from './pages/ApplicationRoutes.jsx';

import './main.scss';

setupInterceptors(rootStore);

ReactDOM.createRoot(document.getElementById('root')).render(
      <BrowserRouter>
        <ApplicationRoutes/>
      </BrowserRouter>
)
