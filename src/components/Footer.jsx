import React from "react";

const Footer = React.forwardRef((_, ref) => {
  return (
    <footer ref={ref} className="bg-white dark:bg-gray-900 border-t border-gray-200 py-10 px-6">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            EmpIQ - Empowering Employee Management with Smart CRUD Solutions
          </h2>
          <div className="text-gray-600 dark:text-gray-400">
            <p className="mb-2"><strong>Call us</strong></p>
            <p>+1 (234) 999 888 7</p>
            <p>+1 (987) 111 222 3</p>
            <p className="mt-4"><strong>Find us</strong></p>
            <p> Unitech Cyber City, Gurgaon, Haryana - 1220036</p>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Get in touch.</h2>
          <form className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="Your name *" className="p-2 border rounded bg-gray-50" required />
            <input type="email" placeholder="Your email *" className="p-2 border rounded bg-gray-50" required />
            <input type="text" placeholder="Your company" className="p-2 border rounded bg-gray-50" />
            <input type="text" placeholder="Budget Range" className="p-2 border rounded bg-gray-50" />
            <textarea placeholder="Message" className="p-2 border rounded h-24 bg-gray-50" />
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Send
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
