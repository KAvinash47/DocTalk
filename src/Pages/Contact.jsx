import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 px-6 py-12 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
          Contact Us
        </h1>
        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Have questions or need help booking an appointment? 
          Our support team is here to assist you.
        </p>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">

        {/* Left - Contact Info */}
        <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-8 border border-transparent dark:border-slate-800">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            Get In Touch
          </h2>

          <div className="space-y-4 text-gray-600 dark:text-slate-400">
            <p><strong className="text-slate-900 dark:text-white">📍 Address:</strong> Jaipur, Rajasthan, India</p>
            <p><strong className="text-slate-900 dark:text-white">📞 Phone:</strong> +91 7976739844</p>
            <p><strong className="text-slate-900 dark:text-white">📧 Email:</strong> support@doctalk.com</p>
            <p><strong className="text-slate-900 dark:text-white">⏰ Working Hours:</strong> Mon - Sat (9AM - 7PM)</p>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-8 border border-transparent dark:border-slate-800">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">
            Send Message
          </h2>

          <form className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full border dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;