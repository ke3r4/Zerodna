import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function About() {
  // Apply scroll animations to this page
  useScrollAnimation();
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-zerodna-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in-on-scroll">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About ZeroDNA
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              ZeroDNA is not just a company — it's a dynamic ecosystem of advanced AI and technology ventures, 
              built to redefine the future through intelligent, intuitive, and seamless solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in-on-scroll space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">The Philosophy of 1×0</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  The name ZeroDNA is a carefully crafted fusion of mathematical, biological, and technological symbolism. 
                  Zero represents the beginning — a state of pure potential, while DNA symbolizes the intelligent core 
                  that defines all advanced systems.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our philosophy: <strong>1 × 0 = 0</strong> — real innovation doesn't come from surface-level value, 
                  but from redefining value at its root. We start at zero and build meaningful systems through precise, 
                  intelligent design.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-zerodna-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-lightbulb text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Innovation from Zero</h4>
                    <p className="text-gray-600">Starting from the foundation to build truly revolutionary solutions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-zerodna-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-dna text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Intelligent Core</h4>
                    <p className="text-gray-600">DNA-like structured systems that adapt and evolve with your needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-zerodna-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-infinity text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Endless Evolution</h4>
                    <p className="text-gray-600">Continuous improvement and adaptation for future-ready solutions.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="fade-in-on-scroll fade-in-delayed relative">
              <div className="bg-gradient-to-br from-zerodna-blue to-blue-700 rounded-2xl p-8 text-white">
                <div className="text-center space-y-8">
                  <div className="text-6xl font-bold">1 × 0</div>
                  <div className="text-4xl font-light">=</div>
                  <div className="text-6xl font-bold">0</div>
                  <div className="text-sm opacity-80 max-w-xs mx-auto">
                    From zero comes infinite possibility. This is where true innovation begins.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Name Inspiration Section */}
      <section className="py-20 bg-zerodna-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in-on-scroll text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Name Inspiration</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in-on-scroll space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                The name ZeroDNA is deeply rooted in the legacy of scientific discovery — inspired by the 
                groundbreaking contributions of the 9th-century Arab mathematician Al-Khwarizmi, the father 
                of algebra and the man who introduced the world to the concept of the zero.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Zero, once a revolutionary idea, became the foundation for modern mathematics, computing, 
                and digital technology. It transformed how we calculate, measure, and design systems — 
                enabling everything from algorithms to artificial intelligence.
              </p>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                By combining "Zero" with "DNA", the name reflects a philosophy where innovation starts 
                at the core — from the most fundamental building block — and evolves into intelligent, 
                adaptive systems. Just as zero reshaped the course of science, ZeroDNA aims to redefine 
                the relationship between humans and technology.
              </p>
            </div>
            
            <div className="fade-in-on-scroll fade-in-delayed bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-zerodna-blue rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold text-white">0</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">The Power of Zero</h3>
                <p className="text-gray-600">
                  From Al-Khwarizmi's mathematical revolution to modern AI — the journey from zero to infinite possibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="fade-in-on-scroll text-center p-8">
              <div className="w-16 h-16 bg-zerodna-blue rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-eye text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To craft intelligent, intuitive, and seamless solutions that elevate everyday experiences, 
                creating a future where technology meets elegance and intelligence becomes effortless.
              </p>
            </div>
            
            <div className="fade-in-on-scroll fade-in-delayed text-center p-8">
              <div className="w-16 h-16 bg-zerodna-blue rounded-xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-bullseye text-2xl text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                Through the power of innovation and state-of-the-art tools, we deliver cutting-edge 
                technologies designed for comfort, efficiency, and impact across healthcare, automation, 
                and manufacturing industries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
