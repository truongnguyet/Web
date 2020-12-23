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
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    buttonAction: {
        textAlign: "right",
        marginTop: 20,
    }

}));

function ActionField({arrayField, user, setArrayField}) {
    const classes = useStyles();
    const history = useHistory()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userAssign, setUserAssign] = useState([])
    const [values, setValues] = useState([...arrayField])

    // console.log('mang filed', user);
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
                                        value={moment(values[index]?.value || null).format('YYYY-MM-DD HH:mm')}
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
                                        // defaultValue={moment().format('HH:mm')}
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
                                    {/*<FormControl className={classes.formControl}>*/}
                                    {/*    <InputLabel id="demo-simple-select-label">Age</InputLabel>*/}
                                    {/*    <Select*/}
                                    {/*        // labelId="demo-simple-select-label"*/}
                                    {/*        // id="demo-simple-select"*/}
                                    {/*        // value={age}*/}
                                    {/*        // onChange={handleChange}*/}
                                    {/*    >*/}
                                    {/*        {*/}
                                    {/*            field?.options.map((a, index) => {*/}
                                    {/*                console.log(a);*/}
                                    {/*                return (*/}
                                    {/*                    <MenuItem value={10} key={index}>{a}</MenuItem>*/}
                                    {/*                )*/}
                                    {/*            })*/}
                                    {/*        }*/}
                                    {/*    </Select>*/}
                                    {/*</FormControl>*/}
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
                    <div>
                        <Typography>Thêm người vào quy trình</Typography>
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
                            onClick={() => {
                                console.log({values})
                            }}
                    >
                        Gửi
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
}

export default ActionField;
