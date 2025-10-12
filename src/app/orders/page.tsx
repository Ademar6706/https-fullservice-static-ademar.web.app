'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/lib/firebase/client-provider';
import { listOrders } from '@/lib/actions';
import type { FormData } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Home, ListOrdered, ArrowUpDown, Loader2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Order = Partial<FormData> & { id: string };
type SortKey = 'folio' | 'customerName' | 'orderDate' | 'total';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'orderDate', direction: 'descending' });
  const router = useRouter();
  const db = useFirestore();

  useEffect(() => {
    if (!db) return;
    
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const ordersData = await listOrders(db);
        setOrders(ordersData as Order[]);
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [db]);

  const sortedAndFilteredOrders = useMemo(() => {
    let filteredOrders = orders.filter(order =>
      (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.folio?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.make?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.model?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      filteredOrders.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        let comparison = 0;
        if (aValue > bValue) {
          comparison = 1;
        } else if (aValue < bValue) {
          comparison = -1;
        }

        return sortConfig.direction === 'descending' ? comparison * -1 : comparison;
      });
    }
    return filteredOrders;
  }, [orders, searchTerm, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/view?id=${orderId}`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl">
        <header className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ListOrdered className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary font-headline">Órdenes de Servicio</h1>
              <p className="text-lg text-muted-foreground">Consulta el historial de órdenes guardadas.</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/reception">
              <Home className="mr-2 h-4 w-4" />
              Volver a la Recepción
            </Link>
          </Button>
        </header>

        <Card className="shadow-2xl">
          <CardHeader>
             <div className="flex justify-between items-center">
                <div>
                    <CardTitle>Historial de Órdenes</CardTitle>
                    <CardDescription>
                        Aquí puedes ver, buscar y ordenar las órdenes de servicio.
                    </CardDescription>
                </div>
                <div className="w-full max-w-sm">
                    <Input
                        placeholder="Buscar por cliente, folio o vehículo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
             </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => requestSort('folio')} className="cursor-pointer">
                      <div className="flex items-center">Folio {getSortIndicator('folio')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('customerName')} className="cursor-pointer">
                      <div className="flex items-center">Cliente {getSortIndicator('customerName')}</div>
                    </TableHead>
                    <TableHead>Vehículo</TableHead>
                    <TableHead onClick={() => requestSort('orderDate')} className="cursor-pointer text-right">
                       <div className="flex items-center justify-end">Fecha {getSortIndicator('orderDate')}</div>
                    </TableHead>
                    <TableHead onClick={() => requestSort('total')} className="cursor-pointer text-right">
                      <div className="flex items-center justify-end">Total {getSortIndicator('total')}</div>
                    </TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex justify-center items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Cargando órdenes...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : sortedAndFilteredOrders.length > 0 ? (
                    sortedAndFilteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Badge variant="secondary">{order.folio}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell>{`${order.year} ${order.make} ${order.model}`}</TableCell>
                        <TableCell className="text-right">{order.orderDate}</TableCell>
                        <TableCell className="text-right font-semibold">${(order.total || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order.id)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver Orden</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No se encontraron órdenes.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
