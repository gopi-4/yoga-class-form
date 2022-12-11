import * as React from "react";
import moment from "moment-timezone";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import "./UserTable.scss";

export default function BasicTable({ users }) {
    const slotMap = new Map();
    slotMap.set("1", "6-7 AM");
    slotMap.set("2", "7-8 AM");
    slotMap.set("3", "8-9 AM");
    slotMap.set("4", "5-6 AM");

    return (
        <TableContainer component={Paper} className="table-container">
            <Table sx={{ minWidth: 300, maxWidth: 800, margin: "auto" }}>
                <TableHead>
                    <TableRow>
                        <TableCell
                            className="table-head"
                            style={{ borderTopLeftRadius: "10px" }}
                        >
                            Name
                        </TableCell>
                        <TableCell align="right" className="table-head">
                            Slot
                        </TableCell>
                        <TableCell
                            align="right"
                            className="table-head"
                            style={{ borderTopRightRadius: "10px" }}
                        >
                            Registration Date
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.name}
                            sx={{
                                "&:last-child td, &:last-child th": {
                                    border: 0
                                }
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {user.name}
                            </TableCell>
                            <TableCell align="right">
                                {slotMap.get(user.slot)}
                            </TableCell>
                            <TableCell align="right">
                                {moment(
                                    new Date(user.registration_date)
                                ).format("DD/MM/YYYY")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
