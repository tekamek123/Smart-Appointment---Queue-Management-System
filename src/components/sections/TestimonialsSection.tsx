import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'The online booking system is so convenient! I was able to schedule my appointment within minutes and the doctor was very professional.',
      rating: 5,
      avatar: '👩'
    },
    {
      name: 'Michael Chen',
      role: 'Regular Patient',
      content: 'Excellent healthcare service with modern technology. The queue management system really helped reduce my waiting time.',
      rating: 5,
      avatar: '👨'
    },
    {
      name: 'Emily Davis',
      role: 'Parent',
      content: 'The pediatric care is outstanding. The doctors are very gentle with children and the staff is always helpful.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Robert Wilson',
      role: 'Senior Patient',
      content: 'I appreciate how easy it is to book appointments and the reminders help me never miss my scheduled visits.',
      rating: 5,
      avatar: '👴'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from patients who trust us with their healthcare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
