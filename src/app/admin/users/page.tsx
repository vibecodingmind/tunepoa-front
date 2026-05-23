'use client';

import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Eye,
  Pencil,
  Ban,
  Trash2,
  UserPlus,
  ArrowUpDown,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

// ─── Types ────────────────────────────────────────────────────
type UserRole = 'Admin' | 'Manager' | 'Client';
type UserStatus = 'Active' | 'Inactive';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  status: UserStatus;
  joined: string;
  phoneLines: number;
  plan: string;
}

// ─── Mock Data ────────────────────────────────────────────────
const mockUsers: User[] = [
  { id: '1', name: 'Amina Hassan', email: 'amina@vodacom.co.tz', role: 'Client', organization: 'Vodacom Tanzania', status: 'Active', joined: '2025-01-15', phoneLines: 12, plan: 'Pro' },
  { id: '2', name: 'Joseph Mwangi', email: 'joseph@safaricom.ke', role: 'Client', organization: 'Safaricom Kenya', status: 'Active', joined: '2025-02-03', phoneLines: 25, plan: 'Enterprise' },
  { id: '3', name: 'Fatima Abubakar', email: 'fatima@airtel.co.tz', role: 'Client', organization: 'Airtel Tanzania', status: 'Active', joined: '2025-03-10', phoneLines: 5, plan: 'Starter' },
  { id: '4', name: 'David Okafor', email: 'david@mtn.ng', role: 'Client', organization: 'MTN Nigeria', status: 'Inactive', joined: '2024-11-20', phoneLines: 0, plan: 'Starter' },
  { id: '5', name: 'Grace Mrema', email: 'grace@tigo.co.tz', role: 'Client', organization: 'Tigo Tanzania', status: 'Active', joined: '2025-04-01', phoneLines: 8, plan: 'Pro' },
  { id: '6', name: 'Samuel Ndegwa', email: 'samuel@safaricom.ke', role: 'Manager', organization: 'Safaricom Kenya', status: 'Active', joined: '2024-06-15', phoneLines: 3, plan: 'Enterprise' },
  { id: '7', name: 'Maria Kimaro', email: 'maria@vodacom.co.tz', role: 'Client', organization: 'Vodacom Tanzania', status: 'Active', joined: '2025-01-28', phoneLines: 10, plan: 'Pro' },
  { id: '8', name: 'Ahmed Saleh', email: 'ahmed@airtel.co.tz', role: 'Client', organization: 'Airtel Tanzania', status: 'Active', joined: '2025-05-12', phoneLines: 3, plan: 'Starter' },
  { id: '9', name: 'Admin User', email: 'admin@tunepoa.com', role: 'Admin', organization: 'TunePoa HQ', status: 'Active', joined: '2024-01-01', phoneLines: 0, plan: 'Enterprise' },
  { id: '10', name: 'Peter Odhiambo', email: 'peter@telkom.ke', role: 'Client', organization: 'Telkom Kenya', status: 'Inactive', joined: '2024-09-14', phoneLines: 0, plan: 'Starter' },
  { id: '11', name: 'Lucy Mwanyika', email: 'lucy@vodacom.co.tz', role: 'Manager', organization: 'Vodacom Tanzania', status: 'Active', joined: '2024-08-22', phoneLines: 2, plan: 'Pro' },
  { id: '12', name: 'Hassan Juma', email: 'hassan@zantel.co.tz', role: 'Client', organization: 'Zantel Tanzania', status: 'Active', joined: '2025-03-05', phoneLines: 6, plan: 'Pro' },
  { id: '13', name: 'Esther Wambui', email: 'esther@safaricom.ke', role: 'Client', organization: 'Safaricom Kenya', status: 'Active', joined: '2025-04-18', phoneLines: 15, plan: 'Enterprise' },
  { id: '14', name: 'Michael Temu', email: 'michael@airtel.co.tz', role: 'Client', organization: 'Airtel Tanzania', status: 'Inactive', joined: '2024-07-30', phoneLines: 0, plan: 'Starter' },
  { id: '15', name: 'Sarah Msofe', email: 'sarah@tigo.co.tz', role: 'Client', organization: 'Tigo Tanzania', status: 'Active', joined: '2025-02-14', phoneLines: 4, plan: 'Starter' },
  { id: '16', name: 'James Kariuki', email: 'james@safaricom.ke', role: 'Client', organization: 'Safaricom Kenya', status: 'Active', joined: '2025-05-01', phoneLines: 7, plan: 'Pro' },
  { id: '17', name: 'Diana Rwegasira', email: 'diana@vodacom.co.tz', role: 'Manager', organization: 'Vodacom Tanzania', status: 'Active', joined: '2024-10-11', phoneLines: 1, plan: 'Pro' },
  { id: '18', name: 'Ibrahim Musa', email: 'ibrahim@mtn.ng', role: 'Client', organization: 'MTN Nigeria', status: 'Active', joined: '2025-01-07', phoneLines: 20, plan: 'Enterprise' },
  { id: '19', name: 'Catherine Luhanga', email: 'catherine@airtel.co.tz', role: 'Client', organization: 'Airtel Tanzania', status: 'Inactive', joined: '2024-12-19', phoneLines: 0, plan: 'Starter' },
  { id: '20', name: 'Robert Mutiso', email: 'robert@telkom.ke', role: 'Client', organization: 'Telkom Kenya', status: 'Active', joined: '2025-04-25', phoneLines: 9, plan: 'Pro' },
  { id: '21', name: 'Agnes Ndungu', email: 'agnes@safaricom.ke', role: 'Client', organization: 'Safaricom Kenya', status: 'Active', joined: '2025-05-20', phoneLines: 2, plan: 'Starter' },
  { id: '22', name: 'Frank Mbilinyi', email: 'frank@tigo.co.tz', role: 'Client', organization: 'Tigo Tanzania', status: 'Active', joined: '2025-03-30', phoneLines: 11, plan: 'Pro' },
];

