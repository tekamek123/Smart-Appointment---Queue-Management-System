import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Medi<span className="text-teal-500">Schedule</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Your trusted partner for smart healthcare appointments and queue management.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Doctors</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Book Appointment</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">General Medicine</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cardiology</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pediatrics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Orthopedics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Dermatology</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-teal-500" />
                <span className="text-gray-300">+1 234 567 8900</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-teal-500" />
                <span className="text-gray-300">info@medischedule.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-teal-500 mt-1" />
                <span className="text-gray-300">123 Healthcare Ave, Medical City, MC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 MediSchedule. All rights reserved. | 
            <a href="#" className="hover:text-white transition-colors ml-2">Privacy Policy</a> | 
            <a href="#" className="hover:text-white transition-colors ml-2">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
