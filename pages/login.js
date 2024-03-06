import axios from 'axios';
import React, { Fragment, useState, useContext } from 'react'
import NavBar from '../comps/NavBar';
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { loginData } from '../context/context.js'
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';
// import Logo from './img/cseFinal.png';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Login = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  // const [organization, setOrganization] = useState('');
  const router = useRouter();

  const login = () => {
    axios({
      method: "post",
      data: {
        username: loginUsername,
        password: loginPassword
      },
      withCredentials: true,
      url: "http://localhost:3001/login"
    }).then((res) => {
      console.log(res);
      router.push('/');
    }).catch(err => console.log(err));
  }

  return (
    <div>
      <NavBar></NavBar>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-auto w-20"
            src="https://csecho.ca/wp-content/uploads/2012/09/aboutlogo.png"
            // src='./img/cseFinal.png'
            alt="Your Company"

          />
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            
            
            {/* <div>
              <label htmlFor="Country" className="block text-sm font-medium leading-6 text-gray-900">
                Country
              </label>
              <div className="mt-2">
                <input
                  id="Country"
                  name="Country"
                  type="Country"
                  autoComplete="Country"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  // onChange={e => setLoginUsername(e.target.value)}
                />
              </div>
            </div> */}


            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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
                  onChange={e => setLoginUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                  onChange={e => setLoginPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                // type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={login}
              >
                Sign in
              </button>
            </div>
            <div className="text-sm text-center">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={() => router.push('/register')}>
                Create a new account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;