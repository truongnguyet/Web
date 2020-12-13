import React, {useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    TextField, Switch, Button, Typography
} from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";
import {Delete, AddCircle} from '@material-ui/icons'


const useStyles = makeStyles(theme => ({
    inputText: {
        width: '80%',
        margin: "auto",
        marginBottom: '15px'
    }
}))

function DialogAddField({open, setOpen, type}) {
    const classes = useStyles();
    const [checked, setChecked] = useState(true)
    const handleChange = (event) => {
        setChecked(event.target.checked);
    }
    const handleClose = () => {
        setOpen(false)
    }
    const listOption = [
        {
            label: 'Lựa chọn 1',
        },
        {
            label: 'Lựa chọn 2',
        },
        {
            label: 'Lựa chọn 3',
        }
    ]
    const deleteOption = (index) => {
        listOption.splice(index,1)
    }
    const addOption = (index) => {
        console.log(listOption.length)
        listOption.push({
            label: `Lựa chọn ${listOption.length + 1}`,
        })
        console.log(listOption);
    }
    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>Thêm thông tin về trường {type}</DialogTitle>
                <DialogContent>
                    <div>
                        <TextField id="outlined-basic" label="Tên trường" variant="outlined"
                                   className={classes.inputText}/>
                        <TextField id="outlined" label="Mô tả" variant="outlined" className={classes.inputText}/>
                        {
                            type === 'checkBox' ?
                                <div>
                                    <Typography variant='subtitle1'>Các lựa chọn</Typography>
                                    {/*<Button onClick={addOption(1)}>*/}
                                    {/*    <AddCircle/>*/}
                                    {/*</Button>*/}
                                    {listOption.map((item, index) => {
                                        return (
                                            <div>
                                                <TextField label={item.label} variant="outlined"
                                                           className={classes.inputText}/>
                                                {/*<Delete onClick={deleteOption(index)}/>*/}
                                            </div>
                                        )
                                    })}
                                </div>
                                :
                                <div>

                                </div>
                        }
                        <p>Trường này có bắt buộc?</p>
                        <Switch
                            checked={checked}
                            onChange={handleChange}
                            name="checkedA"
                            inputProps={{'aria-label': 'secondary checkbox'}}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color='secondary' variant='outlined' onClick={handleClose}>Hủy</Button>
                    <Button color='primary' variant='outlined'>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DialogAddField;
