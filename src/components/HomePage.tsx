import { Link } from 'wouter';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Code, Gamepad2, Globe, Smartphone, CheckCircle2, Users, Shield } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl">Find Your Perfect Developer</h1>
            <p className="text-xl opacity-90">
              Nomad connects you with skilled developers for your Roblox games, websites, 
              applications, and more. Professional talent, seamless collaboration.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20 hover:text-white">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 dark:text-white">Developer Types We Offer</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Access a diverse pool of talented developers specialized in various technologies and platforms
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <Gamepad2 className="size-10 text-blue-600 mb-2" />
                <CardTitle className="dark:text-white">Roblox Developers</CardTitle>
                <CardDescription className="dark:text-gray-400">Expert game developers for your Roblox projects</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <Globe className="size-10 text-green-600 mb-2" />
                <CardTitle className="dark:text-white">Web Developers</CardTitle>
                <CardDescription className="dark:text-gray-400">Full-stack and frontend web development</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <Smartphone className="size-10 text-purple-600 mb-2" />
                <CardTitle className="dark:text-white">App Developers</CardTitle>
                <CardDescription className="dark:text-gray-400">Mobile and desktop application experts</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <Code className="size-10 text-orange-600 mb-2" />
                <CardTitle className="dark:text-white">Full Stack</CardTitle>
                <CardDescription className="dark:text-gray-400">End-to-end development solutions</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4 dark:text-white">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get matched with the perfect developer in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl dark:text-white">Submit Your Project</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tell us about your project requirements, timeline, and budget through our simple form
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-purple-600 dark:text-purple-400">2</span>
              </div>
              <h3 className="text-xl dark:text-white">Get Matched</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our team reviews your request and assigns the perfect developer for your needs
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl text-green-600 dark:text-green-400">3</span>
              </div>
              <h3 className="text-xl dark:text-white">Start Building</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Collaborate with your assigned developer and bring your vision to life
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-4 dark:text-white">Why Choose Nomad?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <CheckCircle2 className="size-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg mb-2 dark:text-white">Vetted Professionals</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All our developers are carefully screened and verified for quality
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Users className="size-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg mb-2 dark:text-white">Perfect Matching</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We match you with developers who specialize in your project type
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Shield className="size-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg mb-2 dark:text-white">Secure & Reliable</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Professional project management with transparent 20% commission
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <CheckCircle2 className="size-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <div>
                  <h3 className="text-lg mb-2 dark:text-white">Quality Guarantee</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We ensure high-quality deliverables that meet your expectations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl">Ready to Start Your Project?</h2>
            <p className="text-xl opacity-90">
              Join hundreds of satisfied clients who found their perfect developer through Nomad
            </p>
            <Link href="/signup">
              <Button size="lg" variant="secondary">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}