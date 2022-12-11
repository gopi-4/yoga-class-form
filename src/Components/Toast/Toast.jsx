import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import style from "./toast.module.scss";

export function SimpleToast(props) {
    return (
        <div className={`${style["root"]}`}>
            <Snackbar
                open={props.open}
                autoHideDuration={6000}
                onClose={props.handleCloseToast}
            >
                <Alert
                    variant="filled"
                    severity={props.severity || "info"}
                    onClose={props.handleCloseToast}
                >
                    {props.message}
                </Alert>
            </Snackbar>
        </div>
    );
}
