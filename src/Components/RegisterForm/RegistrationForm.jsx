import React, { useState } from "react";
import moment from "moment-timezone";
import DateExtension from "@joi/date";
import JoiImport from "joi";
import axios from "axios";
import dayjs from "dayjs";

import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { SimpleToast } from "../Toast/Toast";
import "./RegistrationForm.scss";

const Joi = JoiImport.extend(DateExtension);

export default function RegistrationForm({ users, setUsers }) {
    const slots = [
        ["1", "6-7 AM"],
        ["2", "7-8 AM"],
        ["3", "8-9 AM"],
        ["4", "5-6 PM"]
    ];
    const schema = {
        name: "",
        email: "",
        mobile: "",
        dob: null,
        slot: ""
    };
    const [formData, setFormData] = useState(schema);
    const [errorObj, setErrorObj] = useState({});
    const [openToast, setOpenToast] = useState(false);
    const [toastSeverity, setToastSeverity] = useState("info");
    const [toastMessage, setToastMessage] = useState("");

    const minValidDate = moment().subtract(56, "y").format("YYYY-MM-DD");
    const maxValidDate = moment().subtract(18, "y").format("YYYY-MM-DD");

    const validationSchema = {
        name: Joi.string().required().min(3).label("Name"),
        email: Joi.string()
            .required()
            .email({ minDomainSegments: 2, tlds: { allow: false } }),
        mobile: Joi.string()
            .length(10)
            .pattern(/^\d+$/)
            .allow("")
            .optional()
            .messages({
                "string.pattern.base": `Mobile number must have 10 digits.`
            })
            .label("Mobile No."),
        dob: Joi.date()
            .format("YYYY-MM-DD")
            .min(minValidDate)
            .max(maxValidDate)
            .required()
            .label("Date of Birth")
            .messages({
                "data.format": `Please enter date in 'YYYY-MM-DD' format`,
                "date.min": `You must be older than 18years to register`,
                "date.max": `You must be younger than 56years to register`
            }),
        slot: Joi.string().required().label("Slot")
    };

    const validationSchemaObj = Joi.object({
        name: validationSchema["name"],
        email: validationSchema["email"],
        mobile: validationSchema["mobile"],
        dob: validationSchema["dob"],
        slot: validationSchema["slot"]
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid = () => {
        const errors = {};

        const check = validationSchemaObj.validate(formData, {
            abortEarly: false
        });
        if (!check.error) {
            setErrorObj(errors);
            return true;
        }
        check.error.details.map((item) => {
            if (!errors[item.path[0]]) errors[item.path[0]] = item.message;
            return 0;
        });
        if (!formData["mobile"]) delete errors["mobile"];
        setErrorObj(errors);
        return false;
    };

    const handleCloseToast = (event, reason) => {
        setToastMessage("");
        setOpenToast(false);
        setToastSeverity("info");
    };

    async function handleSubmit(e) {
        e.preventDefault();
        if (isFormValid()) {
            try {
                const header = {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                };

                const registerUserEndpoint = `${process.env.REACT_APP_BACKEND_API_ENDPOINT}/registerUser`;
                const response = await axios.post(
                    registerUserEndpoint,
                    formData,
                    header
                );
                setToastMessage(
                    response?.data?.message || "Something went wrong"
                );
                setToastSeverity(response.status === 200 ? "success" : "error");
                setOpenToast(true);
                if (response.status === 200) {
                    setUsers([...users, response?.data?.user]);
                    setFormData(schema); //reset form
                }
            } catch (error) {
                setToastMessage(
                    error?.response?.data?.message || "Something went wrong"
                );
                setToastSeverity("error");
                setOpenToast(true);
            }
        } else {
            setToastMessage("Please enter valid data");
            setToastSeverity("error");
            setOpenToast(true);
        }
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <div className="container">
                <Container className="form">
                    <FormControl fullWidth sx={{ m: 1 }}>
                        <h1>Application Form</h1>
                        <div className="input">
                            <TextField
                                label="Name"
                                name="name"
                                variant="outlined"
                                value={formData["name"]}
                                onChange={handleChange}
                                error={errorObj["name"] ? true : false}
                                helperText={errorObj["name"]}
                                fullWidth
                            />
                        </div>
                        <div className="input">
                            <TextField
                                label="Email"
                                variant="outlined"
                                name="email"
                                value={formData["email"]}
                                onChange={handleChange}
                                error={errorObj["email"] ? true : false}
                                helperText={errorObj["email"]}
                                fullWidth
                            />
                        </div>
                        <div className="input">
                            <TextField
                                label="Mobile No."
                                variant="outlined"
                                name="mobile"
                                value={formData["mobile"]}
                                onChange={handleChange}
                                error={errorObj["mobile"] ? true : false}
                                helperText={errorObj["mobile"]}
                                fullWidth
                            />
                        </div>
                        <div className="input">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    disableFuture
                                    minDate={dayjs(minValidDate)}
                                    maxDate={dayjs(maxValidDate)}
                                    label="Date of Birth"
                                    value={formData["dob"]}
                                    onChange={(newDate) =>
                                        handleChange({
                                            target: {
                                                name: "dob",
                                                value: newDate.format(
                                                    "YYYY-MM-DD"
                                                )
                                            }
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            name="dob"
                                            error={
                                                errorObj["dob"] ? true : false
                                            }
                                            helperText={errorObj["dob"]}
                                            {...params}
                                        />
                                    )}
                                    className="date-picker"
                                />
                            </LocalizationProvider>
                        </div>
                        <div className="input" style={{ paddingLeft: "12px" }}>
                            <FormLabel>Slot</FormLabel>
                            <RadioGroup
                                row
                                name="slot"
                                value={formData["slot"]}
                                onChange={handleChange}
                            >
                                {slots.map((slot) => (
                                    <FormControlLabel
                                        value={slot[0]}
                                        control={<Radio />}
                                        label={slot[1]}
                                        key={slot[0]}
                                    />
                                ))}
                            </RadioGroup>
                            <div>
                                {errorObj["slot"] ? (
                                    <div className="error-message">
                                        {" "}
                                        {errorObj["slot"]}
                                    </div>
                                ) : (
                                    <div>&nbsp; &nbsp;</div>
                                )}
                            </div>
                        </div>
                    </FormControl>
                    <Button variant="contained" onClick={handleSubmit}>
                        Pay ₹500 & Join Yoga Class
                    </Button>
                </Container>
            </div>
            <SimpleToast
                open={openToast}
                message={toastMessage}
                handleCloseToast={handleCloseToast}
                severity={toastSeverity}
            />
        </React.Fragment>
    );
}
