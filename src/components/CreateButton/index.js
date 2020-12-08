import React, {useState} from 'react';
import {Fab, Dialog,DialogContent, DialogTitle, DialogActions, Button, TextField} from '@material-ui/core'
import {Add} from '@material-ui/icons'
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from 'react-router-dom'

function IconInput(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const handleClose = () => {
        setOpen(false)
    }
    const onAddProcess = () => {
        history.push("/setting")
    }
    return (
        <div>
            <Fab color="secondary" aria-label={"add"} className={classes.fab} onClick={() => setOpen(true)}>
                <Add/>
            </Fab>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}
                    className={classes.dialogContainer}
            >
                <DialogTitle id="simple-dialog-title">Tạo mới quy trình</DialogTitle>
                <DialogContent>
                    <TextField
                    id="nameProcess"
                    label="Tên quy trình"
                    type="text"
                    autoComplete="true"
                    variant="filled"
                    />
                </DialogContent>

                <DialogActions>
                    <Button disabled={loading} color={"primary"} onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button disabled={loading} color={"primary"} onClick={onAddProcess}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default IconInput;

const useStyles = makeStyles(theme => ({
    fab: {
        position: "fixed",
        bottom: theme.spacing(7),
        right: theme.spacing(7),
        backgroundColor: "#62ff1a",
        zIndex: 10000
    },
    dialogContainer:{
        padding:10
    }
}))
