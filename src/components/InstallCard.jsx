import React, { useState } from 'react'
import { Paper, Box, IconButton,Button} from '@mui/material'
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
    const { installed, credentials,domain,prod,setProd,setAuth} = props
    const [loading, setLoading] = useState(false)
    const handleInstall = async () => {
        let tasks = []
        setLoading(true)
        let domainCreationBody = { "Domain": { "name": "_Test", "_links": { "self": { "href": "/mgmt/config/default/Domain/_Test" }, "doc": { "href": "/mgmt/docs/config/Domain" } }, "mAdminState": "enabled", "ConfigDir": "config:///", "NeighborDomain": { "value": "default", "href": "/mgmt/config/default/Domain/default" }, "FileMap": { "CopyFrom": "on", "CopyTo": "on", "Delete": "on", "Display": "on", "Exec": "on", "Subdir": "on" }, "MonitoringMap": { "Audit": "off", "Log": "off" }, "ConfigMode": "local", "ImportFormat": "ZIP", "LocalIPRewrite": "on", "MaxChkpoints": 3, "ConfigPermissionsMode": "scope-domain" } }
        let loopbackLBGBody = { "LoadBalancerGroup": { "name": "-Loopback-", "mAdminState": "enabled", "Algorithm": "round-robin", "Damp": 120, "NeverReturnSickMember": "off", "LBGroupMembers": { "Server": "127.0.0.1", "Weight": 1, "MappedPort": 0, "Activity": "", "HealthPort": "", "LBMemberState": "enabled" }, "TryEveryServerBeforeFailing": "off", "LBGroupChecks": { "Active": "off", "URI": "/", "Port": 80, "SSL": "Standard", "Post": "on", "Input": "store:///healthcheck.xml", "Timeout": 10, "Frequency": 180, "XPath": "/", "Filter": "store:///healthcheck.xsl", "SSLProxyProfile": "", "EnforceTimeout": "off", "IndependentChecks": "off", "GatewayScriptChecks": "off", "GatewayScriptReqMethod": "GET", "GatewayScriptCustomReqMethod": "", "GatewayScriptReqDoc": "store:///healthcheck.json", "GatewayScriptReqContentType": "application/json", "GatewayScriptRspHandlerMetadata": "", "GatewayScriptRspHandler": "store:///healthcheck.js", "TCPConnectionType": "Full", "SSLClientConfigType": "proxy", "SSLClient": "" }, "MasqueradeMember": "off" } }
        if(prod){
            domainCreationBody.Domain.name = "_Production"
        }
        request(`http://${credentials.datapower}/Tools/rest-cors/mgmt/config/default/Domain`, 'post',domainCreationBody , { 'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}` }).then((res) => {
            // tasks.push(request(`http://${credentials.datapower}/Tools/rest-cors/mgmt/config/${domainCreationBody.Domain.name}/LoadBalancerGroup`,'post',loopbackLBGBody,{ 'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}` }))
            Promise.all(tasks).then(() => {
                console.log("Done")
            }).catch((err) => {
                console.log(err)
            })
        })
        setTimeout(() => { setLoading(false);setAuth(false)}, 3000)
    }
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', '& > :not(style)': { m: 1, width: 300, height: 150, }, }} >
                {installed === 'false' ?
                <Box>
                    <Paper sx={{ display: "flex",flexDirection:"column", justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                    <Button variant='contained' sx={{mt:3}} onClick={()=>{
                        setProd(!prod)
                    }}>
                        {prod ? "Production" : "Test"}
                    </Button>
                        {!loading ? <IconButton sx={{ display: "flex", flexDirection: "column",mb:2 }} onClick={handleInstall}>
                            <UploadIcon></UploadIcon>
                            Install
                        </IconButton> : <CircularProgress />}
                    </Paper>
                    </Box>
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