// ─── Role badge styles ────────────────────────────────────────
const roleStyles: Record<UserRole, string> = {
  Admin: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Manager: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  Client: 'bg-white/10 text-white/50 border-white/10',
};

const statusStyles: Record<UserStatus, string> = {
  Active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Inactive: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function UserManagementPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Filter data
  const filteredData = useMemo(() => {
    return mockUsers.filter((user) => {
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesRole && matchesStatus;
    });
  }, [roleFilter, statusFilter]);

  // Columns
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-white/40 hover:text-white hover:bg-white/[0.04] -ml-3">
            User <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-white/10">
              <AvatarFallback className="bg-gradient-to-br from-teal-600/40 to-cyan-500/40 text-white text-xs">
                {row.original.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white text-sm font-medium">{row.original.name}</p>
              <p className="text-white/30 text-xs">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <Badge className={roleStyles[row.original.role]}>{row.original.role}</Badge>
        ),
        filterFn: (row, id, value) => value === 'all' || row.original.role === value,
      },
      {
        accessorKey: 'organization',
        header: 'Organization',
        cell: ({ row }) => <span className="text-white/60 text-sm">{row.original.organization}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge className={statusStyles[row.original.status]}>{row.original.status}</Badge>
        ),
      },
      {
        accessorKey: 'joined',
        header: 'Joined',
        cell: ({ row }) => <span className="text-white/40 text-sm">{row.original.joined}</span>,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 bg-[#0f1d32] border-white/[0.08]" align="end">
              <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06]">
                <Eye className="w-4 h-4 mr-2" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06]">
                <Pencil className="w-4 h-4 mr-2" /> Edit Role
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem className="text-amber-400 focus:text-amber-300 focus:bg-white/[0.06]">
                <Ban className="w-4 h-4 mr-2" /> {row.original.status === 'Active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-white/[0.06]">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const activeCount = mockUsers.filter((u) => u.status === 'Active').length;
  const inactiveCount = mockUsers.filter((u) => u.status === 'Inactive').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-white/40 text-sm mt-1">
            {mockUsers.length} total users · {activeCount} active · {inactiveCount} inactive
          </p>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white"
        >
          <UserPlus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search users by name or email..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-teal-500/50 focus:ring-teal-500/20"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
              <Filter className="w-3 h-3 mr-1 text-white/30" />
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
              <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Roles</SelectItem>
              <SelectItem value="Admin" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Admin</SelectItem>
              <SelectItem value="Manager" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Manager</SelectItem>
              <SelectItem value="Client" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Client</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
              <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Status</SelectItem>
              <SelectItem value="Active" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Active</SelectItem>
              <SelectItem value="Inactive" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-white/[0.06]">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-11 px-4 text-left align-middle text-xs font-medium text-white/40 whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-32 text-center text-white/30">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
          <p className="text-white/30 text-xs">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of {filteredData.length} users
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white/40 text-xs px-2">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-[#0a1628] border-white/[0.08] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Full Name</Label>
              <Input placeholder="Enter full name" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Email</Label>
              <Input placeholder="Enter email address" type="email" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Role</Label>
              <Select>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                  <SelectItem value="client" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Client</SelectItem>
                  <SelectItem value="manager" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Manager</SelectItem>
                  <SelectItem value="admin" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Organization</Label>
              <Input placeholder="Enter organization" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Plan</Label>
              <Select>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                  <SelectItem value="starter" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Starter</SelectItem>
                  <SelectItem value="pro" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Pro</SelectItem>
                  <SelectItem value="enterprise" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddDialogOpen(false)} className="text-white/60 hover:text-white hover:bg-white/[0.06]">
              Cancel
            </Button>
            <Button onClick={() => setAddDialogOpen(false)} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
