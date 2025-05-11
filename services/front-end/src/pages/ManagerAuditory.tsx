import AuditoryMain from "../components/crudAuditory/AuditoryMain";
import Navbar from "../components/shared/NavBar";

export default function Mainauditory() {
    return(
        <div>
            <Navbar />
            <AuditoryMain />
        </div> 
    )
}

export { Mainauditory };