import React from 'react';
import TextField from "@material-ui/core/TextField";
import {Checkbox, FormControlLabel, FormGroup, Radio, Typography} from "@material-ui/core";
import Select from "react-select";
import {makeStyles} from "@material-ui/core/styles";


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
    }

}));

function FieldValue({arrayField}) {
    // console.log('trường đã tạo', arrayField);
    const classes = useStyles()
    return (
        <div>
            {
                arrayField.length === 0 ? '( Không có trường nào được chọn ) ' :
                    arrayField.map((field, index) => {
                        if (!field.type)
                            return null
                        if (field.type === 'short')
                            return (
                                <div key={index} className={classes.container}>
                                    <TextField
                                        label={field.name} variant="outlined" value={field.value} disabled
                                    />
                                </div>
                            )
                        if (field.type === 'long')
                            return (
                                <div key={index} className={classes.container}>
                                    <TextField
                                        label={field.name} variant="outlined" value={field.value} disabled
                                        multiline rows={3}
                                    />
                                </div>
                            )
                        if (field.type === 'date')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span
                                        style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        type="date"
                                        value={field.value}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled
                                    />

                                </div>
                            )
                        if (field.type === 'dateTime')
                            return (
                                <div key={index} className={classes.container}>
                                    <Typography variant="subtitle1">{field.name}<span
                                        style={{color: 'red'}}>{field.require ? " (*)" : ""}</span></Typography>
                                    <TextField
                                        type="datetime-local"
                                        value={field.value}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled
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
                                            field?.options.map((a, index) => {
                                                return (
                                                    <FormControlLabel key={index}
                                                                      control={<Checkbox
                                                                          disabled
                                                                          checked={Boolean(field?.optionsValue && field?.optionsValue[index])}
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
                                        type="time"
                                        value={field.value}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled
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
                                            field?.options.map((a, index) => {
                                                return (
                                                    <FormControlLabel value={a}
                                                                      control={<Radio disabled
                                                                                      checked={field?.value === a}/>}
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
                                    <Select
                                        isMulti
                                        name="colors"
                                        options={field.options}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        value={field.value}
                                    />
                                </div>
                            )

                        return null
                    })
            }
        </div>
    );
}

export default FieldValue;
