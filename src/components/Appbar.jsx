import React, { useState } from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import BalanceIcon from '@mui/icons-material/Balance';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MailIcon from '@mui/icons-material/Mail';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import { Box, Toolbar, List, CssBaseline, Typography, InputBase, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Select, IconButton, MenuItem, Button } from '@mui/material';
import InstallCard from './InstallCard.jsx';
import axios from 'axios';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const request = (url, method, data, headers) => {
    return axios({
        method,
        url,
        data,
        headers
    })
}

export default function Appbar(props) {
    const { setAuth, auth, credentials, domains, setDomains } = props;
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [installed, setInstalled] = React.useState('false');
    const [prod, setProd] = useState(false)
    const [selectedPage, setSelectedPage] = useState(0);
    const menuId = 'primary-search-account-menu';

    const switchPage = (page) => {
        switch (page) {
            case 0:
                return <InstallCard installed={installed} setInstalled={setInstalled} credentials={credentials} domain={domains.selected} prod={prod} setProd={setProd} setAuth={setAuth} />
            case 1:
                return <React.Fragment />
            case 2:
                return <React.Fragment />
            case 3:
                return <React.Fragment />
            case 4:
                return <React.Fragment />
            case 5:
                return <React.Fragment />
            case 6:
                return <React.Fragment />
            case 7:
                return <React.Fragment />
        }
    }

    const handlePageChange = (page) => {
        setSelectedPage(page);
    }

    const handleRemoveAll = async () => {
        let list = []
        let domain = prod ? '_Production' : '_Test'
        list.push(request(`http://${credentials.datapower}/Tools/rest-cors/mgmt/config/default/Domain/${domain}`, 'delete', null, { 'Authorization': `Basic ${btoa(`${credentials.username}:${credentials.password}`)}` }))
        Promise.all(list);
        console.log('all deleted.')
        setInstalled('false');
        setAuth(false);
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Button size='large' variant='h1' noWrap component="div" onClick={()=>{handlePageChange(0)}}>
                        Datapower API Automation
                    </Button>
                    <IconButton onClick={handleRemoveAll}>
                        <DeleteForeverIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Select
                        sx={{
                            height: "40px",
                            width: "150px",
                        }}
                        defaultValue={domains.selected}
                        value={domains.selected}
                        label="Domain"
                        onChange={(e) => {
                            setDomains({ ...domains, selected: e.target.value });
                            //WTF
                        }}
                    >
                        {domains.list.map((domain) => (
                            <MenuItem key={domain} value={domain}>
                                {domain}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={() => { console.log(domains) }}
                            color="inherit"
                        >
                            {auth === true ? <AccountCircle sx={{ color: 'green' }} /> : <AccountCircle sx={{ color: 'red' }} />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {["Settings", "Troubleshoot", "Load-Balancers"].map((text, index) => (
                        <ListItemButton
                            key={text}
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? "initial" : "center",
                                px: 2.5,
                            }}
                            onClick={() => 
                                text === "Settings"
                                    ? null
                                    : text === "Troubleshoot"
                                        ? null
                                        : text === "Load-Balancers"
                                            ? handlePageChange(7)
                                            : null
                            }
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                }}
                            >
                                {text === "Settings" ? (
                                    null
                                ) : text === "Troubleshoot" ? (
                                    null
                                ) : text === "Load-Balancer" ? (
                                    <BalanceIcon />
                                ) : (
                                    <DisabledByDefaultRoundedIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 10, display: 'flex', justifyContent: 'center' }}>
                <DrawerHeader />
                {switchPage(selectedPage)}
            </Box>
        </Box>
    );
}