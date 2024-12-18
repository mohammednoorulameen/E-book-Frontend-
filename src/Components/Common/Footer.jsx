// import React from 'react'

// const Footer = () => {
//   return (
//     <div>Footer</div>
//   )
// }

// export default Footer

import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';

const SocialIcon = ({ children }) => (
  <a 
    href="#" 
    className="social-icon"
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '1px solid white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      margin: '0 10px'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = 'white';
      e.currentTarget.style.color = 'black';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.color = 'white';
    }}
  >
    {children}
  </a>
);

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <footer style={{
      backgroundColor: 'black',
      color: 'white',
      padding: '60px 20px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      }}>
        {/* Logo and Description */}
        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>E - book</h2>
          <p style={{ color: '#999', lineHeight: '1.6' }}>
            company discriptionasdfsdf
            afdsfssfsdffsdfdddfasdfsfsd
            fsdfsdfsdfsdfsfs
          </p>
        </div>

        {/* Social Icons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <SocialIcon><FaFacebookF /></SocialIcon>
          <SocialIcon><FaTwitter /></SocialIcon>
          <SocialIcon><FaLinkedinIn /></SocialIcon>
          <SocialIcon><FaInstagram /></SocialIcon>
          <SocialIcon><FaYoutube /></SocialIcon>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 style={{ 
            fontSize: '20px', 
            marginBottom: '20px',
            textAlign: 'right'
          }}>
            subscribe for latest updates
          </h3>
          <form 
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: '10px'
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your email address"
              style={{
                flex: 1,
                padding: '10px 15px',
                borderRadius: '4px',
                border: '1px solid #333',
                backgroundColor: 'transparent',
                color: 'white',
                outline: 'none'
              }}
              required
            />
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'white',
                color: 'black',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Links */}
      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        padding: '20px 0',
        borderTop: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>about us</a>
        <a href="#" style={{ color: 'white', textDecoration: 'none' }}>contact us</a>
        <span>Copyright @ 2024</span>
      </div>
    </footer>
  );
}