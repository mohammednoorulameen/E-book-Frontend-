import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { Button, Typography } from "@mui/material";

const Setting = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Account Settings</h2>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Typography>Language Preference</Typography>
          </CardHeader>
          <CardContent>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Typography>Time Zone</Typography>
          </CardHeader>
          <CardContent>
            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>UTC-5 (Eastern Time)</option>
              <option>UTC-6 (Central Time)</option>
              <option>UTC-7 (Mountain Time)</option>
              <option>UTC-8 (Pacific Time)</option>
            </select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Typography>Delete Account</Typography>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button variant="contained" color="error" halfWidth>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setting;
