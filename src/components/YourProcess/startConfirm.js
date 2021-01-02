import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography} from "@material-ui/core";
import {green} from '@material-ui/core/colors';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Cancel} from "@material-ui/icons";
import FieldValue from "./fieldValue";
import {firestore} from "../../firebaseConfig";
import ConfirmNext from "./confirmNext";
import {toast} from "react-toastify";
import {Loader, LoadingOverlay} from "react-overlay-loader";


const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    cancelButton: {
        float: "right",
        border: "none",
        backgroundColor: "#fff",
        color: '#f5007c',
        cursor: "pointer"
    },
    root: {
        height: '70vh',
        margin: "auto"
    },
    leftGrid: {
        backgroundColor: '#fff',
        color: "gray"
    }

}));

function StartConfirm({open, setOpen, process}) {
    const classes = useStyles()
    const [phaseValue, setPhaseValue] = useState([])
    const [loading, setLoading] = useState(false)
    const [phaseStep, setPhaseStep] = useState(0)
    const [nextPhase, setNextPhase] = useState({})
    const [phase3, setPhase3] = useState({})
    const [openCancel, setOpenCancel] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const theme = createMuiTheme({
        palette: {
            primary: green,
        },
    });
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpenCancel = () => {
        setOpenCancel(true)
    }
    const getPhaseValue = () => {
        setLoading(true)
        return firestore.collection(`processing/${process.id}/phasing`)
            .orderBy('step')
            .onSnapshot(function (querySnap) {
                const data = querySnap.docs.map(function (doc, index) {
                    return {...doc.data(), id: doc.id, index}
                });
                // console.log('index === ', data.length);
                setPhaseValue(data)
                setPhaseStep(data?.length)
                setLoading(false)
            });
    }
    const getNextPhase = async () => {
        setLoading(true)
        try {
            if (phaseStep > 0) {
                const phaseRef = await firestore.collection(`process/${process.idProcess}/phases`)
                    .orderBy('index')
                    .get()
                const phase = phaseRef.docs.map(doc => doc.data())
                // console.log('phase hiện tại', phase[phaseStep]);
                setNextPhase(phase[phaseStep])
                if (phaseStep <= 2) {
                    setPhase3(phase[phaseStep + 1])
                    // console.log('Phase so 3', phase[phaseStep + 1])
                }

            }

        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }

    }
    useEffect(() => {
        if (!process) return;
        getNextPhase()
    }, [process, phaseStep])
    useEffect(() => {
        if (!process) return;
        let unsub = getPhaseValue()
        return () => {
            if (unsub) unsub()
        }
    }, [process])

    const setField = (value = []) => {
        nextPhase.fields = value
        setNextPhase({...nextPhase})
    }
    const cancelProcess = async () => {
        let id = process?.id;
        try {
            await firestore.collection(`processing`)
                .doc(id)
                .set({
                    state: 0,
                    status: "reject"
                }, {merge: true})
            setOpenCancel(false)
            setOpen(false)
            toast.success("Bạn đã hủy quy trình này!")
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div>
            <LoadingOverlay>
                <Loader loading={loading} text={""}/>
                <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"lg"}>
                    <DialogTitle>Xác nhận quy trình
                        <Cancel className={classes.cancelButton} onClick={handleClose}/>
                    </DialogTitle>
                    <DialogContent>
                        <div className={classes.root}>
                            <Grid container>
                                <Grid item xs={6} className={classes.leftGrid}>
                                    <Typography style={{color: "black"}}>Thông tin quy trình</Typography>

                                    {
                                        phaseValue.length
                                            ? phaseValue.map((phase, index) => {
                                                return (
                                                    <div key={index}>
                                                        {
                                                            index !== 0 ? <Divider
                                                                style={{
                                                                    color: "black",
                                                                    fontWeight: "bold",
                                                                    height: "3px"
                                                                }}/> : null
                                                        }
                                                        <FieldValue arrayField={phase.fields}/>

                                                    </div>

                                                )
                                            })
                                            :
                                            <Typography>Loading....</Typography>
                                    }

                                </Grid>
                                <Grid item xs={6}>
                                    <Typography style={{color: "black"}}>Thông tin cần xử lý</Typography>
                                    {
                                        phase3 && nextPhase && nextPhase.fields && Array.isArray(nextPhase.fields) && phaseStep === 1 ?
                                            <ConfirmNext arrayField={nextPhase.fields}
                                                         setArrayField={setField}
                                                         openDialog={openDialog}
                                                         setOpenDialog={setOpenDialog}
                                                         user={phase3?.users}
                                                         process={process}
                                                         phase={nextPhase}
                                                         setOpen={setOpen}
                                            />
                                            :
                                            <div>
                                                {
                                                    nextPhase && nextPhase.fields && Array.isArray(nextPhase.fields) && phaseStep === 2 ?
                                                        <ConfirmNext arrayField={nextPhase.fields}
                                                                     setArrayField={setField}
                                                                     openDialog={openDialog}
                                                                     setOpenDialog={setOpenDialog}
                                                                     process={process}
                                                                     phase={nextPhase}
                                                                     setOpen={setOpen}
                                                        />
                                                        :
                                                        <Typography>Không có trường nào được tạo</Typography>
                                                }
                                            </div>


                                    }
                                </Grid>
                            </Grid>

                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" variant='contained' onClick={handleOpenCancel}>Hủy quy trình</Button>
                        <ThemeProvider theme={theme}>
                            <Button variant="contained" color="primary" className={classes.margin}
                                    onClick={() => setOpenDialog(true)}>
                                Xác nhận
                            </Button>
                        </ThemeProvider>
                    </DialogActions>
                </Dialog>
            </LoadingOverlay>
            <Dialog open={openCancel} onClose={() => setOpenCancel(false)}>
                <DialogTitle>Hủy quy trình</DialogTitle>
                <DialogContent>
                    Bạn có chắc chắn muốn đánh dấu quy trình này thất bại?
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" variant="contained" onClick={() => setOpenCancel(false)}>Hủy</Button>
                    <Button color="primary" variant="contained" onClick={cancelProcess}>Đồng ý</Button>
                </DialogActions>

            </Dialog>

        </div>
    );
}

export default StartConfirm;
