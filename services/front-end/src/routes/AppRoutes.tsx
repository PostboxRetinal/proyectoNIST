import { useRoutes } from 'react-router-dom'; 
import Auditory from '../pages/Auditory';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Register from '../pages/Register';
import NewAuditory from '../components/newauditory/NewAuditory';
import Mainauditory from '../pages/Gestor-auditoria';
import CreateformAu from '../pages/Create-auditory';


const AppRoutes = () => {
    let routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/auditory', element: <Auditory /> },
        { path: '/newauditory', element: <NewAuditory /> },
        { path: '/api/loginUser', element: <Login /> },
        { path: '/api/registerUser', element: <Register /> },
        { path: '/mainauditory', element: <Mainauditory /> },
        { path: '/createauditory', element: <CreateformAu /> }
        //{ path: '/*', element: <NotFound /> }
      

    ])

    return routes
}

export default AppRoutes;