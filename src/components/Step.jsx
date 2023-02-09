import React, { useState } from 'react'
import { Paper, Box, IconButton } from '@mui/material'
import UploadIcon from '@mui/icons-material/Upload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios'
const request = (url, method, data, headers) => {
    return axios({
        method,
        url,
        data,
        headers
    })
}

function Step(props) {
    const { installed, credentials } = props
    const [loading, setLoading] = useState(false)
    const handleInstall = async () => {
        let tasks = []
        setLoading(true)
        tasks.push(request(`http://${credentials.datapower}/Tools/rest-cors/mgmt/config/default/Domain`, 'post', { "Domain": { "name": "_Test", "_links": { "self": { "href": "/mgmt/config/default/Domain/_Test" }, "doc": { "href": "/mgmt/docs/config/Domain" } }, "mAdminState": "enabled", "ConfigDir": "config:///", "NeighborDomain": { "value": "default", "href": "/mgmt/config/default/Domain/default" }, "FileMap": { "CopyFrom": "on", "CopyTo": "on", "Delete": "on", "Display": "on", "Exec": "on", "Subdir": "on" }, "MonitoringMap": { "Audit": "off", "Log": "off" }, "ConfigMode": "local", "ImportFormat": "ZIP", "LocalIPRewrite": "on", "MaxChkpoints": 3, "ConfigPermissionsMode": "scope-domain" } }, { 'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}` }))
        Promise.all(tasks).then(() => {
            console.log("Done")
        }).catch((err) => {
            console.log(err)
        })
        setTimeout(() => { setLoading(false) }, 3000)
    }
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', '& > :not(style)': { m: 1, width: 300, height: 150, }, }} >
                {installed === 'false' ?
                    <Paper sx={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                        {!loading ? <IconButton sx={{ display: "flex", flexDirection: "column", }} onClick={handleInstall}>
                            <UploadIcon></UploadIcon>
                            Install
                        </IconButton> : <CircularProgress />}
                    </Paper>
                    : installed === 'true' ?
                        <Paper sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                            <IconButton sx={{ display: "flex", flexDirection: "column", }}>
                                <CheckCircleOutlineIcon sx={{ color: 'orange' }}></CheckCircleOutlineIcon>
                                Validate
                            </IconButton>
                        </Paper> : <Paper sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                            <IconButton sx={{ display: "flex", flexDirection: "column", }}>
                                <CheckCircleOutlineIcon></CheckCircleOutlineIcon>
                                Done
                            </IconButton>
                        </Paper>}
            </Box>
        </React.Fragment >
    )
}

export default Step