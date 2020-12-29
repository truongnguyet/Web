import React, {useEffect, useState} from 'react';
import MenuAppBar from "../Home/menu";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {firestore} from "../../firebaseConfig";
import MaterialTable from "material-table";
import {useGlobal} from 'reactn'

const useStyles = makeStyles((theme) => ({
    table: {
        margin: "20px 0"
    },
}))

function YourProcess(props) {

    const classes = useStyles();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const [user] = useGlobal('user')

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
            title: "Giai đoạn hiện tại", field: 'authName', type: "string",
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
            title: "Kết quả", field: "state", type: "string",
            render: data => {
                if (data.state) {
                    return (
                        <div>{data.state === 1 ? 'Thành công' : 'Thất bại'}</div>
                    )
                }
            }
        },
    ])

    const getData = () => {
        setLoading(true)
        return firestore.collection('processing')
            .where("idAuth", "==", user.uid)
            .onSnapshot(function (querySnap) {
                const listProcess = querySnap.docs.map(function (doc, index) {
                    return {...doc.data(), id: doc.id, index}
                });
                console.log('processing',listProcess);
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
                                backgroundColor: '#3f51b5',
                                color: '#FFF'
                            },
                            showTextRowsSelected: true,
                        }}
                        actions={[
                            {
                                icon: 'visibility',
                                tooltip: 'Xem',
                                onClick: (event, rowData) => {
                                    // console.log('du lieu hang',rowData);
                                    setData(rowData)
                                    // history.push("/setting?id=" + rowData.id)
                                }
                            },
                        ]}
                    />
                </div>
            </MenuAppBar>
        </div>
    );
}

export default YourProcess;
