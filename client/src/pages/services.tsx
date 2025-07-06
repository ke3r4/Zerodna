import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Services() {
  // Apply scroll animations to this page
  useScrollAnimation();
  const services = [
    {
      icon: "fas fa-heartbeat",
      title: "HealthTech Solutions",
      description: "Revolutionary AI-powered healthcare solutions that enhance patient care, streamline medical processes, and provide predictive analytics for better health outcomes.",
      features: [
        "Diagnostic AI Systems",
        "Patient Monitoring",
        "Predictive Analytics",
        "Treatment Optimization",
        "Medical Imaging Analysis",
        "Electronic Health Records Integration"
      ],
      benefits: [
        "Improved diagnostic accuracy",
        "Reduced healthcare costs",
        "Enhanced patient outcomes",
        "Streamlined clinical workflows"
      ]
    },
    {
      icon: "fas fa-cogs",
      title: "Automation Systems",
      description: "Intelligent automation solutions that optimize workflows, reduce manual tasks, and increase operational efficiency across all business processes.",
      features: [
        "Process Automation",
        "Workflow Optimization",
        "Smart Decision Making",
        "Quality Assurance",
        "Robotic Process Automation",
        "Intelligent Document Processing"
      ],
      benefits: [
        "Increased operational efficiency",
        "Reduced human error",
        "Cost savings through automation",
        "Scalable business processes"
      ]
    },
    {
      icon: "fas fa-industry",
      title: "Manufacturing Intelligence",
      description: "Advanced manufacturing solutions powered by AI to optimize production lines, predict maintenance needs, and ensure consistent quality control.",
      features: [
        "Production Optimization",
        "Predictive Maintenance",
        "Quality Control AI",
        "Supply Chain Intelligence",
        "Digital Twin Technology",
        "Real-time Monitoring Systems"
      ],
      benefits: [
        "Minimized downtime",
        "Improved product quality",
        "Optimized resource utilization",
        "Enhanced supply chain visibility"
      ]
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-zerodna-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-on-scroll">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              AI Solutions Across Industries
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our intelligent, adaptive solutions are engineered to transform healthcare, automation, 
              and manufacturing through cutting-edge AI technology that adapts, evolves, and empowers.
            </p>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div key={index} className={`fade-in-on-scroll grid lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-reverse' : ''
              }`}>
                <div className="space-y-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-zerodna-blue rounded-xl flex items-center justify-center">
                      <i className={`${service.icon} text-2xl text-white`}></i>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">{service.title}</h2>
                  </div>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <i className="fas fa-check text-zerodna-blue"></i>
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="bg-zerodna-blue text-white hover:bg-blue-700">
                    Learn More About {service.title}
                  </Button>
                </div>
                
                <Card className="shadow-lg">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Benefits</h3>
                    <div className="space-y-4">
                      {service.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-zerodna-blue rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-600">{benefit}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-zerodna-light rounded-lg">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-zerodna-blue mb-2">99.9%</div>
                        <p className="text-sm text-gray-600">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-zerodna-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-on-scroll text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Technology Stack</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on cutting-edge technologies and frameworks for maximum performance and scalability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: "fas fa-brain", name: "Machine Learning", desc: "Advanced ML algorithms" },
              { icon: "fas fa-robot", name: "Deep Learning", desc: "Neural network architectures" },
              { icon: "fas fa-cloud", name: "Cloud Computing", desc: "Scalable cloud infrastructure" },
              { icon: "fas fa-database", name: "Big Data", desc: "Large-scale data processing" },
              { icon: "fas fa-network-wired", name: "IoT Integration", desc: "Connected device ecosystems" },
              { icon: "fas fa-shield-alt", name: "Cybersecurity", desc: "Enterprise-grade security" },
              { icon: "fas fa-chart-line", name: "Analytics", desc: "Real-time data insights" },
              { icon: "fas fa-microchip", name: "Edge Computing", desc: "Distributed processing" }
            ].map((tech, index) => (
              <Card key={index} className={`fade-in-on-scroll ${index % 2 === 1 ? 'fade-in-delayed' : ''} text-center hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-zerodna-blue rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className={`${tech.icon} text-white`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tech.name}</h3>
                  <p className="text-sm text-gray-600">{tech.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-on-scroll">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Let's discuss how ZeroDNA can create intelligent solutions tailored to your industry needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-zerodna-blue text-white hover:bg-blue-700 px-8 py-4">
                Start Your Project
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4"
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
