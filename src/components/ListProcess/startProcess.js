import React, {useEffect, useState} from 'react';
import {firestore} from "../../firebaseConfig";
import qs from 'query-string'
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import {Loader, LoadingOverlay} from "react-overlay-loader";
import MenuAppBar from "../Home/menu";
import {Typography} from "@material-ui/core";
import ActionField from "./actionField";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
    boldText: {
        fontWeight: "bold"
    }
}))

function StartProcess(props) {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})
    const [process, setProcess] = useState({})
    const query = qs.parse(window.location.search)
    const history = useHistory()
    const [userAssign, setUserAssign] = useState([])

    const getInfo = async (id) => {
        setLoading(true)
        try {
            const processSnap = await firestore.doc(`process/${id}`)
                .get()
            if (!processSnap.exists) {
                history.push('/')
                return
            }

            const data = processSnap.data()
            setProcess(data)
            const phaseSnap = await firestore.collection(`process/${id}/phases`)
                .orderBy('index')
                .get()
            const phase = phaseSnap.docs.map(doc => doc.data())
            setData(phase[0])
            setUserAssign(phase[1]?.users)
        } catch (e) {
            toast.error(`Lỗi, ${e}`)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (query?.id) {
            // get info
            getInfo(query.id)
        }
    }, [query?.id])

    const setField = (value = []) => {
        data.fields = value
        setData({...data})
    }
    return (
        <div>
            <MenuAppBar>
                <LoadingOverlay>
                    <Loader loading={loading} text={""}/>
                    <div>
                        <Typography><span className={classes.boldText}>Tên quy trình:</span>  {process.name}</Typography>
                        <Typography><span className={classes.boldText}>Giai đoạn:</span> {data.namePhase}</Typography>
                        <Typography style={{color: 'darkgray'}}>({data.desPhase})</Typography>
                        <p>Mời bạn điền thông tin vào các trường sau: </p>
                        <div>
                            {
                                data && data.fields && Array.isArray(data.fields) ?
                                    <ActionField arrayField={data.fields} user={userAssign} setArrayField={setField} />
                                    :
                                    <Typography>Không có trường nào được tạo</Typography>
                            }

                        </div>
                    </div>
                </LoadingOverlay>
            </MenuAppBar>
        </div>
    );
}

export default StartProcess;
