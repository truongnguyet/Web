import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    MenuItem,
    Menu
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {isRoute, menuItems} from "./constants";
import { useHistory } from 'react-router-dom'
import {auth} from "../../firebaseConfig";
import {useGlobal} from 'reactn'
const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition:"all 0.3s"
    },
    appbarClose:{
        width: '100%',
        marginLeft: 56,
        zIndex:9999,
        transition:"all 0.3s"
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        transition:"all 0.3s"
    },
    drawClose:{
        width: 56,
        flexShrink: 0,
        transition:"all 0.3s"
    },
    drawerPaper: {
        width: drawerWidth,
        transition:"all 0.3s"
    },
    drawerPaperClose:{
        width:56,
        transition:"all 0.3s"
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(3)
    },
    profile:{
        position:"absolute",
        right:20
    },
    menuItems:{
        position:"relative"
    },
    menuName:{
        whiteSpace:"nowrap"
    }
}));


export default function MenuAppBar({children}) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [openMenu, setOpenMenu] = useState(true)
    const history = useHistory()
    const [user] = useGlobal();

    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const onSignOut = () => {
        auth.signOut();
    }



    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={openMenu ? classes.appBar : classes.appbarClose}>
                <Toolbar className={classes.menuItems}>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                                onClick={()=>setOpenMenu(!openMenu)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6">
                        Quản lý quy trình
                    </Typography>

                    <div className={classes.profile}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Tài khoản của tôi</MenuItem>
                            <MenuItem onClick={onSignOut}>Đăng xuất</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                className={openMenu ? classes.drawer : classes.drawClose}
                variant="permanent"
                classes={{
                    paper: openMenu? classes.drawerPaper : classes.drawerPaperClose
                }}
                anchor="left"
            >
                <div className={classes.toolbar}/>
                <Divider/>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem button key={index} onClick={()=>{
                                history.push(item.route)
                        }} style={{ background: isRoute(item.route) ? "rgba(3, 244, 222)" : ""}}>
                            <ListItemIcon>
                                { isRoute(item.route) ? item.iconActive :item.iconName}
                            </ListItemIcon>
                            <ListItemText primary={item.name} className={classes.menuName} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar}/>
                {children}
            </main>
        </div>
    );
}
