import Nav from "./Nav";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
function DashboardLayout({Page}) {
    const token = Cookies.get("token");
    const navigate = useNavigate();
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);
    return (
        <>
            <Nav />
            <main>
                <Page />
            </main>
            <Tooltip id="tooltip"></Tooltip>
        </>
    )}

export default DashboardLayout;