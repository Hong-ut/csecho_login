import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import NavBar from "../comps/NavBar";
import { useState, useEffect } from "react";
import axios from "axios";
import LabDashboard from "@/comps/dashboard";

export default function Home() {
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  // runs on the first render AND anytime `username` is changed
  useEffect(() => {
    getUser();
    console.log(userEmail);
    getUserRole();
  }, [userEmail]);

  const getUser = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/getUser",
    })
      .then((res) => {
        setUserEmail(res.data.email);
        console.log(res.data.email);
      })
      .catch((err) => console.log(err));
  };

  const getUserRole = () => {
    // const query = "SELECT role, organization, username FROM account WHERE email = ?";
    axios({
      method: "get",
      withCredentials: true,
      url: `http://localhost:3001/getUserInfo?userEmail=${userEmail}`,
    })
      .then((res) => {
        console.log("role: ", res.data.message[0].role);
        setUserRole(res.data.message[0].role)
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <NavBar></NavBar>
      {userRole === "Echo Lab Director" && (
        <div>
          <LabDashboard></LabDashboard>
        </div>
      )}
    </>
    //**** RENDER dashboard.js if (api for getting user's role) is echo lab director */

    // <div >
    //   <NavBar></NavBar>
    //   <div>
    //     <h1>Home</h1>
    //     <h1>Logged in user: {username}</h1>
    //   </div>
    // </div>
  );
}
