import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetOfferQuery, useBlockfferMutation } from '../../../../Services/Apis/AdminApi'
import { Try } from "@mui/icons-material";


const AdminOffers = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("products");
  const [currentPage, setCurrentPage] = useState(1);
  const [ offer, setOffer] = useState([])
  const [ Blockffer ] = useBlockfferMutation();
  const {data} = useGetOfferQuery({
    page:currentPage,
    limit:10
  });

  const totalPage = data?.totalPage


  const HandleOfferBlock = (id) =>{
    console.log('id', id)
    try {
      const response = Blockffer({id})
      if (response.data) {
        console.log("successfull")
      }
    } catch (error) {
      console.log(error);
      
    }
  }
 
  useEffect(()=>{
    if (data?.offers) {
      setOffer(data?.offers)
    }
  })
  

   /**
   *  handle change page and take totalPage
   */
   const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <form>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Offers</h2>

            <div className="flex gap-3">
              <div className="relative">
                <input
                  placeholder="Search..."
                  className=" border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={()=> navigate('/admin/add-offers')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Offer
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
                <th className="text-left py-4 px-6">Offer Name</th>
                <th className="text-left py-4 px-6">Description</th>
                <th className="text-left py-4 px-6">Offer type </th>
                <th className="text-left py-4 px-6">Discount Target</th>
                <th className="text-left py-4 px-6">Discount Value</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6"> Action</th>
              </tr>
            </thead>
            <tbody>
              {offer.map((offer, index)=>(

                <tr
                  key={offer._id}
                className="border-b last:border-b-0 hover:bg-gray-50"
                >
                <td className="py-4 px-6">{(currentPage - 1)*10 + index +1}</td>
                <td className="py-4 px-6">{offer.offerName}</td>
                <td className="py-4 px-6">{offer.description}</td>
                <td className="py-4 px-6">{offer.offerType}</td>
                <td className="py-4 px-6">{offer.discountTarget}</td>
                <td className="py-4 px-6">{offer.discountValue}</td>
                <td className="py-4 px-6">
                  <button onClick={()=> HandleOfferBlock(offer._id)} 
                 className={`px-3 py-1 rounded-full text-sm ${
                  offer.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {offer.status ? "Active" : "block"}
              </button>
                </td>
                <td className="py-4 px-9">
                  <div className="flex gap-2">
                    <button className="text-gray-600 hover:text-indigo-600">
                      <FaPencilAlt className="w-4 h-4" />
                    </button>
                    {/* <button className="text-gray-600 hover:text-red-600">
                          <FaTrashAlt className="w-4 h-4" />
                          </button> */}
                  </div>
                </td>
              </tr>
                ))}
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


export default AdminOffers;
