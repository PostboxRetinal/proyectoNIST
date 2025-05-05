import { useRoutes } from 'react-router-dom'; 
import Auditory from '../pages/Auditory';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Register from '../pages/Register';
import NewAuditory from '../components/newauditory/NewAuditory';

const AppRoutes = () => {
    let routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/iso27001', element: <Auditory /> },
        { path: '/newauditory', element: <NewAuditory /> },
        { path: '/api/loginUser', element: <Login /> },
        { path: '/api/registerUser', element: <Register /> },
        //{ path: '/*', element: <NotFound /> }
      

    ])

    return routes
}

export default AppRoutes;