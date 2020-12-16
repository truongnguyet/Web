import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {listField} from '../Home/constants';
import ListSubheader from "@material-ui/core/ListSubheader";
import DialogAddField from "./dialogAddField";
import {useGlobal} from 'reactn'
import {TextFields} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
    container: {
        // width: 700,
        // height: '70vh',
        // backgroundColor: 'blue',
        padding: 0
    },
    content: {
        padding: 10,
    },
    paper: {
        minHeight: '60vh',
        padding: 10
    }
}));

function AddField({open, setOpen, phaseIndex}) {
    const [openDialog, setOpenDialog] = useState(false);
    const [type, setType] = useState("");
    const [addedFields, setAddedField] = useGlobal("addedFields")
    const classes = useStyles();
    const handleClose = () => {
        setOpen(false);
    }

    const onDropItem = (event) => {
        const type = event.dataTransfer.getData("type");
        event.preventDefault()
        event.target.appendChild(document.getElementById(type).cloneNode(true))
    }


    return (
        <div>
            <Dialog open={open} onClose={handleClose}
                    maxWidth={"lg"}
                    fullWidth={true}
            >
                <DialogTitle>Thêm trường </DialogTitle>
                <DialogContent className={classes.container}>
                    <div className={classes.content}>
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Paper className={classes.paper}>
                                    <div>
                                        <List>
                                            {listField.map((item, index) => {
                                                return (
                                                    <ListItem id={item.type} draggable={true} onDragStart={event => {
                                                        event.dataTransfer.setData("type", item.type);
                                                    }}>
                                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                                        <ListItemText>{item.name}</ListItemText>
                                                        <ListSubheader>{item.description}</ListSubheader>
                                                    </ListItem>
                                                )
                                            })}

                                        </List>
                                    </div>


                                </Paper>
                            </Grid>
                            <Grid item xs={6} onDrop={event => {
                                const type = event.dataTransfer.getData("type");
                                event.preventDefault()
                                // event.target.appendChild(document.getElementById(type).cloneNode(true))
                                setOpenDialog(true)
                                setType(type)

                            }} onDragOver={(e) => e.preventDefault()}>
                                <Paper className={classes.paper}>
                                    {
                                        addedFields.map(field => {
                                            if (!field.type)
                                                return null
                                            if (field.type === 'short')
                                                return (
                                                    <div>
                                                        <TextField
                                                            label={field.name} variant="outlined" helperText={field.description}
                                                        />
                                                    </div>
                                                )

                                            return  null
                                        })
                                    }
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='secondary' variant={'contained'}>Hủy</Button>
                    <Button color='primary' variant='contained'>Hoàn thành</Button>
                </DialogActions>
            </Dialog>
            <DialogAddField open={openDialog} setOpen={setOpenDialog} type={type}/>
        </div>
    );
}

export default AddField;
