import './App.css';
import {Route, Switch} from 'react-router-dom'
import Login from "./components/Login";
import Home from "./components/Home";
import {useEffect} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import {auth, firestore} from "./firebaseConfig";
import {useGlobal} from 'reactn'
import {useHistory} from 'react-router-dom'
import CreatePhase from "./components/Setting/CreatePhase";
import ListProcess from "./components/ListProcess";
import YourProcess from "./components/YourProcess/YourProcess";
import ConfirmProcess from "./components/YourProcess/ConfirmProcess";
import {toast, ToastContainer} from 'react-toastify'
import 'react-overlay-loader/styles.css';
import StartProcess from "./components/ListProcess/startProcess";
import StartConfirm from "./components/YourProcess/startConfirm";

function App() {
    const [user, setUser] = useGlobal('user')
    const [role, setRole] = useGlobal('role')
    const history = useHistory()

    useEffect(() => {
        let sub = auth.onAuthStateChanged(user => {
            if (user) {
                // logged
                console.log(user)
                getProfie(user)

            } else {
                history.push('/login')
            }
        })
        return () => {
            if (sub) {
                sub()
            }
        }
    }, [])
    const getProfie = async (user) => {
        try {
            const userSnap = await firestore.doc(`users/${user.uid}`).get()
            if (userSnap.exists) {
                const data = userSnap.data()
                setUser({...user, ...data})
                return
            }
            const userInfo = {
                id: user.uid,
                displayName: user.displayName || '',
                email: user.email || '',
                role: 'normalUser',
                image: user.photoURL || null,
            }
            await firestore.doc(`users/${user.uid}`).set(
                userInfo
            )
            setUser({...user, ...userInfo})
        } catch (e) {
            console.log(e);
        }


    }
    const getUser = async () => {
        try {
            const userSnap = await firestore.doc(`users/${user.uid}`)
                .get()
            const data = userSnap.data()
            await setRole(data?.role)
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        if (!user.uid) return;
        getUser()

    }, [user])

    return (
        <div className="App">
            <Switch>
                <Route exact path={'/login'} component={Login}/>
                <Route exact path={'/'} component={Home}/>
                <Route path={'/setting'} component={CreatePhase}/>
                <Route exact path={'/list'} component={ListProcess}/>
                <Route exact path={'/your-process'} component={YourProcess}/>
                <Route exact path={'/confirm'} component={ConfirmProcess}/>
                <Route exact path={'/start'} component={StartProcess}/>
            </Switch>

            <ToastContainer
                hideProgressBar={true}
                closeOnClick={false}
                autoClose={1000}
                position={toast.POSITION.TOP_RIGHT}
            />
        </div>
    );
}

export default App;
