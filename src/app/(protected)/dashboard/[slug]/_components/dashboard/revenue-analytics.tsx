import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRevenueStats, getRecentPayments } from "@/actions/dashboard/dashboard-actions"

export async function RevenueAnalytics() {
  const [revenueStats, recentPayments] = await Promise.all([getRevenueStats(), getRecentPayments()])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueStats.monthlyRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueStats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.activeSubscriptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueStats.pendingInvoices}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Invoice #{payment.invoice.invoiceNumber}</p>
                  <p className="text-sm text-muted-foreground">{payment.user.email}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">${payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{payment.paymentMethod}</p>
                </div>
                <Badge
                  variant={
                    payment.status === "COMPLETED"
                      ? "default"
                      : payment.status === "PENDING"
                        ? "outline"
                        : payment.status === "FAILED"
                          ? "destructive"
                          : "secondary"
                  }
                >
                  {payment.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
