import React from 'react';

// Import certificate templates
import template1 from '@/cert_templates/Template1.png';
import template2 from '@/cert_templates/Template2.png';
import template3 from '@/cert_templates/Template3.png';
import template4 from '@/cert_templates/Template4.jpeg';
import template5 from '@/cert_templates/Template5.png';
import template6 from '@/cert_templates/Template6.png';
import template7 from '@/cert_templates/Template7.png';
import template8 from '@/cert_templates/Template8.png';
import template9 from '@/cert_templates/Template9.gif';
import template10 from '@/cert_templates/Template10.jpg';
import template11 from '@/cert_templates/Template11.png';

interface CertificateTemplateProps {
  template: string;
  name: string;
  heading: string;
  description: string;
  author: string;
  logo?: string;
}

const CertificateTemplate = React.forwardRef<HTMLDivElement, CertificateTemplateProps>(
  ({ template, name, heading, description, author, logo }, ref) => {
    const templates = {
      template1,
      template2,
      template3,
      template4,
      template5,
      template6,
      template7,
      template8,
      template9,
      template10,
      template11,
    };

    const selectedTemplate = templates[template as keyof typeof templates] || template1;

    const renderTemplate = () => {
      switch (template) {
        case 'template1':
          return (
            <div style={{ position: 'relative', border: '1px solid gray' }} id="template1">
              <img src={selectedTemplate.src} style={{ width: '45rem' }} alt="Certificate template" />
              <div className="info" style={{ position: 'absolute', top: '39%', left: '36%', width: '60%' }}>
                <h2 style={{ textTransform: 'uppercase', color: '#0e4573', textDecoration: 'underline', marginBottom: '1rem' }}>
                  {heading || 'Certificate of Achievement'}
                </h2>
                <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#ff9800', textTransform: 'uppercase', letterSpacing: '3px' }}>
                  This is presented to
                </h3>
                <h1 style={{ fontSize: '3rem', color: '#33d5ac' }}>{name || 'Name'}</h1>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#ff9800' }}>
                  {description || 'for the active participation in the event and for giving efforts, ideas and Knowledge.'}
                </p>
              </div>
              <div className="author" style={{ position: 'absolute', top: '59%', left: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '20%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '12px', color: '#0e4573', textDecoration: 'underline', textTransform: 'uppercase' }}>
                  Course Director
                </h2>
                <h1 style={{ fontSize: '20px', color: '#ff9800', textTransform: 'uppercase' }}>
                  {author || 'Author Name'}
                </h1>
              </div>
              {logo && (
                <img 
                  src={logo} 
                  style={{ position: 'absolute', width: '6rem', borderRadius: '50%', top: '20%', left: '35%' }} 
                  alt="logo" 
                />
              )}
            </div>
          );

        case 'template2':
          return (
            <div style={{ position: 'relative', border: '1px solid gray' }} id="template2">
              <img src={selectedTemplate.src} style={{ width: '45rem' }} alt="Certificate template" />
              <div className="info" style={{ position: 'absolute', top: '34%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ color: 'rgb(255 251 240)', textDecoration: 'underline', marginBottom: '3rem' }}>
                  {heading || 'Certificate of Achievement'}
                </h2>
                <h1 style={{ fontSize: '3rem', color: 'rgb(209 254 255)' }}>{name || 'Name'}</h1>
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'rgb(255 251 240)', width: '60%', textAlign: 'center' }}>
                  {description || 'for the active participation in the event and for giving efforts, ideas and Knowledge.'}
                </p>
              </div>
              <div className="author" style={{ position: 'absolute', top: '80%', left: '26%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ fontSize: '12px', color: 'rgb(187 238 243)', textDecoration: 'underline' }}>Course Director</h2>
                <h1 style={{ fontSize: '20px', color: '#ace3ea' }}>{author || 'Author Name'}</h1>
              </div>
              {logo && (
                <img 
                  src={logo} 
                  style={{ position: 'absolute', width: '4rem', borderRadius: '50%', top: '78%', left: '62%' }} 
                  alt="logo" 
                />
              )}
            </div>
          );

        case 'template3':
          return (
            <div style={{ position: 'relative', border: '1px solid gray' }} id="template3">
              <img src={selectedTemplate.src} style={{ width: '45rem' }} alt="Certificate template" />
              <div className="info" style={{ position: 'absolute', top: '25%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ color: 'white', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '1rem' }}>
                  {heading || 'Certificate of Achievement'}
                </h2>
                <h3 style={{ fontSize: '16px', fontWeight: '500', color: 'rgb(255, 152, 0)', textTransform: 'uppercase', letterSpacing: '3px' }}>
                  is hereby awarded to
                </h3>
                <h1 style={{ fontSize: '3rem', color: '#e55e5e' }}>{name || 'Name'}</h1>
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'rgb(255 251 240)', width: '60%', textAlign: 'center' }}>
                  {description || 'for the active participation in the event and for giving efforts, ideas and Knowledge.'}
                </p>
              </div>
              <div className="author" style={{ position: 'absolute', top: '70%', left: '41%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ fontSize: '12px', color: 'white', textDecoration: 'underline' }}>Course Director</h2>
                <h1 style={{ fontSize: '20px', color: 'rgb(231 133 58)' }}>{author || 'Author Name'}</h1>
              </div>
              {logo && (
                <img 
                  src={logo} 
                  style={{ position: 'absolute', width: '4rem', borderRadius: '50%', top: '10%', left: '45%' }} 
                  alt="logo" 
                />
              )}
            </div>
          );

        case 'template4':
          return (
            <div style={{ position: 'relative', border: '1px solid gray' }} id="template4">
              <img src={selectedTemplate.src} style={{ width: '45rem' }} alt="Certificate template" />
              <h1 style={{ fontSize: '3rem', color: 'black', position: 'absolute', top: '9rem', left: '25px', wordBreak: 'break-all' }}>
                {name || 'Name'}
              </h1>
              <h6 style={{ fontSize: '15px', fontWeight: '600', color: '#213a62', width: '60%', position: 'absolute', top: '17rem', left: '27px', wordBreak: 'break-all' }}>
                {description || 'for the active participation in the event and for giving efforts, ideas and Knowledge.'}
              </h6>
              <h1 style={{ fontSize: '15px', color: 'black', position: 'absolute', top: '19.95rem', left: '8.6rem', wordBreak: 'break-all' }}>
                {author || 'Author Name'}
              </h1>
            </div>
          );

        case 'template5':
          return (
            <div style={{ position: 'relative', border: '1px solid gray' }} id="template5">
              <img src={selectedTemplate.src} style={{ width: '45rem' }} alt="Certificate template" />
              <div className="info" style={{ position: 'absolute', top: '39%', left: '36%', width: '60%' }}>
                <h2 style={{ textTransform: 'uppercase', color: '#781114', textDecoration: 'underline', marginBottom: '1rem' }}>
                  {heading || 'Certificate of Achievement'}
                </h2>
                <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#0300b0', textTransform: 'uppercase', letterSpacing: '3px' }}>
                  This is presented to
                </h3>
                <h1 style={{ fontSize: '3rem', color: 'black' }}>{name || 'Name'}</h1>
                <p style={{ fontSize: '15px', fontWeight: '600', color: '#0300b0' }}>
                  {description || 'for the active participation in the event and for giving efforts, ideas and Knowledge.'}
                </p>
              </div>
              <div className="author" style={{ position: 'absolute', top: '59%', left: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '20%', textAlign: 'center' }}>
                <h2 style={{ fontSize: '12px', color: '#781114', textDecoration: 'underline', textTransform: 'uppercase' }}>
                  Course Director
                </h2>
                <h1 style={{ fontSize: '20px', color: '#0300b0', textTransform: 'uppercase' }}>
                  {author || 'Author Name'}
                </h1>
              </div>
              {logo && (
                <img 
                  src={logo} 
                  style={{ position: 'absolute', width: '6rem', borderRadius: '50%', top: '20%', left: '35%' }} 
                  alt="logo" 
                />
              )}
            </div>
          );

        // Add other templates following the same pattern...
        default:
          return (
            <div style={{ position: 'relative', border: '1px solid gray', padding: '2rem', minHeight: '400px', backgroundColor: '#f8f9fa' }}>
              <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#333' }}>
                  {heading || 'Certificate of Achievement'}
                </h1>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#666' }}>
                  This is presented to
                </h2>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#000', fontWeight: 'bold' }}>
                  {name || 'Name'}
                </h1>
                <p style={{ fontSize: '1rem', marginBottom: '3rem', color: '#555', maxWidth: '80%', margin: '0 auto 3rem' }}>
                  {description || 'for the active participation in the event and for giving efforts, ideas and Knowledge.'}
                </p>
                <div style={{ marginTop: '4rem' }}>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>Authorized by</p>
                  <h3 style={{ fontSize: '1.5rem', color: '#333' }}>{author || 'Author Name'}</h3>
                </div>
              </div>
              {logo && (
                <img 
                  src={logo} 
                  style={{ position: 'absolute', width: '4rem', borderRadius: '50%', top: '1rem', right: '1rem' }} 
                  alt="logo" 
                />
              )}
            </div>
          );
      }
    };

    return (
      <div ref={ref} style={{ width: 'fit-content' }}>
        {renderTemplate()}
      </div>
    );
  }
);

CertificateTemplate.displayName = 'CertificateTemplate';

export default CertificateTemplate;
