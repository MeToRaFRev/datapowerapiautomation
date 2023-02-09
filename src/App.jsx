import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline, Button } from '@mui/material';
import DarkTheme from './Themes/DarkTheme.js'
import LightTheme from './Themes/LightTheme.js'
import Appbar from './components/Appbar.jsx'
import Login from './components/Login.jsx';
function App() {
  const [darkmode, setDarkmode] = useState(
    () =>
      JSON.parse(localStorage.getItem('darkmode'))
      ||
      true);
  const [credentials, setCredentials] = useState(
    () =>
      JSON.parse(localStorage.getItem('credentials'))
      ||
      { datapower: "", username: "", password: "" });
  const [auth, setAuth] = useState(false);
  return <ThemeProvider theme={darkmode ? createTheme(DarkTheme) : createTheme(LightTheme)}>
    <CssBaseline />
    <Appbar setAuth={setAuth} auth={auth} credentials={credentials} />
    {credentials.datapower === "" || credentials.username === "" || credentials.password === "" ?
      <Login setCredentials={setCredentials} setAuth={setAuth} /> :
      <div>Logged in</div>}
  </ThemeProvider>
}

export default App;
