import React from 'react'
import {withStyles} from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import deepOrange from '@material-ui/core/colors/deepOrange'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    avatar: {
        // margin: 10,
        width: 38,
        height: 38,
        [theme.breakpoints.down('xs')]: {
            width: 32,
            height: 32,
        },
    },

    orangeAvatar: {
        width: 38,
        height: 38,
        color: '#fff',
        backgroundColor: deepOrange[500],
        [theme.breakpoints.down('xs')]: {
            width: 32,
            height: 32,
        },
    },

})

function UserAvatar({classes, text, imgUrl}) {
    let avatarName
    if (text) {
        avatarName = text.substr(0, 1)
    }
    return (
        <div>
            {
                imgUrl ?
                    <Avatar className={classes.avatar} src={imgUrl} alt={'user-avatar'}/>
                    :
                    <Avatar className={classes.orangeAvatar}>{avatarName}</Avatar>
            }
        </div>
    )
}

export default withStyles(styles)(UserAvatar)
