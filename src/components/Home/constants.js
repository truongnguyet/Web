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

export const listField = [
    {
        type: 'short',
        name: 'Short Text',
        icon: <OpenWith/>,
        description: 'Với các trường nhập liệu ngắn',
    },
    {
        type: 'long',
        name: 'Long Text',
        icon: <OpenWith/>
    },
    {
        type: 'date',
        name: 'Date',
        icon: <OpenWith/>
    },
    {
        type: 'dateTime',
        name: 'Date Time',
        icon: <OpenWith/>
    },
    {
        type: 'checkBox',
        name: 'CheckBox',
        icon: <OpenWith/>
    },
    {
        type: 'email',
        name: 'Email',
        icon: <OpenWith/>
    },
    {
        type: 'phone',
        name: 'Phone Number',
        icon: <OpenWith/>
    },
    {
        type: 'dropDown',
        name: 'DropDown Select',
        icon: <OpenWith/>
    },
    {
        type: 'time',
        name: 'Time',
        icon: <OpenWith/>
    },
    {
        type: 'attachment',
        name: 'Attachment',
        icon: <OpenWith/>
    },
    {
        type: 'radio',
        name: 'Radio',
        icon: <OpenWith/>
    },
    {
        type: 'assignee',
        name: 'Assignee Select',
        icon: <OpenWith/>
    },

]
