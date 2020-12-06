import React from 'react';
import { useGlobal} from 'reactn'
import {auth} from "../../firebaseConfig";

function Home(props) {

    const [user] = useGlobal('user')
    const onLogOut = () =>{
        auth.signOut()
    }
    return (
        <div>
            wellcome home. {user.displayName}
            <button onClick={onLogOut}>
                log out
            </button>
        </div>
    );
}

export default Home;
