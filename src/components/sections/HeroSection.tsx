import { BookingForm } from '@/components/booking/BookingForm';

export function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Easy & Fast Online
              <span className="text-blue-600"> Booking</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Access healthcare services effortlessly with our smart appointment system. 
              Book appointments, track queues, and manage your healthcare journey with AI-powered insights.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Booking</h3>
                  <p className="text-sm text-gray-600">Schedule in seconds</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-teal-100 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Available</h3>
                  <p className="text-sm text-gray-600">Anytime, anywhere</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Verified Doctors</h3>
                  <p className="text-sm text-gray-600">Certified professionals</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                  <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fast Service</h3>
                  <p className="text-sm text-gray-600">Minimal waiting time</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium">
                <span className="text-2xl font-bold">15+</span>
                <span className="block text-sm">Years Experience</span>
              </div>
              <div className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium">
                <span className="text-2xl font-bold">250+</span>
                <span className="block text-sm">Expert Doctors</span>
              </div>
              <div className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium">
                <span className="text-2xl font-bold">30K+</span>
                <span className="block text-sm">Happy Patients</span>
              </div>
            </div>
          </div>

          {/* Right Content - Booking Form */}
          <div>
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
