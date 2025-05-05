import AuditoryMain from "../components/CRUD-auditory/Main-crud-auditory";
import Navbar from "../components/home/Navbar_home";

export default function Mainauditory() {
    return(
        <div>
            <Navbar />
            <AuditoryMain />
        </div> 
    )
}

export { Mainauditory };