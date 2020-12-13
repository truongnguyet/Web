import React, {useState} from 'react';
import {AppBar, Tab, Tabs, Typography, Box, TextField, Button} from "@material-ui/core";
import MenuAppBar from "../Home/menu";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import SwipeableViews from "react-swipeable-views";
import AddField from "./AddField";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}


const useStyles = makeStyles(theme => ({
    root: {
        padding: '100px 40px 0px 40px',
        backgroundColor: theme.palette.background.paper,
        width: 'calc(100vw - 222px)',
        float: 'right',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
            padding: '85px 0px 0px 0px',
        },
        [theme.breakpoints.up('md')]: {
            paddingTop: 2
        },
    },
    body: {
        margin: 'auto',
        maxWidth: '1200px'
    },
    appBar: {
        backgroundImage: 'linear-gradient(to right, #D4145A , #FBB03B)',
    },
    labelColor: {
        color: 'white'
    },
    formText: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    inputContainer:{
        width:"90%",
        margin:'auto'
    },
    input:{
        marginBottom:"20px"
    }
}));

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


function CreatePhase(props) {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };
    const phases = [
        {
            label: "Giai đoạn 1",

        },
        {
            label: "Giai đoạn 2",

        },
        {
            label: "Giai đoạn 3",

        },
    ]
    return (
        <div>
            <MenuAppBar>
                <div className={classes.root}>
                    <AppBar className={classes.appBar} position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="fullWidth"
                        >
                            {
                                phases.map((phase, index) => {
                                    return (
                                        <Tab className={classes.labelColor} label={phase.label} {...a11yProps(index)} />
                                    )
                                })
                            }

                        </Tabs>
                    </AppBar>
                    <div>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            {phases.map((phase, index) => {
                                return (
                                    <TabPanel value={value} index={index} dir={theme.direction}
                                              className={classes.body}>
                                        <p>{phase.label}</p>
                                        <div>
                                            <h3>Cài đặt</h3>
                                            <form className={classes.formText} noValidate autoComplete="off">
                                                <div className={classes.inputContainer}>
                                                    <TextField id="outlined-basic" label="Tên giai đoạn"
                                                               variant="outlined"
                                                               fullWidth={true}
                                                               className={classes.input}
                                                    />
                                                    <TextField id="outlined" label="Mô tả" variant="outlined" multiline
                                                               rows={3} fullWidth={true}
                                                               className={classes.input}
                                                    />
                                                </div>
                                            </form>
                                            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                                                Thêm trường
                                            </Button>
                                            <AddField open={open} setOpen={setOpen}/>
                                        </div>
                                    </TabPanel>
                                )
                            })}

                        </SwipeableViews>
                    </div>
                </div>
            </MenuAppBar>
        </div>
    );
}

export default CreatePhase;
