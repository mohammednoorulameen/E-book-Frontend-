import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaFileExport,
  FaFileImport,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useAddCategoryMutation,
  useGetCategoryQuery,
  useBlockCategoryMutation,
  useEditCategoryMutation,
} from "../../../../Services/Apis/AdminApi";

const validationSchema = Yup.object().shape({
  category: Yup.string()
    .max(20, "character limit")
    // .matches(/^\S*$/,)
    .required("category is required"),
  description: Yup.string()
    .max(30, "character limit")
    // .matches(/^\S*$/)
    .required("description is required"),
});

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [categoryList, SetCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [addCategory, { isSuccess, isError }] = useAddCategoryMutation();
  const { data, refetch, isLoading, iserror } = useGetCategoryQuery({
    page: currentPage,
    limit: 10,
  });
  const [blockCategory] = useBlockCategoryMutation();
  const [EditCategory] = useEditCategoryMutation();

  /**
   *  handle change page and take totalPage
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const totalPage = data?.totalPage;

  /*
  Edit category
  */

  const handleEditCategory = (id) => {
    const CategoryToEdit = categoryList.find((caregory) => caregory._id === id);
    setSelectedCategory(CategoryToEdit);
    // setIsEditing(true);
    formik.setValues({
      category: CategoryToEdit.category,
      description: CategoryToEdit.description,
    });
  };

  /*
  getting the category list
   */

  useEffect(() => {
    if (data && data.categoryData) {
      SetCategoryList([...data.categoryData]);
    }
  }, [data]);

  /*
  add and update category form 
  */
  const formik = useFormik({
    initialValues: {
      category: "",
      description: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (categoryData, { resetForm }) => {
      const response = selectedCategory
        ? await EditCategory({ ...categoryData, id: selectedCategory._id })
        : await addCategory(categoryData);
      if (response?.data) {
        resetForm();
        refetch(); // Refetch
        setSelectedCategory(null);
      }
    },
  });

  const handlecategoryblock = async (id) => {
    try {
      await blockCategory({ id });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          <button
            className={`pb-4 px-2 ${
              activeTab === "products"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("products")}
          >
            Categories
          </button>
          {/* <button
            className={`pb-4 px-2 ${
              activeTab === "categories"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Products
          </button> */}
        </div>

        {/* add caregory  */}
        <form onSubmit={formik.handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Categories</h2>
            {isSuccess && (
              <h4 className="text-green-500">Category successfully addedd </h4>
            )}
            {isError && (
              <h4 className="text-red-500">Category already exist</h4>
            )}
            <div className="flex gap-3">
              <div className="flex flex-col">
                {formik.touched.category && formik.errors.category && (
                  <div className="text-red-500 text-sm mb-1">
                    {formik.errors.category}
                  </div>
                )}

                <input
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="text"
                  placeholder="Category"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                />
              </div>

              <div className="flex flex-col">
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-sm mb-1">
                    {formik.errors.description}
                  </div>
                )}
                <input
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="text"
                  placeholder="Description"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                {selectedCategory ? "Update category" : " Add new category"}
              </button>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6">No</th>
                <th className="text-left py-4 px-6">Category name</th>
                <th className="text-left py-4 px-6">Description</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categoryList.length > 0 ? (
                categoryList.map((caregory, index) => (
                  <tr
                    key={caregory._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="py-4 px-6">{caregory.category}</td>
                    <td className="py-4 px-6">{caregory.description}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handlecategoryblock(caregory._id)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          caregory.status
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {caregory.status ? "Active" : "block"}
                      </button>
                    </td>
                    <td className="py-4 px-9">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategory(caregory._id)}
                          className="text-gray-600 hover:text-indigo-600"
                        >
                          <FaPencilAlt className="w-4 h-4" />
                        </button>
                        {/* <button className="text-gray-600 hover:text-red-600">
                        <FaTrashAlt className="w-4 h-4" />
                      </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-red-400">
                    {Error && "category not found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onPageChannge={handlePageChange}
        />
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPage, onPageChannge }) => {
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex justify-end mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChannge(page)}
          className={`px-3 py-1 mx-1 border rounded ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default ProductManagement;
