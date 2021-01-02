import React, {useEffect, useState} from 'react';
import {
    AppBar,
    Tab,
    Tabs,
    Typography,
    Box,
    TextField,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions, Dialog
} from "@material-ui/core";
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
import Select from 'react-select';
import {LoadingOverlay, Loader} from 'react-overlay-loader';
import {ArrowBack, Close, Check} from '@material-ui/icons'


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
    },
    assignee: {
        marginLeft: 40,
        marginBottom: 20,
        width: "50%"
    },
    textAdd: {
        textAlign: "left",
        marginBottom: 10,
        color: "black",
    },
    btnBack: {
        float: "left",
        marginLeft: 40,
        marginBottom: 20,
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
    const query = qs.parse(window.location.search)
    const history = useHistory()
    const theme = useTheme();

    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [namePhase, setNamePhase] = useState('')
    const [desPhase, setDesPhase] = useState('')
    const [process, setProcess] = useState(null)
    const [phase, setPhase] = useState(phases)
    const [addedFields, setAddedFields] = useGlobal('addedFields')
    const [assignee, setAssignee] = useState([])
    const [userSelected, setUserSelected] = useState([])
    const [openPause, setOpenPause] = useState(false)
    const [disablePause, setDisablePause] = useState(false)

    useEffect(() => {
        if (query?.id) {
            // get info
            getInfo(query.id)
            getUser()
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
            // console.log('du lieu cua process', data);
            if (data && data.status !== "active") {
                setDisablePause(true)
            }
            const phaseSnap = await firestore.collection(`process/${id}/phases`)
                .orderBy('index')
                .get()
            const phase = phaseSnap.docs.map(doc => doc.data())
            if (phase.length < 3) {
                for (let i = phase.length; i < 3; i++) {
                    phase.push({
                        label: "Giai đoạn " + (i + 1),

                    })
                }
            }
            setPhase([...phase])
            setNamePhase(phase[value]?.namePhase || '')
            setDesPhase(phase[value]?.desPhase || '')
            setProcess({...data, id: processSnap.id})
            setUserSelected(phase[value]?.users || [])
            setAddedFields(phase[value]?.fields || [])
        } catch (e) {
            toast.error(`Lỗi, ${e}`)
        }
    }
    const getUser = async () => {
        try {
            const userSnap = await firestore.collection('users').get()
            const data = userSnap.docs.map(e => e.data())
            const array = []
            data.forEach(a => {
                array.push({
                    id: a.id,
                    email: a.email,
                    value: a.displayName,
                    label: a.displayName
                })
            })
            setAssignee(array)
        } catch (e) {
            toast.error(`Lỗi, ${e}`)
        }
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
        setNamePhase(phase[newValue]?.namePhase || '')
        setDesPhase(phase[newValue]?.desPhase || '')
        setAddedFields(phase[newValue]?.fields || [])
        setUserSelected(phase[newValue]?.users || [])
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
                fields: addedFields,
                users: userSelected,
            }

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
            setUserSelected([])
            if (index === phases.length - 1) {
                history.push('/')
            } else {
                handleChange(index, index + 1)
            }

        }
    }
    const onAddUser = (user) => {
        setUserSelected(user)
    }
    const gotoHome = () => {
        history.push('/')
    }
    const pauseProcess = async () => {
        let uid = query?.id;
        setLoading(true)
        try {
            if (uid) {
                await firestore.collection(`process`)
                    .doc(uid)
                    .set({
                        status: 'unactive'
                    }, {merge: true})
                setOpenPause(false)
                setLoading(false)
                setDisablePause(true)
                toast.success("Bạn đã tạm ngừng quy trình này!")
            }

        } catch (e) {
            console.log(e);
            setLoading(false)
            toast.error(`${e}`)
            setOpenPause(false)
        }
    }

    const playProcess = async () => {
        let uid = query?.id;
        setLoading(true)
        try {
            if (uid) {
                await firestore.collection(`process`)
                    .doc(uid)
                    .set({
                        status: 'active'
                    }, {merge: true})
                setOpenPause(false)
                setLoading(false)
                setDisablePause(false)
                toast.success("Bạn đã hoạt động lại quy trình này!")
            }

        } catch (e) {
            console.log(e);
            setLoading(false)
            toast.error(`${e}`)
            setOpenPause(false)
        }
    }
    const openDialogPause = () => {
        setOpenPause(true)
    }

    return (
        <div>
            <MenuAppBar>
                <Button variant="outlined" color={"secondary"} onClick={gotoHome} className={classes.btnBack}
                        disabled={loading}>
                    <ArrowBack/>
                    Quay lại</Button>
                <Button variant="outlined" color={"default"} onClick={openDialogPause} className={classes.btnBack}
                        disabled={loading}>
                    {disablePause ? <Check/> : <Close/>}
                    {disablePause ? "Hoạt động" : "Tạm ngừng"}
                </Button>
                <LoadingOverlay>
                    <Loader loading={loading} text={""}/>
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
                                                                   required={true}
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
                                                <RenderField arrayField={addedFields}/>
                                                <div className={classes.assignee}>
                                                    <Typography className={classes.textAdd}>Thêm người vào quy
                                                        trình</Typography>
                                                    <Select
                                                        isMulti
                                                        name="colors"
                                                        options={assignee}
                                                        className="basic-multi-select"
                                                        classNamePrefix="select"
                                                        onChange={onAddUser}
                                                        value={userSelected}
                                                    />
                                                </div>
                                                <Button onClick={() => onAddPhase(index)} variant="contained"
                                                        style={{float: "left", marginLeft: "30px"}}
                                                        color="secondary" disabled={loading || !namePhase}>Lưu</Button>
                                            </div>
                                        </TabPanel>
                                    )
                                })}

                            </SwipeableViews>
                        </div>
                    </div>
                </LoadingOverlay>

            </MenuAppBar>
            <Dialog open={openPause} onClose={() => setOpenPause(false)}>
                <DialogTitle>Tạm ngừng quy trình</DialogTitle>
                <DialogContent>
                    {
                        disablePause ? "Bạn có chắc chắn muốn hoạt động lại quy trình này?"
                            :
                            "Bạn có chắc chắn muốn dừng quy trình này?"
                    }

                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="secondary" onClick={() => setOpenPause(false)}>Hủy</Button>
                    {
                        disablePause ?
                            <Button variant="contained" color="primary" onClick={playProcess}>Đồng ý</Button>
                            :
                            <Button variant="contained" color="primary" onClick={pauseProcess}>Đồng ý</Button>
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreatePhase;
