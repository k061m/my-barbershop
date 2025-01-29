export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-[50vh] bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-8">About Barbier Beirut</h1>
            <p className="text-xl mb-6">
              Welcome to Barbier Beirut, where traditional craftsmanship meets modern style. 
              Established in 2024, we've been dedicated to providing exceptional grooming 
              services to our community.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Expert Barbers</h2>
                <p>Our team of skilled professionals brings years of experience and passion to every cut.</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Premium Services</h2>
                <p>From classic cuts to modern styles, we offer a full range of premium grooming services.</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body items-center text-center">
                <h2 className="card-title">Modern Facility</h2>
                <p>Experience comfort in our state-of-the-art facility equipped with the latest tools.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-base-200 py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Visit Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Location</h3>
                <p>123 Barber Street</p>
                <p>City, State 12345</p>
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Hours</h3>
                  <p>Monday - Friday: 9am - 8pm</p>
                  <p>Saturday: 9am - 6pm</p>
                  <p>Sunday: 10am - 4pm</p>
                </div>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Contact</h3>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@mybarbershop.com</p>
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Social Media</h3>
                  <div className="flex gap-4">
                    <a href="#" className="link link-primary">Facebook</a>
                    <a href="#" className="link link-primary">Instagram</a>
                    <a href="#" className="link link-primary">Twitter</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 