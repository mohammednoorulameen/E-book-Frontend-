import React, { useEffect, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaFileExport,
  FaFileImport,
  FaPencilAlt,
  FaTrashAlt,
} from "react-icons/fa";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  MenuItem,
  Select,
  FormControl,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useOrdersListQuery, useChangeOrderStatusMutation, } from "../../../../Services/Apis/AdminApi";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("products");
  const [currentPage, setCurrentPage] = useState(1);
  const [userOrders, setUserOrders] = useState([]);
  const [orderActions, setOrderActions] = useState({});
  const [changeOrderStatus] = useChangeOrderStatusMutation();
  const { data, isLoading, isError, refetch } = useOrdersListQuery({
    page: currentPage,
    limit: 10,
  });
  // console.log('currentPage,total', currentPage,total)
  console.log("data", data);

  const totalPage = data?.totalPage || 1;
  const orderItems = data?.orderItems;
console.log('orderItems', data)


useEffect(() => {
  if (data?.orderItems) {
    const transformedOrders = data.orderItems.map((order) => ({
      userId: order.userDetails._id,
      email: order.userDetails.email,
      username: order.userDetails.username,
      orderDate: new Date(order.items[0]?.itemCreatedAt).toLocaleDateString(),
        productName: order.productDetails.productName,
        productImage:
          order.productDetails.images[0] || "https://via.placeholder.com/100",
        quantity: order.items.quantity,
        price: order.items.price,
        orderStatus: order.items.orderStatus,
        orderId: order.items._id,
        paymentStatus: order.items.payment_status,
      address: `${order.address_id?.address || "N/A"}, ${order.address_id?.city || "N/A"
        }, ${order.address_id?.state || "N/A"}, ${order.address_id?.locality || "N/A"
        }, ${order.address_id?.pincode || "N/A"}, ${order.address_id?.landmark || "N/A"
        }`,
    }));
    setUserOrders(transformedOrders);
  }
}, [data]);

/**
 * change order status
 */

const handleChangeStatus = async (orderId,userId, action) => {
  try {
    const response = await changeOrderStatus({
      user_id: userId,
      order_id: orderId,
      action,
    });

    if (response.data) {
      console.log("Order status changed successfully");
      refetch();
    }
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
};

console.log('userOrders userOrders', userOrders)


  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch();
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Failed to load products. Please try again later.</p>;
  }



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
            Orders
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Orders</h2>
          <div className="flex gap-3">
            <div className="relative">
              <input
                placeholder="Search..."
                className=" border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4 px-6">No</th>
                <th className="text-left py-4 px-6">Image</th>
                <th className="text-left py-4 px-6">Product Name</th>
                <th className="text-left py-4 px-6">Email</th>
                <th className="text-left py-4 px-6">Quantity</th>
                <th className="text-left py-4 px-6">Price</th>
                <th className="text-left py-4 px-6">Status</th>
                <th className="text-left py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
                  <td className="py-4 px-6">
                    <img
                    className="w-10 h-10 object-cover rounded"
                    src={order.productImage} alt="" />
                  </td>
                  <td className="py-4 px-6">{order.productName}</td>
                  <td className="py-4 px-6">{order.email}</td>
                  <td className="py-4 px-6">{order.quantity}</td>
                  <td className="py-4 px-6">₹{order.price}</td>
                  <td className="px-4 py-3 text-right">
                        <p  className={`px-3 py-1 rounded-full text-sm ${
                          order.orderStatus === "Pending"
                            ? "bg-gray-100 text-gray-800"
                            : order.orderStatus === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            :order.orderStatus === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : ""

                          
                        }`}
                      >
                        {order.orderStatus} 
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p  className={`px-3 py-1 rounded-full text-sm ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.paymentStatus} 
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right">

{(order.orderStatus === "Pending" || order.orderStatus === "Shipped") && <FormControl fullWidth>
    <Select
      defaultValue={"Pending"}
      className="rounded-full "
      value={
        orderActions[order.orderId] || order.orderStatus
      }
      onChange={(e) =>
        setOrderActions({
          ...orderActions,
          [order.orderId]: e.target.value,
        })
      }
    >
      <MenuItem
        className="!px-3 !py-1 !m-2 !hover:bg-blue-500 !rounded-full !text-sm !bg-blue-200 !text-green-800"
        value="Pending"
      >
        Pending
      </MenuItem>
      <MenuItem
        className="!px-3 !py-1 !m-2 !hover:bg-blue-500 !rounded-full !text-sm !bg-blue-300 !text-green-800"
        value="Shipped"
      >
        Shipped
      </MenuItem>
      <MenuItem
        className="!px-3 !py-1 !m-2 !hover:bg-blue-500 !rounded-full !text-sm !bg-green-200 !text-green-800"
        value="Delivered"
      >
        Delivered
      </MenuItem>
    </Select>
  </FormControl>}
  <Button
    variant="contained"
    size="small"
    sx={{ mt: 1 }}
    onClick={() =>
      handleChangeStatus(
        order.orderId,
        order.userId,
        orderActions[order.orderId] || order.orderStatus
      )
    }
  >
   {order.orderStatus === "Delivered" ? <span >✔️ Delivered</span> : "Save"}
  </Button>
</td>
                  {/* <td className="py-4 px-6">
                    <button
                      onClick={() => navigate( `/admin/ordersdetails/${userItem.id}`)}
                      className={`px-3 py-1 rounded-full text-sm ${"bg-green-100 text-green-800"}`}
                    >
                      Detailes
                    </button>
                  </td> */}
               
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // Don't render if only one page

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
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


export default AdminProducts;
































