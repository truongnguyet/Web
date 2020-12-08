import React from 'react';
import { useGlobal} from 'reactn'
import {auth} from "../../firebaseConfig";
import MenuAppBar from "./menu";
import {Typography} from "@material-ui/core";

function Home(props) {

    const [user] = useGlobal('user')
    const onLogOut = () =>{
        auth.signOut()
    }
    return (
        <div>
            {/*wellcome home. {user.displayName}*/}
            {/*<button onClick={onLogOut}>*/}
            {/*    log out*/}
            {/*</button>*/}
            <MenuAppBar>
                <Typography>
                    dadbadad
                </Typography>
            </MenuAppBar>
        </div>
    );
}

export default Home;
