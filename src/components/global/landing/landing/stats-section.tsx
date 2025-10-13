export function StatsSection() {
  const stats = [
    {
      value: "10,000+",
      label: "Active Users",
      description: "Instagram businesses trust yazzil",
      color: "orange",
    },
    {
      value: "5M+",
      label: "Messages Automated",
      description: "Every single month",
      color: "green",
    },
    {
      value: "300%",
      label: "Avg. Engagement Boost",
      description: "Within first 30 days",
      color: "red",
    },
    {
      value: "24/7",
      label: "Always Active",
      description: "Never miss a customer",
      color: "yellow",
    },
  ]

  const colorClasses: Record<string, string> = {
    orange: "text-orange",
    green: "text-green",
    red: "text-red",
    yellow: "text-yellow",
  }

  return (
    <section className="py-20 lg:py-32 bg-card/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center scroll-reveal" style={{ animationDelay: `${index * 100}ms` }}>
              <div className={`text-4xl lg:text-5xl font-bold ${colorClasses[stat.color]} mb-2`}>{stat.value}</div>
              <div className="text-lg font-semibold mb-1 text-white">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
