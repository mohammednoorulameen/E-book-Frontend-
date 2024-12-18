import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {
  AddAddressModal,
  EditAddressModal,
  AddressDeleteModal,
} from "../../../Modals/AddressModal";
import {
  useAddAddressMutation,
  useGetAddressesQuery,
  useEditAddressMutation,
  useDeleteAddressMutation,
} from "../../../../Services/Apis/UserApi";

const ManageAddress = () => {
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isDeleteAddressModalOpen, setIsDeleteAddressModalOpen] = useState(false);
  const [DeleteAddressId,setDeleteAddressId] =useState()
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");
  const [addresses, setAddress] = useState([]);
  const [getAddress, setGetAddress] = useState();
  const [AddAddress] = useAddAddressMutation();
  const { data, refetch } = useGetAddressesQuery();
  const [EditAddress] = useEditAddressMutation();
  const [DeleteAddress] = useDeleteAddressMutation();


  /**
   * handle add address modal
   */

  const handleOpenAddAddressModal = () => {
    setIsAddAddressModalOpen(true);
  };

  const handleAddAddressCloseModal = () => {
    setIsAddAddressModalOpen(false);
  };

  /**
   * get address deatailes
   */

  useEffect(() => {
    if (data?.addresses) {
      refetch();
      setAddress(data.addresses);
    }
  }, [data]);

  /**
   * handle submit add address modal
   */

  const handleSbmitAddAddress = async (addressData) => {
    setLoading(true);
    try {
      console.log("addressdata", addressData);
      const response = AddAddress(addressData);
      refetch();
      setIsAddAddressModalOpen(false);
      setLoading(false);
    } catch (error) {
      setErrorMessages("Error submit address,please try again");
      setLoading(false);
    }
  };

  /**
   * handle edit address modal
   */

  const handleOpenEditAddressModal = () => {
    setIsEditAddressModalOpen(true);
  };

  const handleEditAddressCloseModal = () => {
    setIsEditAddressModalOpen(false);
  };

  /**
   * get edit address
   */
  const HandleEditAddessDetailes = async (id) => {
    const address = await addresses.find((address) => address._id === id);
    setGetAddress(address);
    setIsEditAddressModalOpen(true);
  };
  /**
   * handle submmit edit address modal
   */

  const handleSubmitEditAddress = async (EditValues) => {
    try {
      console.log("EditValues", EditValues);
      const response = EditAddress(EditValues);
      refetch();
      if (response) {
        setIsEditAddressModalOpen(false);
        console.log("Edit Successfully");
      }
      console.log("EditValues", EditValues);
    } catch (error) {
      setErrorMessages("Error Edit address,please try again");
    }
  };

   /**
   * handle Delete address modal
   */

   const handleOpenDeleteAddressModal = () => {
    setIsDeleteAddressModalOpen(true);
  };

  const handleDeleteAddressCloseModal = () => {
    setIsDeleteAddressModalOpen(false);
  };

  /**
   * get delete address id
   */

  const handleDeleteAddressId = (id)=>{
    setDeleteAddressId(id)
  }
  /**
   * handle delete address 
   */

  const handleSubmitDeleteAddress = async (id) =>{
    try {
      await DeleteAddress({address_id: id})
      refetch();
      setIsDeleteAddressModalOpen(false);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Manage Addresses</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address._id}>
            <h1 className="p-5">{address.addressType}</h1>
            <CardHeader
              title={
                <Typography>
                  {" "}
                  <span className="font-extrabold">
                    {" "}
                    {address.name}, {address.phone}{" "}
                  </span>
                </Typography>
              }
              action={
                <IconButton  onClick={()=> {handleDeleteAddressId(address._id),handleOpenDeleteAddressModal()}} aria-label="delete" color="error">
                  <Delete/>
                </IconButton>
              }
            />
            <CardContent>
              <p>
                {address.address},{" "}
                <span className="font-extrabold">{address.pincode} </span>{" "}
              </p>
              <p>
                {address.state},{address.city}{" "}
              </p>
              <p>
                {" "}
                {address.locality},{address.landmark}{" "}
              </p>
              <p>
                {address.phone} / {address.altPhone}
              </p>
              <Button
                variant="outlined"
                sx={{ marginTop: "20px", paddingTop: "10px" }}
                onClick={() => {
                  HandleEditAddessDetailes(address._id),
                    handleOpenEditAddressModal();
                }}
              >
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* <Button variant="contained" color="primary">Add New Address</Button> */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenAddAddressModal}
      >
        Add New Address
      </Button>
      {/* Modal Component */}
      <AddAddressModal
        isOpen={isAddAddressModalOpen}
        onClose={handleAddAddressCloseModal}
        loading={loading}
        errorMessages={errorMessages}
        onSubmit={handleSbmitAddAddress}
      />
      <EditAddressModal
        isOpen={isEditAddressModalOpen}
        onClose={handleEditAddressCloseModal}
        errorMessages={errorMessages}
        onSubmit={handleSubmitEditAddress}
        addresses={getAddress}
      />
      <AddressDeleteModal 
      isOpen={isDeleteAddressModalOpen}
      onClose={handleDeleteAddressCloseModal}
      onSubmit={handleSubmitDeleteAddress}
      addressId={DeleteAddressId}
      />
    </div>
  );
};

export default ManageAddress;
