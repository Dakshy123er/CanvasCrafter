import React from 'react';
import { useAuth } from '../context/AuthContext';
const BASE_URL = "https://canvascrafter-oezs.onrender.com";

const Upgrade = () => {
  const { user } = useAuth();

  const handlePayment = async () => {
    const amount = 99; // ₹99 for premium
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${BASE_URL}/api/v1/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      const options = {
        key: 'rzp_test_ZUViIrRVIMqOVm', // replace this
        amount: order.amount,
        currency: order.currency,
        name: 'AI Image Generator',
        description: 'Upgrade to Premium',
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch(`${BASE_URL}/api/v1/payments/verify-payment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(response),
          });

          const result = await verifyRes.json();

          if (verifyRes.ok) {
            alert('✅ Payment successful!');
            window.location.reload(); // optionally refetch user data here
          } else {
            alert('❌ Payment verification failed');
          }
        },
        prefill: {
          email: user?.email,
        },
        theme: {
          color: '#6469ff',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('❌ Payment error: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-bold mb-6">Upgrade to Premium</h2>
      <p className="mb-4 text-gray-600">Get unlimited image generations for just ₹99!</p>
      <button
        onClick={handlePayment}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-xl shadow"
      >
        Upgrade Now
      </button>
    </div>
  );
};

export default Upgrade;
