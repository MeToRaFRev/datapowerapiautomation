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
  const [domains, setDomains] = useState({
    list: [],
    selected: "",
  });
  return <ThemeProvider theme={darkmode ? createTheme(DarkTheme) : createTheme(LightTheme)}>
    <CssBaseline />
    <Appbar setAuth={setAuth} auth={auth} credentials={credentials} domains={domains} setDomains={setDomains} />
    {credentials.datapower === "" || credentials.username === "" || credentials.password === "" || auth === false?
      <Login setCredentials={setCredentials} credentials={credentials} setAuth={setAuth} auth={auth} domains={domains} setDomains={setDomains} /> :
      null}
  </ThemeProvider>
}

export default App;
