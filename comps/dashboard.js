import NavBar from "../comps/NavBar";
import React, { Fragment, useState, useEffect, useContext } from "react";
import axios from "axios";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import emailjs from "@emailjs/browser";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const publishingOptions = [
  //   { title: "Echo Lab Director", description: "", current: false },
  { title: "Physician", description: "", current: true },
  { title: "Echo Fellow", description: "", current: true },
  { title: "Resident", description: "", current: true },
  { title: "Sonographer", description: "", current: true },
  { title: "Sonographer trainee", description: "", current: true },
];

export default function LabDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addUsername, setAddUsername] = useState("");
  const [selected, setSelected] = useState(publishingOptions[0]);
  const [labName, setLabName] = useState("");
  const [people, setPeople] = useState([
    // {
    //   name: "Sungjin Hong",
    //   email: "7594hsj@gmail.com",
    //   role: "Resident",
    //   status: "Invited",
    // },
    // {
    //   name: "Sungjin Hong2",
    //   email: "7594hsj@naver.com",
    //   role: "Echo Fellow",
    //   status: "Invited",
    // },
    // {
    //   name: "Sungjin Hong3",
    //   email: "sj.hong@mail.utoronto.ca",
    //   role: "Sonographer",
    //   status: "Signed up",
    // },
  ]);
  const [emailDelete, setEmailDelete] = useState('');
  const [statusDelete, setStatusDelete] = useState('');

  const deleteUser = (email, status) => {
    // 1.  delete from invitedUsers
    // 2. if the status is signed up, delete from the account
    axios({
      method: "post",
      withCredentials: true,
      url: "http://localhost:3001/deleteInvitedUser",
      data: {
        email: email,
        status: status,
      },
    })
      .then((res) => {
        // console.log(res.data.email)
        console.log(res.data.message);
        getInvitedUsers();
      })
      .catch((err) => console.log(err));

    console.log("testtttt");
  };

  const getUsername = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: "http://localhost:3001/getUser",
    })
      .then((res) => {
        getLabName(res.data.email);
        console.log(res.data.email);
      })
      .catch((err) => console.log(err));
  };

  // this must be executed after getUsername()
  const getLabName = (userEmail) => {
    axios({
      method: "get",
      withCredentials: true,
      url: `http://localhost:3001/getLabName?userEmail=${userEmail}`,
    })
      .then((res) => {
        console.log(res.data.message[0].organization);
        console.log(userEmail);
        const data = res.data.message[0].organization;
        setLabName(data);
      })
      .catch((err) => console.log(err));
  };

  const addInvite = () => {
    axios({
      method: "post",
      data: {
        email: addEmail,
        name: addUsername,
        role: selected.title,
        labName: labName,
        status: "Invited",
      },
      withCredentials: true,
      url: "http://localhost:3001/addInvite",
    })
      .then((res) => {
        console.log(res);
        getInvitedUsers();
      })
      .catch((err) => console.log(err));
  };

  const getInvitedUsers = () => {
    axios({
      method: "get",
      withCredentials: true,
      url: `http://localhost:3001/getInvitedUsers?labName=${labName}`,
    })
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message !== "No invitations so far") {
          setPeople(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const sendEmail = () => {
    const templateParams = {
      toEmail: addEmail,
      toName: addUsername,
      role: selected.title,
      labName: labName,
    };
    axios({
      method: "post",
      withCredentials: true,
      url: "http://localhost:3001/sendInviteEmail",
      data: templateParams,
    })
      .then((res) => {
        console.log("msg from sendInviteEmail: ", res.data.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getUsername(); // this calls getLabName as well => Updates labName by passing in userEmail
    getInvitedUsers();
  }, [labName]);

  return (
    <>
      <div className="sm:flex mt-5 px-4 sm:px-6 lg:px-3">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            Your {labName} Members
          </h1>
          <h2 className="text-sm mt-2">
            These are your members&apos; accounts. Click your member&apos;s name
            to view their progress.
          </h2>
          {/* <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name, title, email and role.
            </p> */}
        </div>
        <div className="mt-5 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => setShowModal(true)}
          >
            Add a member
          </button>
        </div>
      </div>
      <div className="mt-4 flow-root lg:px-3">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.email} className="h-24">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.role}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person.status}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {person.role != "Echo Lab Director" ? (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => {
                              // deleteUser(person.email, person.status)
                              setShowModal2(true);
                              setEmailDelete(person.email);
                              setStatusDelete(person.status);
                            }
                            }
                          >
                            Delete Invitation
                            <span className="sr-only">{person.name}</span>
                          </button>
                        ) : (
                          <div></div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="min-w-[30%] relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Invite User</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"></span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto space-y-6 ">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        name="name"
                        type="name"
                        autoComplete="name"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                        onChange={(e) => setAddUsername(e.target.value)}
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
                        onChange={(e) => setAddEmail(e.target.value)}
                      ></input>
                    </div>
                  </div>

                  <div className="grid place-items-center">
                    <Listbox value={selected} onChange={setSelected}>
                      {({ open }) => (
                        <>
                          <Listbox.Label className="sr-only">
                            Change published status
                          </Listbox.Label>
                          <div className="relative ">
                            <div className="inline-flex divide-x divide-indigo-700 rounded-md shadow-sm content-center">
                              <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-indigo-600 px-3 py-2 text-white shadow-sm">
                                <CheckIcon
                                  className="-ml-0.5 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <p className="text-sm font-semibold">
                                  {selected.title}
                                </p>
                              </div>
                              <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-gray-50">
                                <span className="sr-only">
                                  Change published status
                                </span>
                                <ChevronDownIcon
                                  className="h-5 w-5 text-white"
                                  aria-hidden="true"
                                />
                              </Listbox.Button>
                            </div>

                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {publishingOptions.map((option) => (
                                  <Listbox.Option
                                    key={option.title}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "bg-indigo-600 text-white"
                                          : "text-gray-900",
                                        "cursor-default select-none p-4 text-sm"
                                      )
                                    }
                                    value={option}
                                  >
                                    {({ selected, active }) => (
                                      <div className="flex flex-col">
                                        <div className="flex justify-between">
                                          <p
                                            className={
                                              selected
                                                ? "font-semibold"
                                                : "font-normal"
                                            }
                                          >
                                            {option.title}
                                          </p>
                                          {selected ? (
                                            <span
                                              className={
                                                active
                                                  ? "text-white"
                                                  : "text-indigo-600"
                                              }
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </div>
                                        <p
                                          className={classNames(
                                            active
                                              ? "text-indigo-200"
                                              : "text-gray-500",
                                            "mt-2"
                                          )}
                                        >
                                          {option.description}
                                        </p>
                                      </div>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                  </div>
                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-indigo-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={(e) => {
                      setShowModal(false);
                      people.push({
                        name: addUsername,
                        email: addEmail,
                        role: selected.title,
                        status: "invited",
                      });
                      addInvite();
                      sendEmail();
                    }}
                  >
                    Invite
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

      {showModal2 ? (
        <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="min-w-[30%] relative w-auto my-6 mx-auto max-w-3xl">
            {/*content*/}
            <div className=" border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-3xl font-semibold">Are you sure you want to delete the invitation?</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setShowModal2(false)}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"></span>
                </button>
              </div>

              {/*footer*/}
              <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b space-x-20">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal2(false)}
                >
                  Close
                </button>
                <button
                  className="bg-red-600 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={(e) => {
                    setShowModal2(false);
                    deleteUser(emailDelete, statusDelete);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </>
      ) : null}
    </>
  );
}

