import CreateAuditForm from '../components/CRUD-auditory/Create-auditory';
import Navbar from "../components/home/Navbar_home";

export default function CreateformAu() {
    return(

    <div>
        <Navbar />
        <div className="w-full max-w-6xl h-[80vh] justify-center p-4 mx-auto items-center">
            <CreateAuditForm />
        </div>
    </div>
    )
}

export { CreateformAu };