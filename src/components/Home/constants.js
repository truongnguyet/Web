import {
    OpenWith,
    AssignmentTurnedIn,
    FormatListNumberedRtl,
    HowToReg,
    AccessTime,
    Event,
    Group,
    Link,
    RadioButtonChecked, ArrowDropDown, CheckBox, CalendarToday, ShortText, ViewHeadline
} from '@material-ui/icons'
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
        icon: <ShortText/>,
        description: 'Với các trường nhập liệu ngắn',
    },
    {
        type: 'long',
        name: 'Long Text',
        icon: <ViewHeadline/>,
        description: 'Với các trường nhập liệu dài',
    },
    {
        type: 'date',
        name: 'Date',
        icon: <Event/>,
        description: 'Với các trường chọn ngày'
    },
    {
        type: 'dateTime',
        name: 'Date Time',
        icon: <CalendarToday/>,
        description: 'Với các trường chọn cả ngày và giờ'
    },
    {
        type: 'checkBox',
        name: 'CheckBox',
        icon: <CheckBox/>,
        description: 'Với các trường cho chọn kiểu checkbox'
    },
    // {
    //     type: 'email',
    //     name: 'Email',
    //     icon: <OpenWith/>
    // },
    // {
    //     type: 'phone',
    //     name: 'Phone Number',
    //     icon: <OpenWith/>
    // },
    {
        type: 'dropDown',
        name: 'DropDown Select',
        icon: <ArrowDropDown/>,
        description: 'Với các trường chọn kiểu dropdown'
    },
    {
        type: 'time',
        name: 'Time',
        icon: <AccessTime/>,
        description: 'Với các trường chọn thời gian'
    },
    {
        type: 'attachment',
        name: 'Attachment',
        icon: <Link/>,
        description: 'Với các trường cho đính kèm tệp'
    },
    {
        type: 'radio',
        name: 'Radio',
        icon: <RadioButtonChecked/>,
        description: 'Với các trường cho chọn 1 giá trị'
    },
    {
        type: 'assignee',
        name: 'Assignee Select',
        icon: <Group/>,
        description: 'Với các trường chọn người tham gia'
    },

]
