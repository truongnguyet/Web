import React from 'react';
import {AppBar, Tab, Tabs} from "@material-ui/core";
import MenuAppBar from "../Home/menu";

function CreatePhase(props) {
    return (
        <div>
            <MenuAppBar>
                <AppBar position="static">
                    <Tabs aria-label="simple tabs example">
                        <Tab label="Item One">
                            jjjjjhhh
                        </Tab>
                        <Tab label="Item Two"/>
                        <Tab label="Item Three"/>
                    </Tabs>
                </AppBar>
            </MenuAppBar>
        </div>
    );
}

export default CreatePhase;
