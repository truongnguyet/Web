import React, {useState} from 'react';
import moment from "moment";
import TextField from "@material-ui/core/TextField";
import {
    Button,
    Checkbox, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Radio,
    Typography
} from "@material-ui/core";
import Select from "react-select";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import {v4 as uuidv4} from "uuid";
import {firestore} from "../../firebaseConfig";
import {useGlobal} from 'reactn'

const useStyles = makeStyles(theme => ({
    container: {
        margin: 10,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    root: {
        padding: 10,
        textAlign: "start",
        marginLeft: 30,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    buttonAction: {
        textAlign: "right",
        marginTop: 20,
    },
    dialogAss: {
        height: 200,
        margin: "auto",
        width: 300
    }

}));

function ActionField({arrayField, user, setArrayField, phase, process}) {
    const classes = useStyles();
    const history = useHistory()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userAssign, setUserAssign] = useState([])
    const [values, setValues] = useState([...arrayField])
    const [authUser,] = useGlobal('user')

    const [age, setAge] = useState('');


    const handleChange = (event) => {
        setAge(event.target.value);
    };
    const handleCancel = () => {
        setArrayField([])
        history.push('/list')
        setUserAssign([])
        setValues([])
    }
    const onNext = () => {
        setOpen(true)
    }
    const selectUser = (user) => {
        setUserAssign(user)
    }
    const onAddData = async () => {
        setLoading(true)
        try {
            // check data có required hay không
            const batch = firestore.batch()
            let uid = 'process_' + uuidv4()
            const dataProcess = {
                createdAt: moment(new Date()).format('DD/MM/YYYY'),
                createdBy: authUser.displayName,
                idAuth: authUser.id,
                state: 1,
                id: uid,
                nextUser: userAssign.id,
                nameProcess: process.name,
                idProcess: process.id,
                currentPhase: phase.namePhase,
                status: "processing"
            }
            const data = {
                id: phase.id,
                namePhase: phase.namePhase,
                desPhase: phase.desPhase || '',
                step: phase.index,    ///phase thu may
                fields: values,
                users: phase.users,
            }

            const phasingRef = firestore.doc(`processing/${uid}/phasing/${phase.id}`)
            const processRef = firestore.doc(`processing/${uid}`)
            batch.set(processRef,
                dataProcess, {merge: true})
            batch.set(phasingRef,
                data
            , {merge: true})

            await batch.commit()
            toast.success('Gửi đi thành công')
        } catch (e) {
            setLoading(false)
            console.log(e);
            toast.error(`Lỗi `)
        } finally {
            setLoading(false)
            setOpen(false)
            history.push('/list')
        }
    }
    return (
        <div className={classes.root}>
            {
                arrayField?.length === 0 ? '( Chưa có trường nào được chọn ) ' :
                    arrayField.map((field, index) => {
                        if (!field.type)
                            return null
                        if (field.type === 'short')
                            return (
                                <div key={index} className={classes.container}>
                                    <TextField
                                        label={field.name} variant="outlined" helperText={field.description}
                                        value={values[index]?.value || ""}
                                        onChange={e => {
                                            values[index].value = e.target.value
                                            setValues([...values])
                                        }}
                                    />
                                </div>
                            )
                        if (field.type === 'long')
                            return (
                                <div key={index} className={classes.container}>
                                    <TextField
                                        label={field.name} variant="outlined" helperText={field.description}
                                        multiline rows={3}
                                        value={values[index]?.value || ""}
                                        onChange={e => {
                                            values[index].value = e.target.value
                                            setValues([...values])
                                        }}
                                    />
                                </div>
                            )
                        if (field.type === 'date')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span
                                        style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        id="date"
                                        label={field.description}
                                        type="date"
                                        defaultValue={moment().format('YYYY-MM-DD')}
                                        value={moment(values[index]?.value || null).format('YYYY-MM-DD')}
                                        onChange={e => {
                                            values[index].value = e.target.value
                                            setValues([...values])
                                        }}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                </div>
                            )
                        if (field.type === 'dateTime')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span
                                        style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        id="datetime-local"
                                        label={field.description}
                                        type="datetime-local"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        defaultValue={moment().format('YYYY-MM-DDTHH:mm')}
                                        value={moment(values[index]?.value || null).format('YYYY-MM-DDTHH:mm')}
                                        onChange={e => {
                                            values[index].value = e.target.value
                                            setValues([...values])
                                        }}
                                    />
                                </div>
                            )
                        if (field.type === 'checkBox')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span
                                        style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <Typography variant="caption">{field.description}</Typography>
                                    <FormGroup row>
                                        {
                                            field?.options.map((a, idx) => {
                                                return (
                                                    <FormControlLabel key={idx}
                                                                      control={
                                                                          <Checkbox
                                                                              name={a}
                                                                              checked={
                                                                                  values[index].optionsValue && Array.isArray(values[index].optionsValue)
                                                                                  && values[index].optionsValue[idx]
                                                                              }
                                                                              onChange={e => {
                                                                                  if (values[index].optionsValue && Array.isArray(values[index].optionsValue)) {
                                                                                      values[index].optionsValue[idx] = e.target.checked
                                                                                      setValues([...values])
                                                                                  } else {
                                                                                      values[index].optionsValue = new Array(field?.options.length).fill(false)
                                                                                      values[index].optionsValue[idx] = e.target.checked
                                                                                      setValues([...values])
                                                                                  }

                                                                              }}
                                                                          />}
                                                                      label={a}
                                                    />
                                                )
                                            })
                                        }
                                    </FormGroup>
                                </div>
                            )
                        if (field.type === 'time')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span
                                        style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        id="time"
                                        label={field.description}
                                        type="time"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={values[index]?.value || null}
                                        onChange={e => {
                                            values[index].value = e.target.value
                                            setValues([...values])
                                        }}
                                    />
                                </div>
                            )
                        if (field.type === 'attachment')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span
                                        style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        label={field.description}
                                        type="file"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            )
                        if (field.type === 'radio')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span
                                        style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <Typography variant="caption">{field.description}</Typography>
                                    <FormGroup row>

                                        {
                                            field?.options.map((a, idx) => {
                                                return (
                                                    <FormControlLabel
                                                        control={
                                                            <Radio value={a}
                                                                   checked={values[index].value === a}
                                                                   onChange={e => {
                                                                       values[index].value = e.target.value
                                                                       setValues([...values])
                                                                   }}/>}
                                                        label={a} key={idx}/>
                                                )
                                            })
                                        }

                                    </FormGroup>
                                </div>
                            )
                        if (field.type === 'dropDown')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}</Typography>
                                    <Typography variant="caption">{field.description}</Typography><br/>
                                    <FormControl className={classes.formControl}>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={age}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={10}>Ten</MenuItem>
                                            <MenuItem value={20}>Twenty</MenuItem>
                                            <MenuItem value={30}>Thirty</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            )

                        return null
                    })
            }
            <div className={classes.buttonAction}>
                <Button variant="outlined" color="secondary" onClick={handleCancel}>Hủy</Button>
                <Button variant="outlined" color="primary" style={{marginLeft: 10}} onClick={onNext}>Chuyển đi</Button>
            </div>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle> Chọn người để chuyển tiếp</DialogTitle>
                <DialogContent>
                    <div className={classes.dialogAss}>
                        <Typography>Bạn muốn gửi đến ai?</Typography>
                        <Select
                            name="colors"
                            options={user}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={selectUser}
                            value={userAssign}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={loading} variant="contained" color="secondary">
                        Hủy
                    </Button>
                    <Button disabled={loading} variant="contained" color="primary"
                            onClick={onAddData}
                    >
                        Gửi
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default ActionField;
