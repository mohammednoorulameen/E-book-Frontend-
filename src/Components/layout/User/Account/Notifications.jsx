import React from 'react'
import { Card, CardContent, CardHeader, Button } from "@mui/material";

const Notifications = () => {
  return (
    <div>
         <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Notification Settings</h2>
      <div className="space-y-4">
        {['Email Notifications', 'Push Notifications', 'SMS Notifications'].map((setting) => (
          <Card key={setting}>
            <CardContent className="flex justify-between items-center">
              <p className="font-medium">{setting}</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </div>
  )
}

export default Notifications