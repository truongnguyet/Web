import React, {useEffect, useState} from 'react';
import {AppBar, Tab, Tabs, Typography, Box, TextField, Button} from "@material-ui/core";
import MenuAppBar from "../Home/menu";
import {makeStyles, useTheme} from '@material-ui/core/styles';
import SwipeableViews from "react-swipeable-views";
import AddField from "./AddField";
import RenderField from "./renderField";
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";
import {firestore} from "../../firebaseConfig";
import qs from 'query-string'
import {useGlobal} from "reactn";
import {useHistory} from "react-router-dom";
import _ from 'lodash'


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
    inputContainer: {
        width: "90%",
        margin: 'auto'
    },
    input: {
        marginBottom: "20px"
    }
}));

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

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

function CreatePhase(props) {
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [namePhase, setNamePhase] = useState('')
    const [desPhase, setDesPhase] = useState('')
    const [process, setProcess] = useState(null)
    const [phase, setPhase] = useState(phases)
    const [addedFields, setAddedFields] = useGlobal('addedFields')
    const query = qs.parse(window.location.search)
    const history = useHistory()

    useEffect(() => {
        if (query?.id) {
            // get info
            getInfo(query.id)
        }
    }, [query?.id])
    const getInfo = async (id) => {
        try {
            const processSnap = await firestore.doc(`process/${id}`)
                .get()
            if (!processSnap.exists) {
                history.push('/')
                return
            }

            const data = processSnap.data()
            // console.log(data);
            const phaseSnap = await firestore.collection(`process/${id}/phases`).get()
            const phase = phaseSnap.docs.map(doc => doc.data())
            if (phase.length < 3) {
                for (let i = phase.length; i < 3; i++) {
                    phase.push({
                        label: "Giai đoạn " + (i + 1),

                    })
                }
            }
            console.log(phase);
            setPhase([...phase])
            setNamePhase(phase[value]?.namePhase || '')
            setDesPhase(phase[value]?.desPhase || '')
            setProcess({...data, id: processSnap.id})
        } catch (e) {

        }
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setNamePhase(phase[newValue]?.namePhase || '')
        setDesPhase(phase[newValue]?.desPhase || '')
        setAddedFields(phase[newValue]?.fields || [])
    };

    const handleChangeIndex = index => {
        setValue(index);
        setNamePhase(phase[value]?.namePhase || '')
        setDesPhase(phase[value]?.desPhase || '')
    };

    const onAddPhase = async (index) => {
        setLoading(true);
        try {
            if (!namePhase) {
                toast.warn("Tên giai đoạn bắt buộc")
                return
            }
            if (!desPhase) {
                toast.warn('Mô tả bắt buộc')
                return
            }
            let id = uuidv4()
            if (phase[value]?.id) {
                id = phase[value]?.id
            }

            const phaseRef = firestore.doc(`process/${process.id}/phases/${id}`)
            const data = {
                id,
                namePhase,
                desPhase: desPhase || '',
                index,
                fields: _.concat(phase[value] && phase[value].fields && Array.isArray(phase[value].fields) ?
                    phase[value].fields : [], addedFields)
            }
            console.log(data);
            await phaseRef.set(
                data
            )
            toast.success('Thêm thành công')

        } catch (e) {
            console.log(e);
            toast.error(` Lỗi ${e}`)
        } finally {
            setLoading(false)
            setNamePhase('')
            setDesPhase('')
            setAddedFields([])
            if (index === phases.length - 1) {
                history.push('/')
            } else {
                handleChange(index, index + 1)
            }

        }
    }
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
                                phase.map((phase, index) => {
                                    return (
                                        <Tab key={index} className={classes.labelColor}
                                             label={phase.label || phase.namePhase} {...a11yProps(index)} />
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
                                    <TabPanel key={index} value={value} index={index} dir={theme.direction}
                                              className={classes.body}>
                                        <p>{phase.label}</p>
                                        <div key={index}>
                                            <h3>Cài đặt</h3>
                                            <form className={classes.formText} noValidate autoComplete="off">
                                                <div className={classes.inputContainer}>
                                                    <TextField id="outlined-basic" label="Tên giai đoạn"
                                                               variant="outlined"
                                                               fullWidth={true}
                                                               className={classes.input}
                                                               value={namePhase}
                                                               onChange={e => setNamePhase(e.target.value)}
                                                    />
                                                    <TextField id="outlined" label="Mô tả" variant="outlined"
                                                               multiline
                                                               rows={3} fullWidth={true}
                                                               className={classes.input}
                                                               value={desPhase}
                                                               onChange={e => setDesPhase(e.target.value)}
                                                    />
                                                </div>
                                            </form>
                                            <Button variant="contained" color="primary"
                                                    onClick={() => setOpen(true)}>
                                                Thêm trường
                                            </Button>
                                            <AddField open={open} setOpen={setOpen} phaseIndex={index}/>
                                            {
                                                phase[value] && phase[value].fields && Array.isArray(phase[value].fields) ?
                                                    <RenderField arrayField={phase[value].fields}/>
                                                    :
                                                    null
                                            }
                                            <RenderField arrayField={addedFields}/>
                                            <Button onClick={() => onAddPhase(index)} variant="contained"
                                                    color="secondary" disabled={loading}>Lưu</Button>
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
