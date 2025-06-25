import CreateAuditForm from '../components/createAuditForm/CreateAuditForm';
import Navbar from "../components/shared/NavBar";

export default function CreateAuditory() {
    return(

    <div>
        <Navbar />
        <div className="w-full max-w-6xl h-[80vh] justify-center p-4 mx-auto items-center">
            <CreateAuditForm />
        </div>
    </div>
    )
}

export { CreateAuditory };