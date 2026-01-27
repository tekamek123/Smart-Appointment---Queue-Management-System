import { Card, CardContent } from '@/components/ui/card';

export function StatsSection() {
  const stats = [
    {
      number: '250+',
      label: 'Expert Doctors',
      description: 'Highly qualified medical professionals'
    },
    {
      number: '30K+',
      label: 'Happy Patients',
      description: 'Trusted by thousands of patients'
    },
    {
      number: '15+',
      label: 'Years Experience',
      description: 'Decades of healthcare excellence'
    },
    {
      number: '95%',
      label: 'Success Rate',
      description: 'Outstanding treatment outcomes'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our commitment to excellence has made us a leading healthcare provider
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>
                <p className="text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
