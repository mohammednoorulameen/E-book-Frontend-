import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {
  useAddOfferMutation,
  useGetCategoryQuery,
  useGetProductsQuery,
} from "../../../../Services/Apis/AdminApi";

const validationSchema = Yup.object().shape({
  offerName: Yup.string()
    .max(20, "Offer name cannot exceed 20 characters")
    .required("Offer name is required"),
  offerType: Yup.string()
    .max(20, "offer code cannot exceed 20 characters")
    .required("select offer type code is required"),
  discountValue: Yup.number()
    .positive("Discount amount must be greater than zero")
    .required("Discount amount is required"),
  startDate: Yup.date().required("Start date is required"),
  expireDate: Yup.date()
    .min(Yup.ref("startDate"), "Expire date must be after the start date")
    .required("Expire date is required"),
  description: Yup.string()
    .max(100, "Description cannot exceed 100 characters")
    .required("Description is required"),
});

const AdminAddOffers = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [discountTarget, setDiscountTarget] = useState("");
  const [applicableData, setApplicableData] = useState([]);
  const [AddOffer] = useAddOfferMutation();
  const { data } = useGetCategoryQuery({ page: 1, limit: 10 });
  const { data: products } = useGetProductsQuery({
    page: 1,
    limit: 10,
  });

  const formik = useFormik({
    initialValues: {
      offerName: "",
      offerType: "",
      discountValue: "",
      discountTarget: "",
      targets: [],
      startDate: "",
      expireDate: "",
      description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const offerData = {
          ...values,
          targets: selectedTargets,
        };

        console.log("values", offerData);
        const response = await AddOffer(offerData);
        if (response.data) {
          alert("Offer added successfully!");
          navigate("/admin/offers");
        }
      } catch (error) {
        alert("Failed to add offer. Please try again.");
        console.error("Error adding offer:", error);
      }
    },
  });

  useEffect(() => {
    if (discountTarget === "Category") {
      setApplicableData(data.categoryData || []);
    } else if (discountTarget === "Product") {
      setApplicableData(products.products || []);
    } else {
      setApplicableData([]);
    }
  }, [discountTarget, data, products]);

  const handleCheckboxChange = (id) => {
    console.log("id", id);

    setSelectedTargets((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((targetId) => targetId !== id)
        : [...prevSelected, id]
    );
  };

  console.log("applicableData", applicableData);
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">ADD - OFFERS</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Offer Name</label>
          <input
            type="text"
            id="offerName"
            name="offerName"
            value={formik.values.offerName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Offer Name"
          />
          {formik.touched.offerName && formik.errors.offerName && (
            <div className="text-red-600">{formik.errors.offerName}</div>
          )}
        </div>

        {/* Price, Stock, Color Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Offer Type</label>
            <select
              id="offerType"
              name="offerType"
              value={formik.values.offerType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                Select Offer Type
              </option>
              <option value="fixed">cash</option>
              <option value="percentage">persentage</option>
            </select>
            {formik.touched.offerType && formik.errors.offerType && (
              <div className="text-red-600">{formik.errors.offerType}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Amount
            </label>
            <input
              type="number"
              name="discountValue"
              value={formik.values.discountValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Minimum Amount"
            />
            {formik.touched.discountValue && formik.errors.discountValue && (
              <div className="text-red-600">{formik.errors.discountValue}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Applicable</label>

            <select
              id="discountTarget"
              name="discountTarget"
              value={formik.values.discountTarget}
              onChange={(e) => {
                formik.handleChange(e); 
                setDiscountTarget(e.target.value); 
              }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                Select Applicability
              </option>
              <option value="Category">Category</option>
              <option value="Product">Product</option>
            </select>
          </div>

          {/* Choose Field (Dynamic Rendering of Checkboxes) */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Choose</label>
            <div
              onClick={toggleDropdown}
              className="w-full px-4 py-2 border rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {selectedTargets.length > 0
                ? `Selected ${selectedTargets.length} item(s)`
                : discountTarget === "Category"
                ? "Select Category"
                : "Select Products"}
            </div>

            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                <div className="space-y-2 p-2">
                  {discountTarget === "Product"
                    ? applicableData.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={item._id}
                            checked={selectedTargets.includes(item._id)}
                            onChange={() => handleCheckboxChange(item._id)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <label htmlFor={item._id} className="text-sm">
                            {item.productName}
                          </label>
                        </div>
                      ))
                    : applicableData.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={item._id}
                            checked={selectedTargets.includes(item._id)}
                            onChange={() => handleCheckboxChange(item._id)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <label htmlFor={item._id} className="text-sm">
                            {item.category}
                          </label>
                        </div>
                      ))}
                </div>
                <div className="px-4 py-2 text-right">
                  <button
                    type="submit"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-2">Applicable</label>
            <select
              id="discountTarget"
              name="discountTarget"
              value={formik.values.discountTarget}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                Select Applicability
              </option>
              <option value="Category" onClick={()=> setApplicable(Category)}>Category</option>
              <option value="Product" onClick={()=> setApplicable(Product)}>Product</option>
            </select>
            {formik.touched.Offer && formik.errors.Offer && (
              <div className="text-red-600">{formik.errors.Offer}</div>
            )}
          </div>

          <div>
          <label className="block text-sm font-medium mb-2">Choose</label>
          <select
            name="targets"
            value={formik.values.targets}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Select
            </option>
            {applicableData.map((item, index) => (
              <option key={index} value={item.id || item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
 */}

          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="Date"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Price"
            />
            {formik.touched.startDate && formik.errors.startDate && (
              <div className="text-red-600">{formik.errors.startDate}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Expire Date
            </label>
            <input
              type="Date"
              name="expireDate"
              value={formik.values.expireDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Price"
            />
            {formik.touched.expireDate && formik.errors.expireDate && (
              <div className="text-red-600">{formik.errors.expireDate}</div>
            )}
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <input
            type="textarea"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Description"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-600">{formik.errors.description}</div>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add Offer
        </button>
      </form>
    </div>
  );
};

export default AdminAddOffers;
