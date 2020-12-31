import React, {useEffect, useState} from 'react';
import MenuAppBar from "./menu";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button} from "@material-ui/core";
import MaterialTable from "material-table";
import {firestore} from "../../firebaseConfig";
import {makeStyles} from "@material-ui/core/styles";
import IconInput from "../CreateButton";
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";

const useStyles = makeStyles((theme) => ({
    table: {
        margin: "20px 0"
    },
}))

function Home(props) {
    const classes = useStyles();
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [delProcess, setDelProcess] = useState(null)
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
        return firestore.collection('process')
            .onSnapshot(function (querySnap) {
                const listProcess = querySnap.docs.map(function (doc, index) {
                    return {...doc.data(), id: doc.id, index}
                });
                setData(listProcess)
                setLoading(false)
            });
    }
    const handleDelete = async (data) =>{
        try{
            setLoading(true)
            const ref = firestore.doc(`process/${data.id}`)
            await ref.delete()
            toast.success('Đã xóa')

        }catch (e){
            toast.error("xóa thất bại. thử lại sau")
        }finally {
            setDelProcess(null)
            setLoading(false)
        }
        console.log(data);
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
                                icon: 'edit',
                                tooltip: 'Edit',
                                iconProps: {color: "primary"},
                                onClick: (event, rowData) => {
                                    // console.log('du lieu hang',rowData);
                                    setData(rowData)
                                    history.push("/setting?id=" + rowData.id)
                                }
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete',
                                iconProps: {color: "error"},
                                onClick: (event, rowData) => {
                                    console.log(rowData);
                                    setDelProcess(rowData)
                                    setData(rowData)
                                }
                            },
                        ]}
                    />
                </div>
                <DialogDeleteProcess loading={loading} data={delProcess} setData={setDelProcess} onDelete={handleDelete} />
                <IconInput/>
            </MenuAppBar>
        </div>
    );
}

function DialogDeleteProcess({data, setData,loading, onDelete}) {

    const handleClose = () => {
        setData(null)
    }

    if (!data)
        return null
    return (
        <Dialog open={Boolean(data)} onClose={handleClose}>
            <DialogTitle> Xóa quy trình</DialogTitle>
            <DialogContent>
                Bạn có muốn xóa process {data.name} ?
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading} variant="outlined" color="secondary">
                    Không Xóa
                </Button>
                <Button disabled={loading} onClick={()=>onDelete(data)} variant="outlined" color="primary">
                    OK, Xóa
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Home;
