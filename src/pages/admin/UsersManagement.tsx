
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, MoreHorizontal, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserSummary } from '@/types';

const UsersManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for user list
  const mockUsers: UserSummary[] = [
    {
      id: '1',
      fullName: 'Jane Cooper',
      email: 'jane.cooper@example.com',
      role: ['disciple'],
      status: 'active',
      joinDate: '2023-01-10',
      planType: 'Monthly'
    },
    {
      id: '2',
      fullName: 'Wade Warren',
      email: 'wade.warren@example.com',
      role: ['mentor'],
      status: 'active',
      joinDate: '2023-02-15',
      planType: 'Yearly'
    },
    {
      id: '3',
      fullName: 'Esther Howard',
      email: 'esther.howard@example.com',
      role: ['disciple'],
      status: 'pending',
      joinDate: '2023-03-20'
    },
    {
      id: '4',
      fullName: 'Cameron Williamson',
      email: 'cameron.williamson@example.com',
      role: ['admin'],
      status: 'active',
      joinDate: '2023-01-05',
      planType: 'Lifetime'
    },
    {
      id: '5',
      fullName: 'Brooklyn Simmons',
      email: 'brooklyn.simmons@example.com',
      role: ['disciple'],
      status: 'suspended',
      joinDate: '2023-02-22',
      planType: 'Monthly'
    }
  ];

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status badge colors
  const getStatusColor = (status: 'active' | 'suspended' | 'pending') => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      {user.role.includes('admin') ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Admin
                        </Badge>
                      ) : user.role.includes('mentor') ? (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                          Mentor
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                          Disciple
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(user.status)} text-white`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.planType ? (
                        <Badge variant="outline">
                          {user.planType}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>Change Plan</DropdownMenuItem>
                          {user.status === 'active' ? (
                            <DropdownMenuItem className="text-yellow-600">
                              Suspend Account
                            </DropdownMenuItem>
                          ) : user.status === 'suspended' ? (
                            <DropdownMenuItem className="text-green-600">
                              Reactivate Account
                            </DropdownMenuItem>
                          ) : null}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
