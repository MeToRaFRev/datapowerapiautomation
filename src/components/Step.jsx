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
    const { install, credentials, setDomains } = props
    const [loading, setLoading] = useState(false)
    const handleInstall = () => {
        setLoading(true)
        const response = request(`http://${credentials.datapower}/Tools/rest-cors/mgmt/domains/config/`)
        response.then((res) => {
            if (res.data.domain) {
                if (!Array.isArray(res.data.domain)) {
                    alert(`Looks like you have only one domain. Please import the initial package that come's with the install and try again`)
                }
                else {
                    let domains = []
                    Object.keys(res.data.domain).forEach((key) => {
                        domains.push(res.data.domain[key].name);
                    });
                    setDomains(domains)
                }
            } else {
                console.alert(`${res.data} => ${res.data.result}`)
            }
        }).catch((err) => {
            console.error(err)
        })
        setTimeout(() => { setLoading(false) }, 3000)
    }
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', '& > :not(style)': { m: 1, width: 300, height: 150, }, }} >
                {install === false ?
                    <Paper sx={{ display: "flex", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                        {!loading ? <IconButton sx={{ display: "flex", flexDirection: "column", }} onClick={handleInstall}>
                            <UploadIcon></UploadIcon>
                            Install
                        </IconButton> : <CircularProgress />}
                    </Paper>
                    :
                    <Paper sx={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
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