import './App.css';
import {Route , Switch} from 'react-router-dom'
import Login from "./components/Login";
import Home from "./components/Home";
import { useEffect} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import {auth} from "./firebaseConfig";
import { useGlobal} from 'reactn'
import {useHistory} from 'react-router-dom'
import CreatePhase from "./components/Setting/CreatePhase";
import ListProcess from "./components/ListProcess";
import YourProcess from "./components/YourProcess/YourProcess";
import ConfirmProcess from "./components/YourProcess/ConfirmProcess";
import {toast, ToastContainer} from 'react-toastify'

function App() {
    const [,setUser] = useGlobal('user')
    const history = useHistory()
   useEffect(()=>{
       let sub = auth.onAuthStateChanged(user=>{
           if(user){
               // logged
               console.log(user)
               setUser(user)
           }else {
               history.push('/login')
           }
       })
       return ()=>{
           if(sub){
               sub()
           }
       }
   },[])
  return (
    <div className="App">
      <Switch>
        <Route exact path={'/login'} component={Login}/>
        <Route exact path={'/'} component={Home} />
        <Route  path={'/setting'} component={CreatePhase} />
        <Route exact path={'/list'} component={ListProcess} />
        <Route exact path={'/your-process'} component={YourProcess} />
        <Route exact path={'/confirm'} component={ConfirmProcess} />
      </Switch>

        <ToastContainer
            hideProgressBar={true}
            closeOnClick={false}
            autoClose={1000}
            position={toast.POSITION.BOTTOM_RIGHT}
        />
    </div>
  );
}

export default App;
