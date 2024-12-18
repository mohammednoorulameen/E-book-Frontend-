import React from "react";
import Modal from "react-modal";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Box, Typography } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
Modal.setAppElement("#root");

// const validationSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   phone: Yup.string()
//     .required("Phone number is required")
//     .matches(/^\d{10,11}$/, "Enter a valid phone number"),
//   pincode: Yup.string()
//     .required("Pincode is required")
//     .matches(/^\d{6}$/, "Enter valid pincode."),
//   locality: Yup.string().required("Locality is required"),
//   address: Yup.string().required("Address is required"),
//   city: Yup.string().required("City is required"),
//   state: Yup.string().required("State is required"),
//   landmark: Yup.string().required("Landmark is required"),
//   altPhone: Yup.string()
//     .required("Alternative phone number is required")
//     .matches(/^\d{10,11}$/, "Enter a valid phone number"),
//   addressType: Yup.string().required("Select an address type"),
// });


const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .test(
      "not-only-spaces",
      "Name cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10,11}$/, "Enter a valid phone number"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Enter valid pincode."),
  locality: Yup.string()
    .required("Locality is required")
    .test(
      "not-only-spaces",
      "Locality cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
  address: Yup.string()
    .required("Address is required")
    .test(
      "not-only-spaces",
      "Address cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
  city: Yup.string()
    .required("City is required")
    .test(
      "not-only-spaces",
      "City cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
  state: Yup.string()
    .required("State is required")
    .test(
      "not-only-spaces",
      "State cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
  landmark: Yup.string()
    .required("Landmark is required")
    .test(
      "not-only-spaces",
      "Landmark cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
  altPhone: Yup.string()
    .required("Alternative phone number is required")
    .matches(/^\d{10,11}$/, "Enter a valid phone number"),
  addressType: Yup.string()
    .required("Select an address type")
    .test(
      "not-only-spaces",
      "Address type cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
});


/**
 * delete address
 */

const AddressDeleteModal = ({ isOpen, onClose, addressId, onSubmit }) => {
  /**
   * handle delete submission
   */
  const HandleDelete = () => {
    onSubmit(addressId);
    onClose();
  };

  /**
   * handle close modal
   */

  const HandleClose = () => {
    onClose();
  };

  return (
    <div>
      {/* Confirmation modal */}
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="modal-content fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50"
        overlayClassName="modal-overlay fixed z-50 inset-0"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            // bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-6"
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Are you sure you want to delete this address?
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Once deleted, you won’t be able to recover this address.
          </Typography>
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button onClick={HandleClose} color="primary">
              Cancel
            </Button>
            <Button color="error" onClick={HandleDelete}>
              Yes, Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

/**
 * edit address
 */

const EditAddressModal = ({
  isOpen,
  onClose,
  loading,
  errorMessages,
  onSubmit,
  addresses,
}) => {
  const formik = useFormik({
    initialValues: {
      name: addresses?.name || "",
      phone: addresses?.phone || "",
      pincode: addresses?.pincode || "",
      locality: addresses?.locality || "",
      address: addresses?.address || "",
      city: addresses?.city || "",
      state: addresses?.state || "",
      landmark: addresses?.landmark || "",
      altPhone: addresses?.altPhone || "",
      addressType: addresses?.addressType || "",
      id: addresses?._id,
    },

    validationSchema: validationSchema,

    onSubmit: async (EditValues) => {
      try {
        await onSubmit(EditValues);
      } catch (error) {
        console.error("Submission error", error);
      }
    },
    enableReinitialize: true,
  });

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="modal-content fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50"
        overlayClassName="modal-overlay fixed z-50 inset-0"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Edit Address</h2>
            <button
              disabled={loading}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-3 mt-4 bg-white p-3 rounded-md shadow-md max-w-md mx-auto"
          >
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                {...formik.getFieldProps("name")}
                placeholder="Full name"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                {...formik.getFieldProps("phone")}
                placeholder="Phone Number"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            {/* Alternative Phone */}
            <div>
              <label
                htmlFor="altPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Alternative Phone Number
              </label>
              <input
                type="text"
                id="altPhone"
                name="altPhone"
                {...formik.getFieldProps("altPhone")}
                placeholder="Alternative Phone Number"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.altPhone && formik.errors.altPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.altPhone}
                </p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                {...formik.getFieldProps("pincode")}
                placeholder="Pin Code"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.pincode && formik.errors.pincode && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.pincode}
                </p>
              )}
            </div>
            {/* locality */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="locality"
                  className="block text-sm font-medium text-gray-700"
                >
                  locality
                </label>
                <input
                  type="text"
                  id="locality"
                  name="locality"
                  {...formik.getFieldProps("locality")}
                  placeholder="locality"
                  className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.locality && formik.errors.locality && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.locality}
                  </p>
                )}
              </div>
              {/* landmark */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  {...formik.getFieldProps("landmark")}
                  placeholder="landmark"
                  className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.landmark && formik.errors.landmark && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.landmark}
                  </p>
                )}
              </div>
            </div>
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                id="address"
                rows={2}
                name="address"
                {...formik.getFieldProps("address")}
                placeholder="House No, Building, Street, Area"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.address}
                </p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  {...formik.getFieldProps("city")}
                  placeholder="City"
                  className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.city}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  {...formik.getFieldProps("state")}
                  placeholder="State"
                  className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.state && formik.errors.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.state}
                  </p>
                )}
              </div>
            </div>

            {/* Address Type */}
            <div>
              <label
                htmlFor="addressType"
                className="block text-sm font-medium text-gray-700"
              >
                Address Type
              </label>
              <select
                id="addressType"
                name="addressType"
                {...formik.getFieldProps("addressType")}
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="" disabled>
                  Select Address Type
                </option>
                <option value="home">Home</option>
                <option value="work">Work</option>
                {/* <option value="other">Other</option> */}
              </select>
              {formik.touched.addressType && formik.errors.addressType && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.addressType}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white rounded-lg ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Address"}
            </button>

            {/* Display server-side error messages */}
            {errorMessages && (
              <div className="mt-3 text-red-600 text-xs text-center">
                {errorMessages}
              </div>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
};

/**
 * Add address
 */
const AddAddressModal = ({
  isOpen, 
  onClose,
  loading,
  errorMessages,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      pincode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      landmark: "",
      altPhone: "",
      addressType: "",
    },

    validationSchema: validationSchema,

    onSubmit: async (addressData) => {
      try {
        await onSubmit(addressData);
      } catch (error) {
        console.error("Submission error", error);
      }
    },
  });

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="modal-content fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50"
        overlayClassName="modal-overlay fixed z-50 inset-0"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Address
            </h2>
            <button
              disabled={loading}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="space-y-3 mt-4 bg-white p-3 rounded-md shadow-md max-w-md mx-auto"
          >
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                {...formik.getFieldProps("name")}
                placeholder="Full name"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                {...formik.getFieldProps("phone")}
                placeholder="Phone Number"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.phone}
                </p>
              )}
            </div>

            {/* Alternative Phone */}
            <div>
              <label
                htmlFor="altPhone"
                className="block text-sm font-medium text-gray-700"
              >
                Alternative Phone Number
              </label>
              <input
                type="text"
                id="altPhone"
                name="altPhone"
                {...formik.getFieldProps("altPhone")}
                placeholder="Alternative Phone Number"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.altPhone && formik.errors.altPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.altPhone}
                </p>
              )}
            </div>

            {/* Pincode */}
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700"
              >
                Pincode
              </label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                {...formik.getFieldProps("pincode")}
                placeholder="Pin Code"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.pincode && formik.errors.pincode && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.pincode}
                </p>
              )}
            </div>
            {/* locality */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="locality"
                  className="block text-sm font-medium text-gray-700"
                >
                  locality
                </label>
                <input
                  type="text"
                  id="locality"
                  name="locality"
                  {...formik.getFieldProps("locality")}
                  placeholder="locality"
                  className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.locality && formik.errors.locality && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.locality}
                  </p>
                )}
              </div>
              {/* landmark */}
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  landmark
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  {...formik.getFieldProps("landmark")}
                  placeholder="landmark"
                  className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.landmark && formik.errors.landmark && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.landmark}
                  </p>
                )}
              </div>
            </div>
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                id="address"
                rows={2}
                name="address"
                {...formik.getFieldProps("address")}
                placeholder="House No, Building, Street, Area"
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.address}
                </p>
              )}
            </div>

            {/* City and State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  {...formik.getFieldProps("city")}
                  placeholder="City"
                  className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.city}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  {...formik.getFieldProps("state")}
                  placeholder="State"
                  className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.state && formik.errors.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.state}
                  </p>
                )}
              </div>
            </div>

            {/* Address Type */}
            <div>
              <label
                htmlFor="addressType"
                className="block text-sm font-medium text-gray-700"
              >
                Address Type
              </label>
              <select
                id="addressType"
                name="addressType"
                {...formik.getFieldProps("addressType")}
                className="mt-1 w-full p-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="" disabled>
                  Select Address Type
                </option>
                <option value="home">Home</option>
                <option value="work">Work</option>
                {/* <option value="other">Other</option> */}
              </select>
              {formik.touched.addressType && formik.errors.addressType && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.addressType}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white rounded-lg ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Saving..." : "Save Address"}
            </button>

            {/* Display server-side error messages */}
            {errorMessages && (
              <div className="mt-3 text-red-600 text-xs text-center">
                {errorMessages}
              </div>
            )}
          </form>
        </div>
      </Modal>
    </div>
  );
};

export { AddAddressModal, EditAddressModal, AddressDeleteModal };
