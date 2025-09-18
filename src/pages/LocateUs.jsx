import React from 'react';

const LocateUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-indigo-800 mb-4">Locate Us</h1>
      <p className="text-gray-700 mb-6">
        Visit our store and experience the beauty of fine jewelry in person.
      </p>
      <div className="space-y-4">
        <p><span className="font-semibold">Address:</span> 4675, Thakur Pachwar Ka Rasta, Johari Bazaar, Jaipur</p>
        <p><span className="font-semibold">Phone:</span> +91 7568511028, 7733904061</p>
        <p><span className="font-semibold">Email:</span> aaritjewels@gmail.com</p>
      </div>
      {/* Google Maps Embed */}
      <div className="mt-6">
       <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6280.609383045124!2d75.82724063991476!3d26.916168046367265!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db720fb4e8901%3A0xc618034c744e0815!2sAarit%20Jewels!5e0!3m2!1sen!2sin!4v1758189368051!5m2!1sen!2sin" 
        className='w-full h-96 rounded-xl border border-black shadow-md'
        width={800}
        height={500}
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  );
};

export default LocateUs;
