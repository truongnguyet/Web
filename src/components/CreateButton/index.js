import React, {useState} from 'react';
import {Fab, Dialog,DialogContent, DialogTitle, DialogActions, Button, TextField} from '@material-ui/core'
import {Add} from '@material-ui/icons'
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {firestore} from "../../firebaseConfig";
import {useGlobal} from 'reactn'
import moment from 'moment'
import {toast} from "react-toastify";

function IconInput(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name,setName] = useState('')
    const [user] = useGlobal('user')
    const history = useHistory()
    const handleClose = () => {
        setOpen(false)
        setName('')
    }
    const onAddProcess = async () => {
        setLoading(true)
        try{
            if(!name){
                return
            }
            const id = uuidv4()
            const processRef = firestore.doc(`process/${id}`)
            const time = moment().format('YYYY-MM-DD')
            const data = {
                id,
                status:"active", name,
                createdBy:user.uid,
                createdAt: time,
                modifiedBy: null,
                modifiedAt: null,
                authName:user.displayName
            }
            await processRef.set(
                data
            )
            toast.success('Thêm thành công')
            history.push("/setting?id=" +id)
        }catch (e){
            console.log(e);
            toast.error(` Lỗi ${e}`)
        }finally {
            setLoading(false)
            handleClose()
        }

    }
    const onEnter = async (e) => {
       if( e.key === 'Enter') {
          await onAddProcess();
       }
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
                        value={name}
                        onChange={e=>setName(e.target.value)}
                        id="nameProcess"
                        label="Tên quy trình"
                        type="text"
                        autoComplete="true"
                        variant="filled"
                        onKeyDown={onEnter}
                        autoFocus={true}
                    />
                </DialogContent>

                <DialogActions>
                    <Button disabled={loading} color={"primary"} onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button disabled={loading || !name} color={"primary"} onClick={onAddProcess}>
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
