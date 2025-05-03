// Pre-made templates for the GrapesJS page builder
// These templates include HTML and CSS for common UI patterns

// Hero Banner template similar to Astra Pro
export const heroBannerTemplate = `
<section class="hero-banner" data-gjs-droppable="false" data-gjs-custom-name="Hero Banner">
  <div class="container">
    <div class="hero-content">
      <h1>Powerful Features for Your Website</h1>
      <p class="hero-subtitle">Build beautiful websites faster with our comprehensive toolkit</p>
      <div class="hero-buttons">
        <a href="#" class="btn btn-primary">Get Started</a>
        <a href="#" class="btn btn-secondary">Learn More</a>
      </div>
    </div>
    <div class="hero-image">
      <img src="https://via.placeholder.com/600x400" alt="Hero Image" />
    </div>
  </div>
  <style>
    .hero-banner {
      background: linear-gradient(135deg, #4a6cf7 0%, #6457c6 100%);
      color: #fff;
      padding: 120px 0;
      position: relative;
      overflow: hidden;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .hero-content {
      flex: 1;
      min-width: 300px;
      padding-right: 40px;
    }
    .hero-image {
      flex: 1;
      min-width: 300px;
      text-align: center;
    }
    .hero-image img {
      max-width: 100%;
      height: auto;
      border-radius: 10px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    h1 {
      font-size: 3.5rem;
      margin-bottom: 20px;
      font-weight: 700;
    }
    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }
    .hero-buttons {
      display: flex;
      gap: 15px;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background-color: #fff;
      color: #4a6cf7;
    }
    .btn-primary:hover {
      background-color: #f1f5ff;
      transform: translateY(-3px);
    }
    .btn-secondary {
      background-color: transparent;
      color: #fff;
      border: 2px solid #fff;
    }
    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }
    @media (max-width: 768px) {
      .container {
        flex-direction: column;
      }
      .hero-content, .hero-image {
        width: 100%;
        padding: 0;
        margin-bottom: 40px;
      }
      h1 {
        font-size: 2.5rem;
      }
      .hero-subtitle {
        font-size: 1.2rem;
      }
    }
  </style>
</section>
`;

// Feature Section template
export const featureSectionTemplate = `
<section class="features-section" data-gjs-droppable="false" data-gjs-custom-name="Feature Section">
  <div class="container">
    <div class="section-header">
      <h2>Powerful Features</h2>
      <p>Everything you need to build amazing websites</p>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <img src="https://via.placeholder.com/80" alt="Feature Icon" />
        </div>
        <h3>Responsive Design</h3>
        <p>Layouts that automatically adapt to any device screen size</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <img src="https://via.placeholder.com/80" alt="Feature Icon" />
        </div>
        <h3>Customizable Headers</h3>
        <p>Create unique header designs with our powerful builder</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">
          <img src="https://via.placeholder.com/80" alt="Feature Icon" />
        </div>
        <h3>Typography Control</h3>
        <p>Access to hundreds of Google fonts and typography settings</p>
      </div>
    </div>
  </div>
  <style>
    .features-section {
      padding: 100px 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .section-header h2 {
      font-size: 2.5rem;
      color: #1e293b;
      margin-bottom: 15px;
    }
    .section-header p {
      font-size: 1.2rem;
      color: #64748b;
      max-width: 600px;
      margin: 0 auto;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    .feature-card {
      background-color: #fff;
      padding: 40px 30px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      text-align: center;
    }
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 35px rgba(0, 0, 0, 0.1);
    }
    .feature-icon {
      margin-bottom: 25px;
    }
    .feature-icon img {
      width: 80px;
      height: 80px;
    }
    .feature-card h3 {
      font-size: 1.5rem;
      color: #1e293b;
      margin-bottom: 15px;
    }
    .feature-card p {
      color: #64748b;
      line-height: 1.6;
    }
    @media (max-width: 768px) {
      .features-section {
        padding: 60px 0;
      }
      .section-header h2 {
        font-size: 2rem;
      }
      .feature-card {
        padding: 30px 20px;
      }
    }
  </style>
</section>
`;

// Feature Comparison template
export const featureComparisonTemplate = `
<section class="comparison-section" data-gjs-droppable="false" data-gjs-custom-name="Feature Comparison">
  <div class="container">
    <div class="section-header">
      <h2>Compare Features</h2>
      <p>See how our plans stack up against each other</p>
    </div>
    <div class="comparison-table-wrapper">
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Features</th>
            <th>Free</th>
            <th>Pro</th>
            <th>Agency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Responsive Layouts</td>
            <td>✓</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td>Header Builder</td>
            <td>Basic</td>
            <td>Advanced</td>
            <td>Advanced</td>
          </tr>
          <tr>
            <td>Footer Builder</td>
            <td>—</td>
            <td>✓</td>
            <td>✓</td>
          </tr>
          <tr>
            <td>WooCommerce Integration</td>
            <td>—</td>
            <td>Basic</td>
            <td>Advanced</td>
          </tr>
          <tr>
            <td>Custom Templates</td>
            <td>3</td>
            <td>15</td>
            <td>Unlimited</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <style>
    .comparison-section {
      padding: 100px 0;
      background-color: #fff;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .section-header h2 {
      font-size: 2.5rem;
      color: #1e293b;
      margin-bottom: 15px;
    }
    .section-header p {
      font-size: 1.2rem;
      color: #64748b;
      max-width: 600px;
      margin: 0 auto;
    }
    .comparison-table-wrapper {
      overflow-x: auto;
    }
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      overflow: hidden;
    }
    .comparison-table th, .comparison-table td {
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
    }
    .comparison-table thead {
      background-color: #4a6cf7;
      color: #fff;
    }
    .comparison-table thead th {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .comparison-table thead th:first-child {
      text-align: left;
    }
    .comparison-table tbody tr:last-child td {
      border-bottom: none;
    }
    .comparison-table tbody td:first-child {
      text-align: left;
      font-weight: 500;
      color: #1e293b;
    }
    .comparison-table tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }
    @media (max-width: 768px) {
      .comparison-section {
        padding: 60px 0;
      }
      .section-header h2 {
        font-size: 2rem;
      }
      .comparison-table th, .comparison-table td {
        padding: 15px 10px;
        font-size: 0.9rem;
      }
    }
  </style>
</section>
`;

