import { Formik, useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  useEditProductMutation,
  useGetCategoryQuery,
  useGetEitProductQuery,
} from "../../../../Services/Apis/AdminApi";
import { Upload, Trash2, Crop } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImg } from "../../../../Utils/ImageCrop/ImageCrop";
import { imageUploadCloudinery } from "../../../../Services/Cloudinary/Cloudinary";
import { useNavigate, useParams } from "react-router-dom";

const validationSchema = Yup.object().shape({
  productName: Yup.string()
    .matches(/\S*$/, "Product name cannot contain spaces")
    .required("Product name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than zero")
    .required("Price is required"),
  stock: Yup.number()
    .typeError("Stock must be a number")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  category: Yup.string()
    .matches(/^\S*$/, "Category cannot contain spaces")
    .required("Category is required"),
  description: Yup.string().required("Description is required"),
  publisher: Yup.string()
    .matches(/\S*$/, "Publisher cannot contain spaces")
    .required("Publisher is required"),
  author: Yup.string().required("Author is required"),
  language: Yup.string()
    .matches(/^\S*$/, "Language cannot contain spaces")
    .required("Language is required"),
  // image: Yup.mixed()
  //   .required("File is required")
  //   .test(
  //     "fileType",
  //     "Only image files are allowed (jpeg, png, webp, gif)",
  //     (value) => value && ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(value.type)
  //   ),
});

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { product_id } = useParams();
  const { data: product, refetch } = useGetEitProductQuery({
    product_id: product_id,
  });
  console.log(product);
  const [EditProduct, { isError }] = useEditProductMutation();
  const { data } = useGetCategoryQuery({ page: 1 });
  const [categoryList, SetCategoryList] = useState([]);
  // const [images, setImages] = useState([]);
  const [images, setImages] = useState(product?.product?.images || []);
  const [crop, setCrop] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imagerr, setImagerr] = useState(false);
  const imageRef = useRef(null);
  const [imagepreview, setimagepreview] = useState([]);

  const formik = useFormik({
    initialValues: {
      productName: product?.product?.productName || "",
      price: product?.product?.price || "",
      stock: product?.product?.stock || "",
      category: product?.product?.category || "",
      description: product?.product?.description || "",
      publisher: product?.product?.publisher || "",
      author: product?.product?.author || "",
      language: product?.product?.language || "",
      _id: product?.product?._id || "",
      // images: product?.product?.images || [],
      ...product?.product,
    images: product?.product?.images || [],
    },
    validationSchema: validationSchema,
    
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);

      try {
        const response = await EditProduct(values);
        if (response.data) {
          navigate("/admin/products");
          refetch();
        }
        console.log("Product added successfully:", response);
      } catch (error) {
        console.log(error);
      }
    },
  });

  /**
   * active categories of list
   */

  useEffect(() => {
    if (data && data.categoryData) {
      const activeList = [...data.categoryData].filter(
        (category) => category.status
      );
      SetCategoryList(activeList);
    }
  }, [data]);

  /**
   * image upload
   */

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // formik.setFieldValue('image', [...formik.v alues.image, file]);
      setCurrentImage(URL.createObjectURL(file));
      setCrop(
        centerCrop(
          makeAspectCrop(
            { width: 80, aspect: 4 / 3 },
            imageRef.current.width / imageRef.current.height
          )
        )
      );
    }
  };

  /**
   * handle cropped images add cloudinary set the url of images
   */

  const handleEditCropComplete = async () => {
    if (completedCrop && imageRef.current) {
      const croppedImageURL = await getCroppedImg(
        imageRef.current,
        completedCrop
      );
      const response = await fetch(croppedImageURL);
      const blob = await response.blob();
      const file = new File([blob], "cropped.jpeg", { type: "image/jpeg" });
      const imgUrl = await imageUploadCloudinery(file);
      setImages((prevImages) => [...prevImages, imgUrl]);
      formik.setFieldValue("images", [...formik.values.images, imgUrl]);
      setCurrentImage(null);
      setCrop(null);
    }
  };


  useEffect(() => {
    if (product?.product?.images) {
      setImages(product.product.images);
    }
  }, [product]);


  /**
   * delected image deleting
   */

  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages); // Update local state
    formik.setFieldValue('images', updatedImages); // Update Formik's state
  };

  // ---------------------------

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">UPDATE - PRODUCTS</h1>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formik.values.productName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Product Name"
          />
        </div>
        {formik.touched.productName && formik.errors.productName && (
          <div className="text-red-600">{formik.errors.productName}</div>
        )}
        {/* Price, Stock, Color Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Price"
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-red-600">{formik.errors.price}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formik.values.stock}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Stock"
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className="text-red-600">{formik.errors.stock}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" disabled>
                Select a Category
              </option>
              {categoryList.map((category, index) => (
                <option key={index} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className="text-red-600">{formik.errors.category}</div>
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
        {/* Category, Author, and Language Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2"> Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formik.values.publisher}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Publisher"
            />
            {formik.touched.publisher && formik.errors.publisher && (
              <div className="text-red-600">{formik.errors.publisher}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formik.values.author}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Author"
            />
            {formik.touched.author && formik.errors.author && (
              <div className="text-red-600">{formik.errors.author}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <input
              type="text"
              name="language"
              value={formik.values.language}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Language"
            />
            {formik.touched.language && formik.errors.language && (
              <div className="text-red-600">{formik.errors.language}</div>
            )}
          </div>
        </div>
        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-2">Image</label>

          <input
            type="file"
            name="images"
            id="images"
            multiple
            values={formik.values.images}
            onChange={handleImageUpload}
            onBlur={formik.handleBlur}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            className="px-4 mt-5 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 text-center text-sm"
            onClick={() => document.getElementById("images").click()}
          >
            upload image
          </button>
          {currentImage && (
            <div className="flex flex-col mt-4 ">
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={setCompletedCrop}
              >
                <img
                  ref={imageRef}
                  src={currentImage}
                  alt="preview"
                  onLoad={() => {
                    if (imageRef.current) {
                      setCrop(
                        centerCrop(
                          makeAspectCrop(
                            { width: 80, aspect: 4 / 3 },
                            imageRef.current.width / imageRef.current.height
                          )
                        )
                      );
                    }
                  }}
                />
              </ReactCrop>

              <div className="text-center">
                <button
                  type="button"
                  className="w-1/4 bg-black text-white mt-5 rounded-lg py-3  hover:bg-gray-800 transition-colors"
                  onClick={handleEditCropComplete}
                >
                  Add
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-4 mt-4 overflow-x-auto">
            {images && images.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product image ${index}`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {formik.touched.image && formik.errors.image && (
            <div className="text-red-600">{formik.errors.image}</div>
          )}
          {imagerr && <p className="text-red-500">add three image </p>}
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;
