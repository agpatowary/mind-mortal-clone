
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Users, CreditCard, Clock, ShieldCheck } from "lucide-react";

const AdminOverview = () => {
  // Mock data for the stats
  const stats = [
    { 
      title: "Total Users", 
      value: "2,468", 
      change: "+12%", 
      description: "From last month", 
      icon: Users 
    },
    { 
      title: "Subscribers", 
      value: "853", 
      change: "+18%", 
      description: "From last month", 
      icon: CreditCard 
    },
    { 
      title: "Recent Activity", 
      value: "428", 
      change: "+7%", 
      description: "From last week", 
      icon: Clock 
    },
    { 
      title: "Admin Actions", 
      value: "67", 
      change: "+2%", 
      description: "From yesterday", 
      icon: ShieldCheck 
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the MMortal admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="text-emerald-500 flex items-center">
                  {stat.change}
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
            <CardDescription>Overview of user activity across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <p>Activity chart will be displayed here</p>
              <p className="text-sm mt-2">Data collection in progress</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Metrics</CardTitle>
            <CardDescription>Current subscription data and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-10 text-muted-foreground">
              <p>Subscription metrics will be displayed here</p>
              <p className="text-sm mt-2">Data collection in progress</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
