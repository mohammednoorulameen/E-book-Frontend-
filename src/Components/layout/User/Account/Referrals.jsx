import React from 'react'
import { Card, CardContent, CardHeader, Button } from "@mui/material";


const Referrals = () => {
  return (
    <div>
       <div className="space-y-6">
       <h2 className="text-2xl font-semibold text-gray-900">Referral Program</h2>
       <Card>
         <CardHeader>
           <h1>Your Referral Code</h1>
         </CardHeader>
         <CardContent>
           <p className="text-2xl font-bold text-blue-600">USER123</p>
           <Button className="mt-4">Copy Code</Button>
         </CardContent>
       </Card>
       <h3 className="text-xl font-semibold text-gray-900">Your Referrals</h3>
       <div className="space-y-4">
         {[1, 2, 3].map((referral) => (
           <Card key={referral}>
             <CardContent className="flex justify-between items-center">
               <div>
                 <p className="font-medium">Friend #{referral}</p>
                 <p className="text-sm text-gray-500">Joined on: {new Date().toLocaleDateString()}</p>
               </div>
               <p className="text-lg font-semibold text-green-600">$10.00 earned</p>
             </CardContent>
           </Card>
         ))}
       </div>
     </div>
    </div>
  )
}

export default Referrals