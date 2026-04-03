"use client";

import { useState } from "react";


export default function Grade() {
    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submittedName, setSubmittedName] = useState("");
    const [submittedGrade, setSubmittedGrade] = useState("");


    const nameError = name.trim() === "";
    const gradeError = grade.trim() === "" || isNaN(Number(grade)) || Number(grade) < 0 || Number(grade) > 100;
    const isFormValid = !nameError && !gradeError;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            // store the submitted values, clear inputs, and mark submitted
            setSubmittedName(name);
            setSubmittedGrade(grade);
            setName("");
            setGrade("");
            setSubmitted(true);
        }
        else if (nameError && gradeError) {
            alert("Please enter a valid name and a grade between 0 and 100.");
        }
        else {            alert("Please fix the errors in the form before submitting.");
        }
    };


    return(
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", border: "1px solid black", padding: "10px" }}>Grade Submission</h1>
            {!submitted ? (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: "300px" }}>
                    <label htmlFor="name" >Student Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} style={{ marginBottom: "10px", padding: "5px" }} />
                    {nameError && <span style={{ color: "red", marginBottom: "10px" }}>Name is required.</span>}

                    <label htmlFor="grade">Grade:</label>
                    <input type="text" id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} style={{ marginBottom: "10px", padding: "5px" }} />
                    {gradeError && <span style={{ color: "red", marginBottom: "10px" }}>Grade must be a number between 0 and 100.</span>}
                    <button type="submit" disabled={!isFormValid} style={{ padding: "5px", backgroundColor: isFormValid ? "#4CAF50" : "#ccc", color: "white", border: "none", cursor: isFormValid ? "pointer" : "default" }}>
                        Submit
                    </button>
                </form>
                ) : (
                <div style={{}}>
                    <h2 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold" }}>Submitted Grades</h2>
                    <p style={{ textAlign: "center", fontSize: "16px" }}>Name: {submittedName}</p>
                    <p style={{ textAlign: "center", fontSize: "16px" }}>Grade: {submittedGrade}</p>
                    <button
                        onClick={() => {
                            // reset submitted state so the form shows again
                            setSubmitted(false);
                            setSubmittedName("");
                            setSubmittedGrade("");
                        }}
                        style={{ padding: "6px 10px", marginTop: "10px" }}
                    >
                        Submit another
                    </button>
                </div>
            )}
        </div>
    );

    }