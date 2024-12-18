import React, { useState, useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { useSelector } from "react-redux";
import * as Yup from 'yup'
import { useFormik } from "formik";
import { useEditUserInfoMutation } from '../../../../Services/Apis/UserApi'

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Name is required")
    .matches(/.*\S.*/, "Username cannot be just spaces")
    .min(4, "Username must be at least 4 characters")
    .max(15, "Username cannot be more than 15 characters"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .matches(/.*\S.*/, "Email cannot be just spaces"), 
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10,11}$/, "Enter a valid phone number"), 
});

const EditProfile = () => {
  const userdata = useSelector((state) => state.user.userProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [EditUserInfo] = useEditUserInfoMutation()
  const [userData, setUserData ] = useState({
    username : "",
    email : "",
    phone : "",
  })

  useEffect(() => {
    if (userdata) {
      setUserData(userdata)
    }
  }, [userdata])
  
  const formik = useFormik({
    initialValues:{
      username : userdata.username || "",
      email : userdata.email ||  "",
      phone : userdata.phone || "",
    },
    validationSchema : validationSchema,
    onSubmit: async (userData) => {
      try {
       const response =  await EditUserInfo(userData)

      //  if (response.data) {
      //   navigate('/')
      //  }
      } catch (error) {
        console.log(error);
        
      }
      setIsEditing(false)

    }
  })

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900">
        {isEditing ? "Update Details" : "User Details"}
      </h2>

      {isEditing ? (
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 gap-6  sm:grid-cols-2">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <div className="mt-1">
                <TextField
                  id="username"
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                />
              </div>
              {formik.touched.username && formik.errors.username && (
          <div className="text-red-600">{formik.errors.username}</div>
        )}
            </div>
            <div>
              {/* <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label> */}
              <div className="mt-1">
                {/* <TextField
                  id="email"
                  type="text"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                /> */}
              </div>
              {formik.touched.email && formik.errors.email && (
          <div className="text-red-600">{formik.errors.email}</div>
        )}
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <div className="mt-1">
                <TextField
                  id="phone"
                  type="number"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                  fullWidth
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
          <div className="text-red-600">{formik.errors.phone}</div>
        )}
            </div>
          </div>

          <div className="flex space-x-4 mt-4">
            <Button
            type="submit"
              className="w-full sm:w-auto"
              variant="contained"
              color="primary"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              className="w-full sm:w-auto"
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              User Name
            </label>
            <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm">
              {userData.username}
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm">
              {userData.email}
            </div>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 shadow-sm">
              {userData.phone}
            </div>
          </div>
        </div>
      )}

      {!isEditing && (
        <Button
          onClick={() => setIsEditing(true)}
          className="w-full sm:w-auto"
          variant="contained"
          color="primary"
        >
          Update Profile
        </Button>
      )}
    </div>
  );
};

export default EditProfile;

