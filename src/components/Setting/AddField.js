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
    TextField,
    Switch
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles(theme => ({
    container: {
        // width: 700,
        // height: '70vh',
        // backgroundColor: 'blue',
        padding:0
    },
    content: {
        padding: 10,
    },
    paper: {
        minHeight: '60vh',
        padding:10
    }
}));

function AddField({open, setOpen}) {
    const classes = useStyles();
    const [checked, setChecked] = useState(true)
    const handleClose = () => {
        setOpen(false);
    }
    const handleChange = (event) => {
        setChecked(event.target.checked);
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
                                            <ListItem id={"short"} draggable={true} onDragStart={event=>{
                                                event.dataTransfer.setData("type", "short");
                                            }}>
                                                <ListItemIcon><SendIcon/></ListItemIcon>
                                                <ListItemText>Short Text</ListItemText>
                                            </ListItem>
                                            <p>Với các trường nhập liệu ngắn</p>
                                        </List>
                                        <form noValidate autoComplete="off">
                                            <TextField id="outlined" label="Tên trường" variant="outlined"/>
                                            <TextField id="outlined-basic" label="Mô tả" variant="outlined"/>
                                            <p>Trường này có bắt buộc?</p>
                                            <Switch
                                                checked={checked}
                                                onChange={handleChange}
                                                name="checkedA"
                                                inputProps={{'aria-label': 'secondary checkbox'}}
                                            />
                                        </form>
                                        <Button variant="contained" color="secondary">
                                            Hủy
                                        </Button>
                                        <Button variant="contained" color="primary">
                                            Lưu
                                        </Button>
                                    </div>


                                </Paper>
                            </Grid>
                            <Grid item xs={6} onDrop={event=>{
                                const type = event.dataTransfer.getData("type");
                                event.preventDefault()
                                event.target.appendChild(document.getElementById(type).cloneNode(true))
                            }}  onDragOver={(e)=>e.preventDefault()}>
                                <Paper className={classes.paper}>xs=6</Paper>
                            </Grid>
                        </Grid>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddField;
