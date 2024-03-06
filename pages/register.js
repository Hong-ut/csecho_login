import axios from "axios";
import React, { Fragment, useState, useContext } from "react";
import NavBar from "../comps/NavBar";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { loginData } from "../context/context.js";

// const publishingOptions = [
//   { title: "Echo Lab Director", description: "", current: false },
//   { title: "Physician", description: "", current: true },
//   { title: "Echo Fellow", description: "", current: true },
//   { title: "Resident", description: "", current: true },
//   { title: "Sonographer", description: "", current: true },
//   { title: "Sonographer trainee", description: "", current: true },
// ];


const Register = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [organization, setOrganization] = useState("");
  // const [selected, setSelected] = useState(publishingOptions[0]);
  const router = useRouter();
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastName] = useState("");

  const register = () => {
    axios({
      method: "post",
      data: {
        name: firstName + ' ' +  lastName,
        email: registerUsername,
        password: registerPassword,
        organization: organization,
        role: 'nothing'
      },
      withCredentials: true,
      url: "http://localhost:3001/register",
    })
      .then((res) => {
        console.log(res.data);
        
        if (res.data.message === "User created") {
          login();
        }
        else {alert(res.data.message)};
        if (res.data.message === "This organization doesn't exist") {
          alert("This organization doesn't exist");
        }
        // login();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const login = () => {
    axios({
      method: "post",
      data: {
        username: registerUsername,
        password: registerPassword,
      },
      withCredentials: true,
      url: "http://localhost:3001/login",
    })
      .then((res) => {
        console.log(res);
        router.push("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    // <div>
    //   <NavBar></NavBar>
    //   <div>
    //     <h1>register</h1>
    //     <input type="text" name="username" placeholder='username' onChange={e =>
    //       setRegisterUsername(e.target.value)}></input>
    //     <input type="password" name='password' placeholder='password' onChange={e =>
    //       setRegisterPassword(e.target.value)}></input>
    //     <button onClick={register}>register</button>
    //   </div>
    // </div>
    // <NavBar></NavBar>
    <div>
      <NavBar></NavBar>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-auto w-20"
            src="https://csecho.ca/wp-content/uploads/2012/09/aboutlogo.png"
            alt="Your Company"
          />
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create a new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <form className="space-y-6" > */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  autoComplete="name"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  onChange={(e) => setLastName(e.target.value)}
                  // onChange={e => setLoginUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  onChange={(e) => setRegisterUsername(e.target.value)}
                ></input>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  onChange={(e) => setRegisterPassword(e.target.value)}
                ></input>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Organization
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="organization"
                  name="organization"
                  type="organization"
                  autoComplete="current-organization"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  onChange={(e) => setOrganization(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={register}
              >
                Sign up
              </button>
              {/* <button onClick={register}>register</button> */}
            </div>
            <div>
              <div className="text-sm text-center">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => router.push("/login")}
                >
                  Already have an account?
                </a>
              </div>
            </div>

            {/* </form> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
