import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Button } from "@mui/material";
import { useGetUserProfileQuery } from '../../../../Services/Apis/UserApi'


const Referrals = () => {

  const { data } = useGetUserProfileQuery();
  const [referdata, setReferData] = useState([]);
  useEffect(() => {
    if (data?.userProfile) {
      const transformation = {
        id: data.userProfile._id,
        name: data.userProfile.username,
        email: data.userProfile.email,
        phone: data.userProfile.phone,
        referralCode: data.userProfile.referralCode,
        referredBy: data.userProfile.referredBy,
        isVerified: data.userProfile.isVerified,
        role: data.userProfile.role,
        createdAt: data.userProfile.createdAt,
      };
      setReferData(transformation)
      console.log("Transformed Data:", transformation);
    }
  }, [data]);
  


  console.log('userdata', data)
  return (
    <div>
       <div className="space-y-6">
       <h2 className="text-2xl font-semibold text-gray-900">Referral Program</h2>
       <Card>
         <CardHeader>
           <h1>Your Referral Code</h1>
         </CardHeader>
         <CardContent>
           <p className="text-2xl font-bold text-blue-600">{referdata?.referralCode}</p>
           <Button className="mt-4">Copy Code</Button>
         </CardContent>
       </Card>
       <h3 className="text-xl font-semibold text-gray-900">Your Referrals</h3>
       <div className="space-y-4">
          {referdata.length > 0 ? (
            referdata.map((referral, index) => (
              <Card key={index}>
             <CardContent className="flex justify-between items-center">
               <div>
                 <p className="font-medium">Friend #{referral}</p>
                 <p className="text-sm text-gray-500">Joined on: {new Date().toLocaleDateString()}</p>
               </div>
               <p className="text-lg font-semibold text-green-600">$100.00 earned</p>
             </CardContent>
           </Card>
            ))
          ) : (
            <p className="text-gray-500">No referrals yet.</p>
          )}
       </div>
     </div>
    </div>
  )
}

export default Referrals