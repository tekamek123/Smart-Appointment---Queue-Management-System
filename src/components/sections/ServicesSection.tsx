import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function ServicesSection() {
  const services = [
    {
      title: 'General Medicine',
      description: 'Comprehensive primary care services for all ages',
      icon: '🏥',
      features: ['Regular checkups', 'Preventive care', 'Health screenings'],
      badge: 'Popular'
    },
    {
      title: 'Cardiology',
      description: 'Advanced heart care and cardiovascular treatments',
      icon: '❤️',
      features: ['ECG & Echocardiogram', 'Stress tests', 'Cardiac rehabilitation'],
      badge: 'Expert'
    },
    {
      title: 'Pediatrics',
      description: 'Specialized healthcare for children and infants',
      icon: '👶',
      features: ['Vaccinations', 'Growth monitoring', 'Child development'],
      badge: 'Family'
    },
    {
      title: 'Orthopedics',
      description: 'Bone and joint care with modern treatments',
      icon: '🦴',
      features: ['Joint replacement', 'Sports medicine', 'Fracture care'],
      badge: 'Advanced'
    },
    {
      title: 'Dermatology',
      description: 'Skin care and cosmetic treatments',
      icon: '🌟',
      features: ['Acne treatment', 'Skin cancer screening', 'Cosmetic procedures'],
      badge: 'Cosmetic'
    },
    {
      title: 'Neurology',
      description: 'Comprehensive neurological care and treatments',
      icon: '🧠',
      features: ['EEG testing', 'Migraine treatment', 'Stroke care'],
      badge: 'Specialized'
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Medical Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare services with modern technology and experienced professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{service.icon}</div>
                  <Badge variant="secondary">{service.badge}</Badge>
                </div>
                <CardTitle className="text-xl text-gray-900">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <svg className="h-4 w-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
