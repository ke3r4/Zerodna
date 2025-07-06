import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Contact() {
  // Apply scroll animations to this page
  useScrollAnimation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    industry: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        industry: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-zerodna-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-on-scroll">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Ready to transform your business with AI? Let's discuss how ZeroDNA can create 
              intelligent solutions tailored to your industry needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="fade-in-on-scroll space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Let's Start a Conversation</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you're looking to optimize healthcare processes, automate manufacturing operations, 
                  or implement intelligent business solutions, our team is here to help bring your vision to life.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-zerodna-blue rounded-lg flex items-center justify-center">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <a href="mailto:zerodna@gmail.com" className="text-gray-600 hover:text-zerodna-blue">
                      zerodna@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-zerodna-blue rounded-lg flex items-center justify-center">
                    <i className="fas fa-phone text-white"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <a href="tel:+4915560734148" className="text-gray-600 hover:text-zerodna-blue">
                      +49 15560 734148
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-zerodna-blue rounded-lg flex items-center justify-center">
                    <i className="fas fa-globe text-white"></i>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Website</div>
                    <a href="https://web.zerodna.com/" className="text-gray-600 hover:text-zerodna-blue">
                      https://web.zerodna.com/
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-zerodna-light rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose ZeroDNA?</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-check text-zerodna-blue"></i>
                    <span>Proven track record with 500+ AI solutions deployed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-check text-zerodna-blue"></i>
                    <span>Industry expertise in healthcare, automation, and manufacturing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-check text-zerodna-blue"></i>
                    <span>24/7 support and 99.9% uptime guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="fas fa-check text-zerodna-blue"></i>
                    <span>Custom solutions tailored to your specific needs</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="fade-in-on-scroll fade-in-delayed shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Your first name"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Your last name"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry" className="text-sm font-semibold text-gray-700">
                      Industry
                    </Label>
                    <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="automation">Automation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us about your project requirements..."
                      rows={4}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-zerodna-blue text-white hover:bg-blue-700 py-3"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Information */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-on-scroll text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Visit Our Innovation Hub</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Located at the heart of technological innovation, our team is ready to welcome you 
              for consultations and project discussions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-zerodna-blue rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-clock text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-zerodna-blue rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-headset text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Emergency technical support</p>
                  <p>Available round the clock</p>
                  <p>Response time: Under 2 hours</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-zerodna-blue rounded-xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-video text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Virtual Meetings</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Online consultations available</p>
                  <p>Flexible scheduling options</p>
                  <p>Global accessibility</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
