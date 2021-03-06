import React, {useState} from 'react';
import {useGlobal} from "reactn";
import TextField from "@material-ui/core/TextField";
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    Radio,
    Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";
import Select from "react-select";


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
    }

}));

function RenderField({arrayField}) {
    const classes = useStyles();
    const [defaultTime, setDefaultTime] = useState(moment(new Date()).format('DD/MM/YYYY HH:mm'))

    const [age, setAge] = useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    return (
        <div className={classes.root}>
            {
                arrayField.length === 0 ? '( Chưa có trường nào được chọn ) ' :
                    arrayField.map((field, index) => {
                        if (!field.type)
                            return null
                        if (field.type === 'short')
                            return (
                                <div key={index} className={classes.container}>
                                    <TextField
                                        label={field.name} variant="outlined" helperText={field.description}
                                    />
                                </div>
                            )
                        if (field.type === 'long')
                            return (
                                <div key={index} className={classes.container}>
                                    <TextField
                                        label={field.name} variant="outlined" helperText={field.description}
                                        multiline rows={3}
                                    />
                                </div>
                            )
                        if (field.type === 'date')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        label={field.description}
                                        type="date"
                                        defaultValue={moment().format('DD/MM/YYYY')}
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
                                    <Typography variant="subtitle1">{field.name}<span style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        label={field.description}
                                        type="datetime-local"
                                        defaultValue={defaultTime}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            )
                        if (field.type === 'checkBox')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <Typography variant="caption">{field.description}</Typography>
                                    <FormGroup row>
                                        {
                                            field?.options.map((a, index) => {
                                                return (
                                                    <FormControlLabel key={index}
                                                                      control={<Checkbox name={a}/>}
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
                                    <Typography variant="subtitle1">{field.name}<span style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        label={field.description}
                                        type="time"
                                        defaultValue={moment().format('HH:mm')}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                            )
                        if (field.type === 'attachment')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
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
                                    <Typography variant="subtitle1">{field.name}<span style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <Typography variant="caption">{field.description}</Typography>
                                    <FormGroup row>
                                        {
                                            field?.options.map((a, index) => {
                                                return (
                                                    <FormControlLabel value={a} control={<Radio/>}
                                                                      label={a} key={index}/>
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
                                    <Select
                                        name="colors"
                                        options={field?.options}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        // value={userSelected}
                                    />
                                </div>
                            )

                        return null
                    })
            }

        </div>
    );
}

export default RenderField;
