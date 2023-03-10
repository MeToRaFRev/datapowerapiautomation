import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
const request = (url, method, data, headers) => {
    return axios({
        method,
        url,
        data,
        headers
    })
}

export default function Login(props) {
    const { setAuth, auth, setCredentials, credentials, domains, setDomains } = props;
    const [dialogData, setDialogData] = React.useState({ open: true, username: '', password: '', datapower: '', loading: false })

    const handleLogin = (properties) => {
        request(`http://${properties.datapower}/Tools/rest-cors/mgmt/config/default/APISecurityBasicAuth`, 'get', null, { 'Authorization': `Basic ${btoa(`${properties.username}:${properties.password}`)}` })
            .then(() => {
                setAuth(true)
                localStorage.setItem('credentials', JSON.stringify({ username: properties.username, password: properties.password, datapower: properties.datapower }))
                request(`http://${properties.datapower}/Tools/rest-cors/mgmt/domains/config/`, 'get', null, { 'Authorization': `Basic ${btoa(`${properties.username}:${properties.password}`)}` }).then((res) => {
                    if (res.data.domain) {
                        if (!Array.isArray(res.data.domain)) {
                            alert(`This error is not suppose to happend but its likely happend because there is an issue with the domains of the datapower. Please contact the developer. Error: ${res.data.domain}`)
                        }
                        else {
                            let pulledDomains = []
                            Object.keys(res.data.domain).forEach((key) => {
                                if (res.data.domain[key].name !== 'default' && res.data.domain[key].name !== '_Tools')
                                    pulledDomains.push(res.data.domain[key].name);
                                if (res.data.domain[key].name === '_Test' || res.data.domain[key].name === '_Production') {
                                    alert('Looks like you already installed the automation or either failed to.')
                                }
                            });
                            pulledDomains.length > 0 ? setDomains({ list: pulledDomains, selected: pulledDomains[0] }) : setDomains({ ...domains, list: pulledDomains })
                            setDialogData({ ...dialogData, open: false, loading: false })
                        }
                    } else {
                        console.alert(`${res.data} => ${res.data.result}`)
                    }
                }).catch((err) => {
                    alert(err)
                })
            }).catch((err) => {
                if (err.response && err.response.status && err.response.status === 401) {
                    alert('Invalid Credentials')
                    setDialogData({ ...dialogData, loading: false })
                    return;
                }
                alert(err)
                setDialogData({ ...dialogData, loading: false })
                return;
            })
    }

    const handleClose = () => {
        if (dialogData.username === '' || dialogData.password === '' || dialogData.datapower === '') {
            alert('Please enter all the fields')
        } else {
            setDialogData({ ...dialogData, loading: true })
            setCredentials({ username: dialogData.username, password: dialogData.password, datapower: dialogData.datapower })
            handleLogin(dialogData)
            return;
        }
    };
    useEffect(() => {
        if (auth === false&&credentials.datapower !== ''&&credentials.username !== ''&&credentials.password !== '') {
            handleLogin(credentials)
        }
    },[])

    return (
        <div>
            <Dialog open={dialogData.open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        type="username"
                        fullWidth
                        value={dialogData.username}
                        variant="standard"
                        onChange={(e) => {
                            setDialogData({ ...dialogData, username: e.target.value })
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        value={dialogData.password}
                        onChange={(e) => {
                            setDialogData({ ...dialogData, password: e.target.value })
                        }}
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="datapower"
                        label="Datapower IP : Port"
                        fullWidth
                        value={dialogData.datapower}
                        onChange={(e) => {
                            setDialogData({ ...dialogData, datapower: e.target.value })
                        }}
                        type="text"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    {!dialogData.loading ? <Button onClick={handleClose}>Login</Button> : <CircularProgress />}
                </DialogActions>
            </Dialog>
        </div>
    );
}