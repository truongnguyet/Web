import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Tab,
    Tabs,
} from "@material-ui/core";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {firestore} from "../../firebaseConfig";
import {Loader, LoadingOverlay} from "react-overlay-loader";
import SwipeableViews from "react-swipeable-views";
import FieldValue from "./fieldValue";
import {toast} from "react-toastify";


const useStyles = makeStyles((theme) => ({
    root: {
        width: 600,
        height: "80vh",
        margin: "auto"
    }
}))

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function ChitietQuyTrinh({open, setOpen, idPro}) {
    const classes = useStyles()
    const theme = useTheme();
    const [loading, setLoading] = useState(false)
    const [listPhase, setListPhase] = useState([])
    const [value, setValue] = React.useState(0);
    const [openDialog, setOpenDialog] = useState(false)
    const [process, setProcess] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleChangeIndex = index => {
        setValue(index);
    };
    const getData = () => {
        setLoading(true)
        return firestore.collection(`processing/${idPro}/phasing`)
            .onSnapshot(function (querySnap) {
                const list = querySnap.docs.map(function (doc, index) {
                    return {...doc.data(), id: doc.id, index}
                });
                setListPhase(list)
                setLoading(false)
            });
    }
    const cancelProcess = async () => {
        try {
            setLoading(true)
            await firestore.collection(`processing`)
                .doc(idPro)
                .set({
                    status: "cancel",
                    nextUser: "",
                }, {merge: true})

            toast.success("Bạn đã hủy quy trình này!")
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
            setOpenDialog(false)
            setOpen(false)
        }
    }
    useEffect(() => {
        if (!idPro) return;
        let unsub = getData()
        getProcess()
        return () => {
            if (unsub) unsub()
        }
    }, [idPro])
    const handleHuy = () => {
        setOpenDialog(true)
    }
    const getProcess = async () => {
        try {
            setLoading(true)
            await firestore.doc(`processing/${idPro}`)
                .get()
                .then(function (snap) {
                    if (!snap.exists)
                        return
                    setProcess(snap.data());
                });
        } catch (e) {

        } finally {
            setLoading(false)
        }

    }
    return (
        <div>
            <LoadingOverlay>
                <Loader loading={loading} text={""}/>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Xem chi tiết quy trình của bạn</DialogTitle>
                    <DialogContent>
                        <div className={classes.root}>
                            {
                                listPhase && listPhase.length ?
                                    <div>
                                        <Tabs value={value} onChange={handleChange}
                                              aria-label="simple tabs example">
                                            {
                                                listPhase?.map((phase, index) => {
                                                    return (
                                                        (
                                                            <Tab label={phase.namePhase} {...a11yProps(index)}
                                                                 key={index}/>
                                                        )
                                                    )
                                                })
                                            }
                                        </Tabs>
                                        <div>
                                            <SwipeableViews
                                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                                index={value}
                                                onChangeIndex={handleChangeIndex}
                                            >
                                                {
                                                    listPhase && listPhase.length > 0 && listPhase.map((phase, index) => {
                                                        return (
                                                            <TabPanel key={index} value={value} index={index}
                                                                      dir={theme.direction}
                                                                      className={classes.body}>
                                                                <p>{phase.label}</p>
                                                                <FieldValue arrayField={phase.fields}/>
                                                            </TabPanel>
                                                        )
                                                    })}

                                            </SwipeableViews>
                                        </div>
                                    </div>

                                    :
                                    <span>Không có dữ liệu</span>
                            }

                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary" variant="contained">Thoát</Button>
                        {
                            process?.status !== "cancel" ?
                                <Button color={"primary"} variant="contained"
                                        disabled={listPhase.length === 3 || loading}
                                        onClick={handleHuy}
                                >Hủy quy trình</Button>
                                :
                                null
                        }

                    </DialogActions>
                </Dialog>
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle> Xác nhận hủy quy trình</DialogTitle>
                    <DialogContent>Bạn có chắc chắn hủy quy trình này?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} disabled={loading} variant="contained"
                                color="secondary">
                            Hủy
                        </Button>
                        <Button disabled={loading} variant="contained" color="primary"
                                onClick={cancelProcess}
                        >
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
            </LoadingOverlay>

        </div>
    );
}

export default ChitietQuyTrinh;
