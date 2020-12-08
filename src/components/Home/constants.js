import { OpenWith , AssignmentTurnedIn,FormatListNumberedRtl,HowToReg } from '@material-ui/icons'
import React from "react";
export const menuItems = [
    {
        name:"Quản lý quy trình",
        route:"/",
        iconName: <OpenWith />,
        iconActive: <OpenWith color={"primary"} />,
    },
    {
        name:"Danh sách quy trình",
        route:"/list",
        iconName: <FormatListNumberedRtl />,
        iconActive: <FormatListNumberedRtl color={"primary"} />
    },
    {
        name:"Quy trình cần xác nhận",
        route:"/confirm",
        iconName: <AssignmentTurnedIn />,
        iconActive: <AssignmentTurnedIn color={"primary"} />
    },
    {
        name:"Quy trình của bạn",
        route:"/your-process",
        iconName: <HowToReg />,
        iconActive: <HowToReg color={"primary"} />
    }
]


export const isRoute = routeName =>{
    return window.location.pathname === routeName
}
