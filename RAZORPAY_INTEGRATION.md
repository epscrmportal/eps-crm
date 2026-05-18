/**
 * EPS CRM - Razorpay Payment Gateway Integration
 * Complete Frontend & Backend Implementation
 */

// ============================================
// PART 1: FRONTEND IMPLEMENTATION (React)
// ============================================

/**
 * File: src/services/paymentService.js
 * Payment API service for Razorpay integration
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const paymentService = {
  // Create Razorpay order
  createOrder: async (invoiceId, amount, email, phone, token) => {
    try {
      const response = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          invoiceId,
          amount,
          email,
          phone,
          description: `Payment for Invoice #${invoiceId}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Verify payment signature
  verifyPayment: async (orderData, token) => {
    try {
      const response = await fetch(`${API_URL}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpayOrderId: orderData.razorpay_order_id,
          razorpayPaymentId: orderData.razorpay_payment_id,
          razorpaySignature: orderData.razorpay_signature
        })
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId, token) => {
    try {
      const response = await fetch(`${API_URL}/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }
};

/**
 * File: src/components/PaymentModal.jsx
 * Razorpay payment checkout component
 */

import React, { useState } from 'react';
import { paymentService } from '../services/paymentService';

const PaymentModal = ({ invoice, onSuccess, onClose, token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create Razorpay order
      console.log('Creating Razorpay order...');
      const order = await paymentService.createOrder(
        invoice._id,
        invoice.finalAmount,
        invoice.customerEmail,
        invoice.customerPhone || '',
        token
      );

      console.log('Order created:', order);

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount, // Amount in paise
        currency: order.currency || 'INR',
        name: 'EPS CRM',
        description: `Invoice #${invoice.invoiceNumber}`,
        order_id: order.id,
        
        handler: async (response) => {
          try {
            console.log('Payment received:', response);
            
            // Step 3: Verify payment on backend
            const verifyResult = await paymentService.verifyPayment(response, token);
            
            if (verifyResult.payment.status === 'captured') {
              console.log('Payment successful!');
              setIsLoading(false);
              
              // Call success callback
              if (onSuccess) {
                onSuccess(verifyResult);
              }
              
              // Show success message
              alert('✅ Payment successful! Your invoice has been paid.');
              onClose();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setError('Payment verification failed. Please contact support.');
            setIsLoading(false);
          }
        },

        prefill: {
          name: invoice.customerName || '',
          email: invoice.customerEmail || '',
          contact: invoice.customerPhone || ''
        },

        notes: {
          invoiceNumber: invoice.invoiceNumber,
          customerId: invoice.customerId,
          customerName: invoice.customerName
        },

        theme: {
          color: '#3B82F6'
        },

        modal: {
          ondismiss: () => {
            console.log('Payment cancelled');
            setIsLoading(false);
          }
        }
      };

      // Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setIsLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment processing failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Invoice Number:</span>
            <span className="font-semibold">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Customer:</span>
            <span className="font-semibold">{invoice.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold">₹{invoice.finalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-3 border-t">
            <span className="font-bold">Total Due:</span>
            <span className="font-bold text-lg text-blue-600">
              ₹{invoice.finalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 font-semibold"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Powered by Razorpay | Secure Payment Gateway
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;

/**
 * File: src/pages/InvoicePage.jsx
 * Invoice listing and payment integration
 */

import React, { useState, useEffect } from 'react';
import PaymentModal from '../components/PaymentModal';

const InvoicePage = ({ token }) => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/invoices', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh invoices list
    fetchInvoices();
    setShowPaymentModal(false);
  };

  const handlePaymentClick = (invoice) => {
    if (invoice.status !== 'paid') {
      setSelectedInvoice(invoice);
      setShowPaymentModal(true);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Invoice</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{invoice.invoiceNumber}</td>
                <td className="p-3">{invoice.customerName}</td>
                <td className="p-3 font-semibold">₹{invoice.finalAmount.toLocaleString()}</td>
                <td className="p-3">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    invoice.status === 'paid' 
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="p-3">
                  {invoice.status !== 'paid' && (
                    <button
                      onClick={() => handlePaymentClick(invoice)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPaymentModal && selectedInvoice && (
        <PaymentModal
          invoice={selectedInvoice}
          token={token}
          onSuccess={handlePaymentSuccess}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoicePage;

// ============================================
// PART 2: ADD RAZORPAY SCRIPT TO HTML
// ============================================

/**
 * File: public/index.html
 * Add this script tag in <head>
 */

/* 
<!-- Razorpay Checkout Script -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
*/

// ============================================
// PART 3: TEST DATA & FLOW
// ============================================

/**
 * RAZORPAY TEST CREDENTIALS
 */

const TEST_CREDENTIALS = {
  TEST_CARD_VISA: {
    cardNumber: '4111111111111111',
    expiry: '12/25',
    cvv: '123'
  },
  TEST_CARD_MASTERCARD: {
    cardNumber: '5555555555554444',
    expiry: '12/25',
    cvv: '123'
  },
  TEST_CARD_INTERNATIONAL: {
    cardNumber: '4012888888881881',
    expiry: '12/25',
    cvv: '123'
  },
  TEST_UPI: '9876543210@paytm'
};

const TEST_OTP = '123456';

/**
 * PAYMENT FLOW TESTING
 */

const PAYMENT_TEST_CASES = [
  {
    scenario: 'Successful Payment',
    steps: [
      '1. Create invoice for ₹1000',
      '2. Click "Pay Now"',
      '3. Enter test card: 4111111111111111',
      '4. Expiry: 12/25, CVV: 123',
      '5. OTP: 123456',
      '6. Payment successful ✅'
    ]
  },
  {
    scenario: 'Failed Payment',
    steps: [
      '1. Create invoice',
      '2. Enter test card: 5555555555554444',
      '3. Payment fails (expected)',
      '4. Error message displayed ❌'
    ]
  },
  {
    scenario: 'UPI Payment',
    steps: [
      '1. Create invoice',
      '2. Select UPI option',
      '3. Enter UPI: 9876543210@paytm',
      '4. Complete payment',
      '5. Success ✅'
    ]
  }
];

// ============================================
// PART 4: WEBHOOK HANDLING (Backend)
// ============================================

/**
 * File: backend/routes/webhooks.js
 * Handle Razorpay webhooks
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Webhook secret from Razorpay dashboard
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

/**
 * Handle Razorpay payment events
 */
router.post('/razorpay', (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { event, payload } = req.body;

    console.log(`Webhook event: ${event}`);

    switch (event) {
      case 'payment.authorized':
        handlePaymentAuthorized(payload);
        break;

      case 'payment.captured':
        handlePaymentCaptured(payload);
        break;

      case 'payment.failed':
        handlePaymentFailed(payload);
        break;

      case 'refund.processed':
        handleRefundProcessed(payload);
        break;

      default:
        console.log(`Unknown event: ${event}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function handlePaymentAuthorized(payload) {
  console.log('Payment authorized:', payload.payment);
  // Update payment status to 'authorized'
}

async function handlePaymentCaptured(payload) {
  console.log('Payment captured:', payload.payment);
  // Update payment status to 'captured'
  // Update invoice status to 'paid'
  // Send receipt email
}

async function handlePaymentFailed(payload) {
  console.log('Payment failed:', payload.payment);
  // Update payment status to 'failed'
  // Send notification to customer
}

async function handleRefundProcessed(payload) {
  console.log('Refund processed:', payload.refund);
  // Update payment status to 'refunded'
  // Update invoice accordingly
}

module.exports = router;

// ============================================
// PART 5: ERROR HANDLING & RETRY LOGIC
// ============================================

/**
 * Retry payment verification
 */
export const retryPaymentVerification = async (paymentId, maxRetries = 3, token) => {
  let retryCount = 0;
  let lastError;

  while (retryCount < maxRetries) {
    try {
      return await paymentService.getPaymentStatus(paymentId, token);
    } catch (error) {
      lastError = error;
      retryCount++;
      console.log(`Retry ${retryCount}/${maxRetries}`);
      
      if (retryCount < maxRetries) {
        // Wait 2 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  throw lastError;
};

// ============================================
// PART 6: REFUND HANDLING
// ============================================

/**
 * Process refund request
 */
export const processRefund = async (paymentId, amount, reason, token) => {
  try {
    const response = await fetch('http://localhost:5000/api/payments/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentId,
        amount,
        reason
      })
    });

    return await response.json();
  } catch (error) {
    console.error('Refund error:', error);
    throw error;
  }
};

// ============================================
// PART 7: PAYMENT RECONCILIATION
// ============================================

/**
 * Daily payment reconciliation
 */
const reconcilePayments = async () => {
  try {
    console.log('Starting payment reconciliation...');
    
    // Get all pending payments from database
    const pendingPayments = await Payment.find({ status: 'pending' });
    
    // Check status with Razorpay
    for (const payment of pendingPayments) {
      try {
        const status = await razorpay.payments.fetch(payment.razorpayPaymentId);
        
        // Update payment status if changed
        if (status.status !== payment.status) {
          await Payment.updateOne(
            { _id: payment._id },
            { status: status.status }
          );
          
          console.log(`Updated payment ${payment._id} to ${status.status}`);
        }
      } catch (error) {
        console.error(`Error reconciling payment ${payment._id}:`, error);
      }
    }
    
    console.log('Payment reconciliation completed');
  } catch (error) {
    console.error('Reconciliation error:', error);
  }
};

// Run daily at 2 AM
// schedule.scheduleJob('0 2 * * *', reconcilePayments);

// ============================================
// PART 8: PAYMENT REPORTS
// ============================================

/**
 * Generate payment report
 */
export const generatePaymentReport = async (startDate, endDate, token) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/payments/report?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Report generation error:', error);
    throw error;
  }
};

/**
 * Expected response:
 * {
 *   totalPayments: 150,
 *   totalAmount: 500000,
 *   successfulPayments: 145,
 *   failedPayments: 5,
 *   refundedPayments: 3,
 *   refundedAmount: 50000,
 *   averageAmount: 3333.33,
 *   paymentMethods: {
 *     card: 100,
 *     upi: 35,
 *     netbanking: 15
 *   }
 * }
 */

export default {
  paymentService,
  retryPaymentVerification,
  processRefund,
  generatePaymentReport
};
