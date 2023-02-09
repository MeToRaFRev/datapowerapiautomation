import * as React from 'react';
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
    const { setAuth, setCredentials, domains, setDomains } = props;
    const [dialogData, setDialogData] = React.useState({ open: true, username: '', password: '', datapower: '', loading: false })
    const handleClose = () => {
        if (dialogData.username === '' || dialogData.password === '' || dialogData.datapower === '') {
            alert('Please enter all the fields')
        } else {
            setDialogData({ ...dialogData, loading: true })
            const response = request(`http://${dialogData.datapower}/Tools/rest-cors/mgmt/config/default/APISecurityBasicAuth`, 'get', null, { 'Authorization': `Basic ${btoa(`${dialogData.username}:${dialogData.password}`)}` })
            response.then(() => {
                setAuth(true)
                setCredentials({ username: dialogData.username, password: dialogData.password, datapower: dialogData.datapower })
                const response = request(`http://${dialogData.datapower}/Tools/rest-cors/mgmt/domains/config/`, 'get', null, { 'Authorization': `Basic ${btoa(`${dialogData.username}:${dialogData.password}`)}` })
                response.then((res) => {
                    if (res.data.domain) {
                        if (!Array.isArray(res.data.domain)) {
                            alert(`Looks like you have only one domain. Please import the initial package that come's with the install and try again`)
                        }
                        else {
                            let pulledDomains = []
                            Object.keys(res.data.domain).forEach((key) => {
                                if (res.data.domain[key].name !== 'default' && res.data.domain[key].name !== '_Tools')
                                    pulledDomains.push(res.data.domain[key].name);
                                if (res.data.domain[key].name === '_Gateway') {
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
                return;
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
    };

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