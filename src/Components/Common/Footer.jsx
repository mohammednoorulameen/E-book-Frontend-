

import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

// eslint-disable-next-line react/prop-types
const SocialIcon = ({ Icon }) => (
  <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white text-white transition-all duration-300 hover:bg-white hover:text-black mx-2 cursor-pointer">
    <Icon size={18} />
  </div>
);

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-black text-white py-16 px-5 relative">
      {/* Main Footer Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* Logo and Description */}
        <div>
          <h2 className="text-2xl font-semibold mb-5">E - Book</h2>
          <p className="text-gray-400 leading-relaxed">
            Company description text goes here. You can talk about your brand,
            your vision, and your goals briefly here to make it look
            professional and authentic.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center items-center flex-wrap">
          <SocialIcon Icon={FaFacebookF} />
          <SocialIcon Icon={FaTwitter} />
          <SocialIcon Icon={FaLinkedinIn} />
          <SocialIcon Icon={FaInstagram} />
          <SocialIcon Icon={FaYoutube} />
        </div>

        {/* Newsletter */}
        <div className="text-right">
          <h3 className="text-lg font-medium mb-5 uppercase tracking-wide">
            Subscribe for latest updates
          </h3>
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 justify-end flex-wrap"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 min-w-[180px] p-2 rounded-md border border-gray-700 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black rounded-md font-medium transition-colors duration-300 hover:bg-gray-200"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="max-w-6xl mx-auto mt-10 pt-5 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">
        <div className="flex flex-wrap justify-center gap-5">
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition">
            About Us
          </a>
          <a href="#" className="hover:text-white transition">
            Contact Us
          </a>
        </div>
        <span>© 2024 E-Book. All rights reserved.</span>
      </div>
    </footer>
  );
}
