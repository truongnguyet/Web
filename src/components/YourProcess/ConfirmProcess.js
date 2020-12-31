import React, {useEffect, useState} from 'react';
import MenuAppBar from "../Home/menu";
import {firestore} from "../../firebaseConfig";
import MaterialTable from "material-table";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import StartConfirm from "./startConfirm";
import {useGlobal} from 'reactn'

const useStyles = makeStyles((theme) => ({
    table: {
        margin: "20px 0"
    },
}))

function ConfirmProcess(props) {
    const classes = useStyles();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [openConfirm, setConfirm] = useState(false)
    const [process, setProcess] = useState({})
    const [user] = useGlobal('user')
    const handleClose = () => {
        setConfirm(false)
    }

    const [columns] = useState([
        {
            title: "Số thứ tự", field: "content", type: 'string', width: "50px",
            render: data => {
                if (data) {
                    return (
                        <div>{data.index + 1}</div>
                    )
                }
            }
        },

        {
            title: "Tên quy trình", field: "nameProcess", type: "string",
            render: data => {
                if (data.nameProcess) {
                    return (
                        <div>{data.nameProcess}</div>
                    )
                }
            }
        },

        {
            title: "Người khởi tạo", field: 'createdBy', type: "string",
            render: data => {
                if (data.createdBy) {
                    return (
                        <div>{data.createdBy}</div>
                    )
                }
                return null
            }
        },
        {
            title: "Thời gian gửi", field: "createdAt", type: "string",
            render: data => {
                if (data.createdAt) {
                    return (
                        <div>{data.createdAt}</div>
                    )
                }
            }
        },
    ])

    const getData = () => {
        setLoading(true)
        return firestore.collection('processing')
            .where("nextUser", "==", user.uid)
            .where("state", "==", 1)
            .onSnapshot(function (querySnap) {
                const listProcess = querySnap.docs.map(function (doc, index) {
                    return {...doc.data(), id: doc.id, index}
                });
                setData(listProcess)
                setLoading(false)
            });
    }
    useEffect(() => {
        if(!user?.uid) return;
        let unsub = getData()
        return () => {
            if (unsub) unsub()
        }
    }, [user?.uid])

    return (
        <div>
            <MenuAppBar>
                <div className={classes.table}>
                    <MaterialTable
                        columns={columns}
                        data={data}
                        isLoading={loading}
                        title={'Danh sách quy trình cần xử lý'}
                        options={{
                            pageSize: 10,
                            actionsColumnIndex: -1,
                            headerStyle: {
                                backgroundColor: '#3fb599',
                                color: '#FFF'
                            },
                            showTextRowsSelected: true,
                            search: true,
                        }}
                        actions={[
                            {
                                icon: 'offline_pin',
                                tooltip: 'Xác nhận',
                                iconProps: {color: "secondary"},
                                onClick: (event, rowData) => {
                                    setProcess(rowData)
                                    setConfirm(true)
                                }
                            },
                        ]}
                    />
                    <StartConfirm open={openConfirm} setOpen={setConfirm} process={process}/>
                </div>
            </MenuAppBar>
        </div>
    );
}

export default ConfirmProcess;
