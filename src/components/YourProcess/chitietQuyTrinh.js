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
    AppBar
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {firestore} from "../../firebaseConfig";
import {Loader, LoadingOverlay} from "react-overlay-loader";


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
    const [loading, setLoading] = useState(false)
    const [listPhase, setListPhase] = useState([])
    const [value, setValue] = React.useState(0);

    const handleClose = () => {
        setOpen(false)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const getData = () => {
        setLoading(true)
        return firestore.collection(`processing/${idPro}/phasing`)
            .onSnapshot(function (querySnap) {
                const list = querySnap.docs.map(function (doc, index) {
                    return {...doc.data(), id: doc.id, index}
                });
                setListPhase(list)
                console.log('list phasing', list);
                setLoading(false)
            });
    }
    useEffect(() => {
        if (!idPro) return;
        let unsub = getData()
        return () => {
            if (unsub) unsub()
        }
    }, [idPro])
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
                                        {
                                            listPhase?.map((phase, index) => {
                                                return (
                                                    (
                                                        <div key={index}>
                                                            {/*<AppBar position="static">*/}
                                                            <Tabs value={value} onChange={handleChange}
                                                                  aria-label="simple tabs example">
                                                                <Tab label={phase.namePhase} {...a11yProps(index)} />
                                                            </Tabs>
                                                            {/*</AppBar>*/}
                                                            <TabPanel value={value} index={index}>
                                                                Item {index}
                                                                <div>

                                                                </div>
                                                            </TabPanel>
                                                        </div>
                                                    )
                                                )
                                            })
                                        }
                                    </div>

                                    :
                                    <span>Không có dữ liệu</span>
                            }

                        </div>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary" variant="contained">Thoát</Button>
                        <Button color={"primary"} variant="contained">Hủy quy trình</Button>
                    </DialogActions>
                </Dialog>
            </LoadingOverlay>

        </div>
    );
}

export default ChitietQuyTrinh;
