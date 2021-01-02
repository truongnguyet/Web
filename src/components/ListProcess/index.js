import React, {useEffect, useState} from 'react';
import MenuAppBar from "../Home/menu";
import {firestore} from "../../firebaseConfig";
import MaterialTable from "material-table";
import IconInput from "../CreateButton";
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    table: {
        margin: "20px 0"
    },
}))


function ListProcess(props) {
    const classes = useStyles();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const history = useHistory()

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
            title: "Tên quy trình", field: "name", type: "string",
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
                            {data.status === "active"
                                ?
                                <span className="badge badge-success">Đang hoạt động</span>
                                :
                                <span className="badge badge-danger">Tạm ngừng</span>

                            }
                        </div>
                    )
                }
            }
        },
    ])

    const getData = () => {
        setLoading(true)
        return firestore.collection('process').where('status', '==', 'active')
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
                                backgroundColor: '#3fb599',
                                color: '#FFF'
                            },
                            showTextRowsSelected: true,
                            search: true,
                        }}
                        actions={[
                            {
                                icon: 'forward',
                                tooltip: 'Chạy quy trình',
                                iconProps: {color: "primary"},
                                onClick: (event, rowData) => {
                                    setData(rowData)
                                    history.push("/start?id=" + rowData.id)
                                }
                            },
                        ]}
                    />
                </div>
            </MenuAppBar>
        </div>
    );
}

export default ListProcess;
