import React, {useEffect, useState} from 'react';
import {useGlobal} from 'reactn'
import {auth} from "../../firebaseConfig";
import MenuAppBar from "./menu";
import {Typography} from "@material-ui/core";
import MaterialTable from "material-table";
import {firestore} from "../../firebaseConfig";
import {makeStyles} from "@material-ui/core/styles";
import IconInput from "../CreateButton";


const useStyles = makeStyles((theme) => ({
    table: {
        margin: "20px 0"
    },
}))

function Home(props) {

    const [user] = useGlobal('user')
    const onLogOut = () => {
        auth.signOut()
    }
    const classes = useStyles();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    const [columns] = useState([
        {
            title: "Số thứ tự", field: "content", type: 'string', width: "50px",
            render: data => {
                console.log('du lieu trong bang', data);
                if (data) {
                    return (
                        <div>{data.index + 1}</div>
                    )
                }
            }
        },

        {
            title: "Tên quy trình", field: "amountMoney", type: "string",
            render: data => {
                if (data.name) {
                    return (
                        <div>{data.name}</div>
                    )
                }
            }
        },

        {
            title: "Người tạo", field: 'authName', type: "string",
            render: data => {
                if (data.authName) {
                    return (
                        <div>{data.authName}</div>
                    )
                }
                return null
            }
        },
        {
            title: "Thời gian tạo", field: "createdAt", type: "string",
            render: data => {
                if (data.createdAt) {
                    return (
                        <div>{data.createdAt}</div>
                    )
                }
            }
        },
        {
            title: "Trạng thái", field: "status", type: "boolean", defaultSort: 'asc',
            render: data => {
                if (data.status) {
                    return (
                        <div>
                            {data.status === "active" ? "Đang hoạt động" : "Tạm ngừng"}
                        </div>
                    )
                }
            }
        },
    ])

    const getData = () => {
        setLoading(true)
        return firestore.collection('process')
            .onSnapshot(function (querySnap) {
                const listProcess = querySnap.docs.map(function (doc, index) {
                    return {...doc.data(), id: doc.id, index}
                });
                setData(listProcess)
                setLoading(false)
            });
    }

    useEffect(() => {
        let unsub = getData()
        return () => {
            if (unsub) unsub()
        }
    }, [])
    return (
        <div>
            <MenuAppBar>
                <Typography variant='h4'>
                    Danh sách quy trình:
                </Typography>
                <div className={classes.table}>
                    <MaterialTable
                        columns={columns}
                        data={data}
                        isLoading={loading}
                        title={'Danh sách quy trình'}
                        options={{
                            pageSize: 10,
                            actionsColumnIndex: -1,
                            headerStyle: {
                                backgroundColor: '#3f51b5',
                                color: '#FFF'
                            },
                            showTextRowsSelected: true,
                        }}
                        // actions={[
                        //     {
                        //         icon: 'edit',
                        //         tooltip: 'Edit',
                        //         onClick: (event, rowData) => {
                        //             setData(rowData)
                        //             // setOpenEdit(true);
                        //         }
                        //     },
                        //     {
                        //         icon: 'delete',
                        //         tooltip: 'Delete',
                        //         onClick: (event, rowData) => {
                        //             setData(rowData)
                        //             setOpenDelete(true);
                        //         }
                        //     },
                        // ]}
                    />
                </div>
                <IconInput/>
            </MenuAppBar>
        </div>
    );
}

export default Home;