// Testimonial Carousel template
export const testimonialCarouselTemplate = `
<section class="testimonials-section" data-gjs-droppable="false" data-gjs-custom-name="Testimonial Carousel">
  <div class="container">
    <div class="section-header">
      <h2>What Our Customers Say</h2>
      <p>Trusted by thousands of website creators worldwide</p>
    </div>
    <div class="testimonials-carousel">
      <div class="testimonial-card">
        <div class="testimonial-content">
          <p>"This theme has completely transformed our website. The customization options are endless and the support team is amazing."</p>
        </div>
        <div class="testimonial-author">
          <img src="https://via.placeholder.com/60" alt="Author" class="author-image" />
          <div class="author-info">
            <h4>Sarah Johnson</h4>
            <p>Marketing Director, TechCorp</p>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-content">
          <p>"We've tried many WordPress themes, but this one stands out for its performance and ease of use. Highly recommended!"</p>
        </div>
        <div class="testimonial-author">
          <img src="https://via.placeholder.com/60" alt="Author" class="author-image" />
          <div class="author-info">
            <h4>Michael Chen</h4>
            <p>Web Developer, DesignStudio</p>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-content">
          <p>"The header builder alone is worth the investment. We were able to create a unique design that perfectly matches our brand."</p>
        </div>
        <div class="testimonial-author">
          <img src="https://via.placeholder.com/60" alt="Author" class="author-image" />
          <div class="author-info">
            <h4>Emily Rodriguez</h4>
            <p>CEO, CreativeSolutions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <style>
    .testimonials-section {
      padding: 100px 0;
      background-color: #f8fafc;
      overflow: hidden;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .section-header h2 {
      font-size: 2.5rem;
      color: #1e293b;
      margin-bottom: 15px;
    }
    .section-header p {
      font-size: 1.2rem;
      color: #64748b;
      max-width: 600px;
      margin: 0 auto;
    }
    .testimonials-carousel {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 30px;
      padding: 20px 5px;
    }
    .testimonial-card {
      background-color: #fff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }
    .testimonial-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    }
    .testimonial-content {
      margin-bottom: 20px;
    }
    .testimonial-content p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #334155;
      font-style: italic;
    }
    .testimonial-author {
      display: flex;
      align-items: center;
    }
    .author-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 15px;
    }
    .author-info h4 {
      margin: 0 0 5px;
      font-size: 1.1rem;
      color: #1e293b;
    }
    .author-info p {
      margin: 0;
      font-size: 0.9rem;
      color: #64748b;
    }
    @media (max-width: 768px) {
      .testimonials-section {
        padding: 60px 0;
      }
      .section-header h2 {
        font-size: 2rem;
      }
      .testimonial-card {
        padding: 25px 20px;
      }
    }
  </style>
</section>
`;

// CTA Section template
export const ctaSectionTemplate = `
<section class="cta-section" data-gjs-droppable="false" data-gjs-custom-name="Call to Action">
  <div class="container">
    <div class="cta-content">
      <h2>Ready to Get Started?</h2>
      <p>Join thousands of website creators who trust our solution</p>
      <div class="cta-buttons">
        <a href="#" class="btn btn-primary">Get Started Now</a>
        <a href="#" class="btn btn-secondary">Contact Sales</a>
      </div>
    </div>
  </div>
  <style>
    .cta-section {
      background: linear-gradient(135deg, #4a6cf7 0%, #6457c6 100%);
      color: #fff;
      padding: 80px 0;
      text-align: center;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }
    .cta-content h2 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      font-weight: 700;
    }
    .cta-content p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-block;
      padding: 14px 30px;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
    }
    .btn-primary {
      background-color: #fff;
      color: #4a6cf7;
    }
    .btn-primary:hover {
      background-color: #f1f5ff;
      transform: translateY(-3px);
    }
    .btn-secondary {
      background-color: transparent;
      color: #fff;
      border: 2px solid #fff;
    }
    .btn-secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }
    @media (max-width: 768px) {
      .cta-section {
        padding: 60px 0;
      }
      .cta-content h2 {
        font-size: 2rem;
      }
      .cta-content p {
        font-size: 1rem;
      }
      .btn {
        padding: 12px 24px;
      }
    }
  </style>
</section>
`;

// Full Features Page template combining multiple sections
export const fullFeaturesPageTemplate = `
<div class="features-page-wrapper" data-gjs-droppable="false" data-gjs-custom-name="Features Page">
  <!-- Hero Section -->
  ${heroBannerTemplate}
  
  <!-- Features Section -->
  ${featureSectionTemplate}
  
  <!-- Feature Comparison -->
  ${featureComparisonTemplate}
  
  <!-- Testimonials -->
  ${testimonialCarouselTemplate}
  
  <!-- CTA Section -->
  ${ctaSectionTemplate}
</div>
`;