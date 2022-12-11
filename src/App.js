import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./Components/NavBar/NavBar";
import RegistrationForm from "./Components/RegisterForm/RegistrationForm";
import UserTable from "./Components/UserTable/UserTable";
import { SimpleToast } from "./Components/Toast/Toast";
import "./App.css";

function App() {
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [openToast, setOpenToast] = useState(false);

    useEffect(() => {
        async function getUsers() {
            const getUsersEndpoint = `${process.env.REACT_APP_BACKEND_API_ENDPOINT}/getUsers`;
            await axios
                .get(getUsersEndpoint)
                .then((response) => {
                    setUsers(response?.data || []);
                })
                .catch((error) => {
                    console.log("Error while fetching users: ", error);
                    setOpenToast(true);
                });
        }
        getUsers();
    }, []);

    return (
        <div className="App">
            <NavBar setShowForm={setShowForm} />
            {showForm ? (
                <RegistrationForm users={users} setUsers={setUsers} />
            ) : (
                <UserTable users={users} />
            )}
            <SimpleToast
                open={openToast}
                message="Something went wrong"
                handleCloseToast={() => setOpenToast(false)}
                severity="error"
            />
        </div>
    );
}

export default App;
