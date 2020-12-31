import React, {useEffect, useState} from 'react';
import MenuAppBar from "../Home/menu";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {firestore} from "../../firebaseConfig";
import MaterialTable from "material-table";
import {useGlobal} from 'reactn'
import ChitietQuyTrinh from "./chitietQuyTrinh";
import {Loader, LoadingOverlay} from "react-overlay-loader";

const useStyles = makeStyles((theme) => ({
    table: {
        margin: "20px 0"
    },
}))

function YourProcess(props) {

    const classes = useStyles();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [user] = useGlobal('user')
    const [idProcess, setIdProcess] = useState('')

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
            title: "Giai đoạn hiện tại", field: 'currentPhase', type: "string",
            render: data => {
                if (data.currentPhase) {
                    return (
                        <div>{data.currentPhase}</div>
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
                        <div>
                            {data.state === 1 ?
                                <span className="badge badge-success">Thành công</span>
                                :
                                <span className="badge badge-danger">Thất bại</span>

                            }

                        </div>
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
                console.log('processing', listProcess);
                setData(listProcess)
                setLoading(false)
            });
    }
    useEffect(() => {
        if (!user?.uid) return;
        let unsub = getData()
        return () => {
            if (unsub) unsub()
        }
    }, [user?.uid])

    return (
        <div>
            <MenuAppBar>
                <LoadingOverlay>
                    <Loader loading={loading} text={""}/>
                    <div className={classes.table}>
                        <MaterialTable
                            columns={columns}
                            data={data}
                            isLoading={loading}
                            title={'Danh sách quy trình của bạn'}
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
                                    icon: 'visibility',
                                    tooltip: 'Xem',
                                    iconProps: {color: "primary"},
                                    onClick: (event, rowData) => {
                                        setData(rowData)
                                        setOpen(true)
                                        setIdProcess(rowData.id)
                                    }
                                },
                            ]}
                        />
                    </div>
                </LoadingOverlay>
                <ChitietQuyTrinh open={open} setOpen={setOpen} idPro={idProcess}/>
            </MenuAppBar>
        </div>
    );
}

export default YourProcess;
