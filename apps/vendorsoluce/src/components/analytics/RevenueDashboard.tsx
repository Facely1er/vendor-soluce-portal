// Revenue Analytics Dashboard Component
// File: src/components/analytics/RevenueDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { logger } from '../../utils/logger';

interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  conversionRate: number;
  revenueGrowth: number;
}

interface SubscriptionData {
  id: string;
  customerEmail: string;
  productName: string;
  productType: 'monthly' | 'annual' | 'addon' | 'bundle';
  amount: number;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  createdAt: string;
  currentPeriodEnd: string;
  billingInterval: 'month' | 'year';
}

// interface RevenueChartData {
//   month: string;
//   revenue: number;
//   subscriptions: number;
// }

export const RevenueDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchRevenueData();
  }, [timeRange]);

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      // Simulate API calls - replace with actual Supabase queries
      const mockMetrics: RevenueMetrics = {
        totalRevenue: 125430,
        monthlyRecurringRevenue: 8940,
        annualRecurringRevenue: 107280,
        activeSubscriptions: 47,
        churnRate: 2.3,
        averageRevenuePerUser: 190.2,
        conversionRate: 12.5,
        revenueGrowth: 18.7
      };

      const mockSubscriptions: SubscriptionData[] = [
        {
          id: 'sub_1',
          customerEmail: 'john@company.com',
          productName: 'Professional',
          productType: 'monthly',
          amount: 14900,
          status: 'active',
          createdAt: '2024-01-15',
          currentPeriodEnd: '2024-02-15',
          billingInterval: 'month'
        },
        {
          id: 'sub_2',
          customerEmail: 'sarah@enterprise.com',
          productName: 'Enterprise',
          productType: 'annual',
          amount: 431000,
          status: 'active',
          createdAt: '2024-01-10',
          currentPeriodEnd: '2025-01-10',
          billingInterval: 'year'
        },
        {
          id: 'sub_3',
          customerEmail: 'mike@startup.com',
          productName: 'Starter',
          productType: 'monthly',
          amount: 4900,
          status: 'active',
          createdAt: '2024-01-20',
          currentPeriodEnd: '2024-02-20',
          billingInterval: 'month'
        },
        {
          id: 'sub_4',
          customerEmail: 'lisa@corp.com',
          productName: 'Compliance Suite',
          productType: 'bundle',
          amount: 29900,
          status: 'active',
          createdAt: '2024-01-12',
          currentPeriodEnd: '2024-02-12',
          billingInterval: 'month'
        },
        {
          id: 'sub_5',
          customerEmail: 'david@gov.com',
          productName: 'Federal',
          productType: 'annual',
          amount: 959000,
          status: 'active',
          createdAt: '2024-01-05',
          currentPeriodEnd: '2025-01-05',
          billingInterval: 'year'
        },
        {
          id: 'sub_6',
          customerEmail: 'anna@tech.com',
          productName: 'Additional Users',
          productType: 'addon',
          amount: 1000,
          status: 'active',
          createdAt: '2024-01-18',
          currentPeriodEnd: '2024-02-18',
          billingInterval: 'month'
        }
      ];

      setMetrics(mockMetrics);
      setSubscriptions(mockSubscriptions);
    } catch (error) {
      logger.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount / 100);
  };

  const getProductTypeColor = (productType: string) => {
    switch (productType) {
      case 'monthly': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'annual': return 'bg-green-100 text-green-800 border-green-200';
      case 'addon': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'bundle': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProductTypeIcon = (productType: string) => {
    switch (productType) {
      case 'monthly': return '📅';
      case 'annual': return '📆';
      case 'addon': return '➕';
      case 'bundle': return '📦';
      default: return '📋';
    }
  };

  const formatBillingInterval = (interval: string) => {
    return interval === 'year' ? '/year' : '/month';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading revenue data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Revenue Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your subscription revenue and growth metrics
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchRevenueData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex space-x-2">
        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'primary' : 'outline'}
            onClick={() => setTimeRange(range)}
            size="sm"
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics?.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">MRR</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(metrics?.monthlyRecurringRevenue || 0)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +{metrics?.revenueGrowth}% from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.activeSubscriptions || 0}
                </p>
                <p className="text-sm text-gray-600">
                  {metrics?.churnRate}% churn rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">ARPU</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics?.averageRevenuePerUser || 0)}
                </p>
                <p className="text-sm text-gray-600">
                  {metrics?.conversionRate}% conversion
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       {/* Charts Row */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center">
               <BarChart3 className="h-5 w-5 mr-2" />
               Revenue Trend
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="h-64 flex items-center justify-center text-gray-500">
               Revenue chart would be rendered here
             </div>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle className="flex items-center">
               <PieChart className="h-5 w-5 mr-2" />
               Product Distribution
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="h-64 flex items-center justify-center text-gray-500">
               Product distribution chart would be rendered here
             </div>
           </CardContent>
         </Card>
       </div>

       {/* Product Type Breakdown */}
       <Card>
         <CardHeader>
           <CardTitle className="flex items-center">
             <PieChart className="h-5 w-5 mr-2" />
             Subscription Type Breakdown
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {['monthly', 'annual', 'addon', 'bundle'].map((type) => {
               const typeSubscriptions = subscriptions.filter(sub => sub.productType === type);
               const typeRevenue = typeSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
               const typeCount = typeSubscriptions.length;
               
               return (
                 <div key={type} className="p-4 border rounded-lg">
                   <div className="flex items-center space-x-2 mb-2">
                     <span className="text-2xl">{getProductTypeIcon(type)}</span>
                     <div>
                       <h3 className="font-semibold text-gray-900 capitalize">{type} Subscriptions</h3>
                       <Badge className={`text-xs ${getProductTypeColor(type)}`}>
                         {type.toUpperCase()}
                       </Badge>
                     </div>
                   </div>
                   <div className="space-y-1">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Count:</span>
                       <span className="font-medium">{typeCount}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Revenue:</span>
                       <span className="font-medium">{formatCurrency(typeRevenue)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600">Avg Value:</span>
                       <span className="font-medium">
                         {typeCount > 0 ? formatCurrency(typeRevenue / typeCount) : '$0'}
                       </span>
                     </div>
                   </div>
                 </div>
               );
             })}
           </div>
         </CardContent>
       </Card>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Recent Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Customer
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Product & Type
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Amount
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Billing
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Status
                   </th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     Created
                   </th>
                 </tr>
               </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subscriptions.map((subscription) => (
                  <tr key={subscription.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subscription.customerEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getProductTypeIcon(subscription.productType)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {subscription.productName}
                          </div>
                          <Badge className={`text-xs ${getProductTypeColor(subscription.productType)}`}>
                            {subscription.productType.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(subscription.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        subscription.billingInterval === 'year' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {formatBillingInterval(subscription.billingInterval)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueDashboard;
