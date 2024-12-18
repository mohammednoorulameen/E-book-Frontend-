import Modal from "react-modal";
import { Button, Box, Typography,TextField } from "@mui/material";
import { useState } from "react";
Modal.setAppElement("#root");


/**
 * order cancel modal
 */

const OrderCancelModal = ({ isOpen, onClose, onSubmit }) => {
    return (
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
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-6"
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Are you sure you want to cancel this product?
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Once cancelled, you won’t be able to recover this order.
          </Typography>
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button color="error" onClick={onSubmit}>
              Yes, Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  };
  

  /**
   * order return modal
   */
  
  const OrderReturnModal = ({isOpen,onClose,onSubmit}) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const HandleSubmit = () =>{
     if (input.trim() == "") {
          setError(true)
        }else{
          onSubmit(input)
          setError(false)
          onClose()
          console.log("Form submitted successfull");
          
        }
  }

    return (
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
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-6"
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Are you sure you want to return this product?
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }} component="div">
           <Box>
            <TextField
            label="Reason for return"
            variant="outlined"
            value={input}
            onChange={(e)=> setInput( e.target.value)}
            error={error}
            helperText={error ? "this field is required" : ""}
            sx={{ width: '100%' }}
            />
              
           </Box>
          </Typography>
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button color="return" onClick={HandleSubmit}>
              Yes, Return
            </Button>
          </Box>
        </Box>
      </Modal>
    )
  }
  


  export { OrderCancelModal, OrderReturnModal };
  


