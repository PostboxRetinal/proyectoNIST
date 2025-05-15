import { useRoutes } from 'react-router-dom'; 
import Auditory from '../pages/Auditory';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Register from '../pages/Register';
import NewAuditory from '../components/newauditory/NewAuditory';
import Mainauditory from '../pages/ManagerAuditory';
import CreateAuditory from '../pages/CreateAuditory';
import ReportDashboard from '../pages/ReportDashboard';


const AppRoutes = () => {
    let routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/auditory', element: <Auditory /> },
        { path: '/newauditory', element: <NewAuditory /> },
        { path: '/api/loginUser', element: <Login /> },
        { path: '/api/registerCompany', element: <Register /> },
        { path: '/mainauditory', element: <Mainauditory /> },
        { path: '/createauditory', element: <CreateAuditory /> },        
        { path: '/reportdashboard', element: <ReportDashboard /> }        
        //{ path: '/*', element: <NotFound /> }
      

    ])

    return routes
}

export default AppRoutes;