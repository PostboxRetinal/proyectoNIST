import NewAuditoryComponent from '../components/newauditory/NewAuditory';
import Navbar from "../components/shared/NavBar";
import { AlertProvider } from '../components/alert/AlertContext';

const NewAuditory = () => {
  return (
    <AlertProvider>
      <div>
        <Navbar />
        <NewAuditoryComponent />
      </div>
    </AlertProvider>
  );
};

export default NewAuditory;