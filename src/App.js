import './App.css';
import {Route , Switch} from 'react-router-dom'
import Login from "./components/Login";
import Home from "./components/Home";
import { useEffect} from 'react'
import {auth} from "./firebaseConfig";
import { useGlobal} from 'reactn'
import {useHistory} from 'react-router-dom'
import CreatePhase from "./components/Setting/CreatePhase";
import ListProcess from "./components/ListProcess";
import YourProcess from "./components/YourProcess/YourProcess";

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
        <Route exact path={'/setting'} component={CreatePhase} />
        <Route exact path={'/list'} component={ListProcess} />
        <Route exact path={'/your-process'} component={YourProcess} />
      </Switch>
    </div>
  );
}

export default App;
