import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Button } from "@mui/material";
import { useGetWalletQuery } from "../../../../Services/Apis/UserApi";

const Wallet = () => {
  const [wallet, setWallet] = useState({ balance_amount: 0, data: []})
  const { data } = useGetWalletQuery();

  console.log("wallet data ", data);

  useEffect(()=>{
    if (data?.wallet) {
      setWallet({
        balance_amount: data.wallet.balance_amount,
        data: [...data.wallet.data]
      })
    }
  },[data])
  
  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Wallet</h2>
        <Card>
          <CardHeader>
            <h1>Current Balance</h1>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600"> ₹{wallet.balance_amount}</p>
            <div className="mt-4 space-x-4">
              <Button>Add Funds</Button>
              <Button variant="outline">Withdraw</Button>
            </div>
          </CardContent>
        </Card>
        <h3 className="text-xl font-semibold text-gray-900">
          Recent Transactions
        </h3>
        <div className="space-y-4">
        {wallet.data.length > 0 ? (
          wallet.data.map((transaction, index) => (
            <Card key={transaction._id || index}>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Order ID: {transaction.order_id}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-lg font-semibold text-green-600">
                  ₹{transaction.amount}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;

