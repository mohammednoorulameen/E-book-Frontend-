import React from 'react'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  return (

        <div>
          <div className="flex  bg-slate min-h-full flex-1 flex-col justify-center px-6 py-12 pt-20 lg:px-8">
            {/* <hr className="w-1/2 mx-auto h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" /> */}
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 md:text-4.5xl text-4xl font-primary tracking-tighter leading-5 font-semibold text-center text-customColorTertiaryDark">
                Fogot Padssword?
              </h2>
            </div>
            
            <div className=" mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="mt-6 space-y-6 pt-2">
                <div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        className="w-full p-2  border border-black focus:outline-none focus:ring-1 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div>
                  <p className="  text-end text-sm text-gray-500">
                    Enter Password?{" "}
                    <Link
                      to="/login"
                      className="font-semibold  text-black hover:underline"
                    >
                      Signin
                    </Link>
                  </p>
                </div>

                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className=" w-4/12 justify-center bg-white border border-black text-black px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-black hover:text-white"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
  )
}

export default ForgotPassword
