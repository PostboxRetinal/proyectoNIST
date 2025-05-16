import { useRoutes } from 'react-router-dom'; 
import Auditory from '../pages/Auditory';
import Login from '../pages/Login';
import Home from '../pages/Home';
import RegisterBussines from '../pages/RegisterBussines';
import RegisterUser from '../pages/RegisterUser';
import NewAuditory from '../components/newauditory/NewAuditory';
import Mainauditory from '../pages/ManagerAuditory';
import CreateAuditory from '../pages/CreateAuditory';
import ReportDashboard from '../pages/ReportDashboard';
import UserManagement from '@/components/crudUsuario/UserManagement';
import AdminRoute from './AdminRoute';

const AppRoutes = () => {
    let routes = useRoutes([
        { path: '/', element: <Home /> },
        { path: '/auditory', element: <Auditory /> },
        { path: '/newauditory', element: <NewAuditory /> },
        { path: '/api/loginUser', element: <Login /> },
        { path: '/api/registerCompany', element: <RegisterBussines /> },
        { path: '/api/registerUser', element: <RegisterUser /> },
        { path: '/mainauditory', element: <Mainauditory /> },
        { path: '/createauditory', element: <CreateAuditory /> },        
        { path: '/reportdashboard', element: <ReportDashboard /> },
        { path: '/api/user', element: <UserManagement /> }, 
        // Rutas protegidas para administradores
        { 
          path: '/user-management', 
          element: (
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          ) 
        },
        // Otras rutas protegidas...
      

    ])

    return routes
}

export default AppRoutes;