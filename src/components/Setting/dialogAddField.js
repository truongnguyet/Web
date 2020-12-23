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
import {useGlobal} from "reactn";


const useStyles = makeStyles(theme => ({
    inputText: {
        width: '80%',
        margin: "auto",
        marginBottom: '15px'
    }
}))
const listOptionDefault = [
    {
        label: 'Lựa chọn 1',
        value: ''
    },
    {
        label: 'Lựa chọn 2',
        value: ''
    },
    {
        label: 'Lựa chọn 3',
        value: ''
    }
]
const array = ["checkBox", "radio", "dropDown"]

function DialogAddField({open, setOpen, type}) {
    const classes = useStyles();

    const [listOption, setListOption] = useState([...listOptionDefault])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [require, setRequire] = useState(true)
    const [options, setOptions] = useState([])
    const [addedFields, setAddedField] = useGlobal("addedFields")
    const handleChange = (event) => {
        setRequire(event.target.checked);
    }
    const handleClose = () => {
        setAddedField([])
        setOpen(false)
    }

    const deleteOption = (index) => {
        if (listOption.length === 1)
            return null
        listOption.splice(index, 1)
        setListOption([...listOption])
    }
    const addOption = (index) => {
        listOption.push({
            label: `Lựa chọn ${listOption.length + 1}`,
            value: ''
        })
        setListOption([...listOption])

    }
    const onAddField = () => {
        if (!name)
            return
        addedFields.push({
            type,
            name,
            description,
            require,
            options: listOption.map(op => (op.value || ""))
        })
        setAddedField([...addedFields])
        setName('')
        setDescription('')
        setRequire(true)
        setOpen(false)
        setListOption(listOptionDefault)
    }
    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>Thêm thông tin về trường {type}</DialogTitle>
                <DialogContent>
                    <div>
                        <TextField id="outlined-basic" label="Tên trường" variant="outlined"
                                   value={name}
                                   onChange={e => setName(e.target.value)}
                                   className={classes.inputText}/>
                        <TextField id="outlined" label="Mô tả" variant="outlined" className={classes.inputText}
                                   value={description}
                                   onChange={e => setDescription(e.target.value)}
                        />
                        {
                            array.includes(type) ?
                                <div>
                                    <Typography variant='subtitle1'>Các lựa chọn</Typography>
                                    <Button onClick={() => addOption(1)}>
                                        <AddCircle/>
                                    </Button>
                                    {listOption.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <TextField label={item.label} variant="outlined"
                                                           className={classes.inputText}
                                                           value={item.value} onChange={e => {
                                                    listOption[index].value = e.target.value
                                                    setListOption([...listOption])
                                                }
                                                }/>
                                                <Delete onClick={() => deleteOption(index)}/>
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
                            checked={require}
                            onChange={handleChange}
                            name="checkedA"
                            inputProps={{'aria-label': 'secondary checkbox'}}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color='secondary' variant='outlined' onClick={handleClose}>Hủy</Button>
                    <Button color='primary' variant='outlined' onClick={onAddField}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DialogAddField;
