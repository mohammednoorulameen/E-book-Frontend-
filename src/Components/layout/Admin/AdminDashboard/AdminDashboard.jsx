

import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  FaShoppingCart,
  FaUserFriends,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  useGetTopProductsQuery,
  useGetTopCategoryQuery,
  useGetGraphDataQuery,
  useGetUserListQuery,
  useGetPlainSalesReportQuery
} from "../../../../Services/Apis/AdminApi";

const AdminDashboard = ({ }) => {


  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [period, setPeriod] = useState('daily')
  const [ GraphData, setGraphData] = useState([])
  const [totalUsers, setTotalUsers] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
  const { data } = useGetTopProductsQuery();
  const { data: salesData} = useGetGraphDataQuery({ period });
  const { data: topCategory } = useGetTopCategoryQuery();
  const { data: usersList } = useGetUserListQuery({
      page: 1,
      limit: 10,
    });
   const { data:salesReport } = useGetPlainSalesReportQuery();

    console.log('salesReportsalesReport', salesReport)

  useEffect(() => {

    /**
     * get sales datas
     */

    if (salesReport) {     
      
      const totalAmount = salesReport.salesReport.reduce(
        (acc, items) => acc + items.items.price,
        0
      );

      const revenue = salesReport.salesReport.reduce(
        (acc, salesData) => acc + (salesData.items?.payableAmount || 0),
        0
      );



      const totalDiscount = totalAmount - revenue;
      setTotalOrders(salesReport.salesReport.length);
      setTotalDiscount(totalDiscount);
      setRevenue(revenue);
      setTotalSales(totalAmount);

    }


   

    /**
     * get user
     */

    if (usersList) {
      setTotalUsers(usersList.totalUsers);
    }

    /**
     * get top products 
     */

    if (data?.topProducts?.length) {
      const transformedProducts = data.topProducts.map((item) => ({
        productName: item.productName,
        orderCount: item.orderCount,
        totalQuantitySelled: item.totalQuantitySelled,
        totalRevenue: item.totalRevenue,
        author: item.author,
        category: item.category
      }));

      setTopProducts(transformedProducts);
    }

   /**
    * get top categories
    */

    if (topCategory?.topCategory?.length) {
      const transformedCategories = topCategory.topCategory.map((item) => ({
        category: item.category,
        totalOrder: item.totalOrder,
        totalQuantitySelled: item.totalQuantitySelled,
        totalRevenue: item.totalRevenue,
      }));
      setTopCategories(transformedCategories);
    }

    /**
     * get graph
     */

    if (salesData?.salesData?.length) {
      const formatedSalesData = salesData.salesData.map((item)=>({
        name : item.name,
        value : item.value,
      }))
      setGraphData(formatedSalesData)
    }

    
  }, [data, topCategory, salesData]);


  // const handleFilterChange = (event) => {
  //   setFilter(event.target.value);
  // };

  const DashboardWidget = ({ icon, title, value, color }) => (
    <div
      className={`bg-white rounded-lg shadow p-4 flex items-center ${color}`}
    >
      <div className="text-3xl mr-4">{icon}</div>
      <div>
        <h3 className="text-gray-600 font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

 
  // Sending to the BarChart component
  <BarChart data={salesData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="value" fill="#8884d8" />
  </BarChart>;
  
  return (
    <Box p={3}>

      <h2 className="text-3xl font-semibold mb-5">Admin Dashboard</h2>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardWidget
          icon={<FaShoppingCart />}
          title="Total Orders"
          value={totalOrders}
          color="text-blue-500"
        />
        <DashboardWidget
          icon={<FaUserFriends />}
          title="Total Users"
          value={totalUsers}
          color="text-green-500"
        />
        <DashboardWidget
          icon={<FaDollarSign />}
          title="Revenue"
          value={`₹${revenue}`}
          color="text-yellow-500"
        />
        <DashboardWidget
          icon={<FaChartLine />}
          title="Total Sales"
          value={`₹${totalSales}`}
          color="text-purple-500"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      ></motion.div>


<Grid item xs={12} md={6}>
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <Card elevation={4}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Sales Analysis
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Explore sales trends with filters for daily, monthly, and yearly data.
        </Typography>
        
        <Box mb={3} display="flex" justifyContent="flex-end">
          <FormControl variant="outlined" size="small">
            <InputLabel>Filter By</InputLabel>
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              label="Filter By"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Bar Chart */}
        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={GraphData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#ccc" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fontWeight: 600 }}
                label={{
                  value: "Categories",
                  position: "insideBottom",
                  dy: 10,
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              />
              <YAxis
                tick={{ fontSize: 12, fontWeight: 600 }}
                label={{
                  value: "Values",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ddd",
                  fontSize: "0.85rem",
                }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Bar dataKey="value" fill="#3f51b5" barSize={25} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
</Grid>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* Best Selling Products */}

        <motion.section
          className="bg-white p-4 rounded shadow"
          initial={{ opacity: 0, y: 50, backgroundColor: "#ffffff" }}
          animate={{ opacity: 1, y: 0, backgroundColor: "#f0f9ff" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold text-lg mb-4">
            Top 10 Best Selling Products
          </h2>
          <ul className="space-y-2">
            {topProducts.map((item, index) => (
              <motion.li
                key={index}
                className="flex justify-between items-center border-b pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="flex-1">
                  <span className="font-bold">{index + 1}. </span>
                  <span className="font-semibold">{item.productName}</span>
                  <span className="block text-sm text-gray-500">
                    {item.category}
                  </span>
                </div>
                <div className="flex-1 text-right">
                  <span className="block">Order count: {item.orderCount}</span>
                  <span className="block">
                    Quantity: {item.totalQuantitySelled}
                  </span>
                  <span className="block">Revenue: ₹{item.totalRevenue}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Best Selling Categories */}

        <motion.section
          className="bg-white p-4 rounded shadow"
          initial={{ opacity: 0, y: 50, backgroundColor: "#ffffff" }}
          animate={{ opacity: 1, y: 0, backgroundColor: "#f0f9ff" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold text-lg mb-4">
            Top 10 Best Selling Categories
          </h2>
          <ul className="space-y-2">
            {topCategories.map((item, index) => (
              <motion.li
                key={index}
                className="flex justify-between items-center border-b pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="flex-1">
                  <span className="font-bold">{index + 1}. </span>
                  <span className="font-semibold"> {item.category}</span>
                  <span className="block text-sm text-gray-500">
                    {item.category}
                  </span>
                </div>
                <div className="flex-1 text-right">
                  <span className="block">Total Orders: {item.totalOrder}</span>
                  <span className="block">
                  Total Quantity Sold: {item.totalQuantitySelled}
                  </span>
                  <span className="block">Total Revenue: ₹{item.totalRevenue}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Best Selling Brands */}
        <motion.section
          className="bg-white p-4 rounded shadow"
          initial={{ opacity: 0, y: 50, backgroundColor: "#ffffff" }}
          animate={{ opacity: 1, y: 0, backgroundColor: "#f0f9ff" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-bold text-lg mb-4">
            Top 10 Best Selling Authors
          </h2>
          <ul className="space-y-2">
            {topProducts.map((item, index) => (
              <motion.li
                key={index}
                className="flex justify-between items-center border-b pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <div className="flex-1">
                  <span className="font-bold">{index + 1}. </span>
                  <span className="font-semibold">{item.author}</span>
                  <span className="block text-sm text-gray-500">
                    {item.category}
                  </span>
                </div>
                <div className="flex-1 text-right">

                  <span className="block">{item.productName}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </div>
    </Box>
  );
};

export default AdminDashboard;
