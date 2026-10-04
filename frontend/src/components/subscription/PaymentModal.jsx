import React, { useState } from 'react';
import { 
  X, ShieldCheck, CreditCard, QrCode, Sparkles, 
  Lock, Building2, Check, Smartphone
} from 'lucide-react';
import { formatPricePair } from '../../utils/currency';

export default function PaymentModal({ isOpen, onClose, plan, onSelectPayment }) {
  const [selectedMethod, setSelectedMethod] = useState('phonepe'); // 'phonepe' | 'gpay' | 'card' | 'qr' | 'netbanking'
  const [currency, setCurrency] = useState('inr'); // 'inr' | 'usd'
  const [phonePeNumber, setPhonePeNumber] = useState('9876543210');
  const [gpayNumber, setGpayNumber] = useState('9876543210');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8920 1123 7890');
  const [cardHolder, setCardHolder] = useState('ALEX MORGAN');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('382');
  const [saveCard, setSaveCard] = useState(true);

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC');

  if (!isOpen || !plan) return null;

  const pricePair = formatPricePair(plan.price_usd);
  const priceDisplay = currency === 'inr' ? pricePair.inr : pricePair.usd;

  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  const fillDemoCard = () => {
    setCardNumber('4532 8920 1123 7890');
    setCardHolder('ALEX MORGAN');
    setCardExpiry('08/28');
    setCardCvv('382');
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (onSelectPayment) {
      onSelectPayment(plan.id, {
        method: selectedMethod,
        amount: priceDisplay,
        currency
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-navy-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 border-b border-navy-800 flex items-center justify-between bg-navy-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center text-brand-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                Select Payment Mode
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Secure Gateway
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">{plan.name} – {plan.request_limit}</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-navy-800/80 hover:bg-navy-750 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Payment Modes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Plan & Price Summary Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-navy-850 to-navy-800 border border-navy-700/60 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{plan.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-blue/20 text-brand-cyan">
                  {plan.request_limit}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Recurring Monthly SaaS License</p>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1.5 mb-1">
                <button 
                  type="button"
                  onClick={() => setCurrency('inr')} 
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${currency === 'inr' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  INR (₹)
                </button>
                <button 
                  type="button"
                  onClick={() => setCurrency('usd')} 
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${currency === 'usd' ? 'bg-brand-blue/20 text-brand-cyan border border-brand-blue/40' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  USD ($)
                </button>
              </div>
              <div className="text-xl font-extrabold text-white font-mono">{priceDisplay}</div>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 block">
              Choose Payment Mode
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              
              {/* PhonePe Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod('phonepe')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition text-center ${
                  selectedMethod === 'phonepe'
                    ? 'border-purple-500 bg-purple-500/10 text-white shadow-lg shadow-purple-500/10'
                    : 'border-navy-800 bg-navy-950/60 hover:border-navy-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#5f259f] text-white flex items-center justify-center font-bold text-xs shadow-md">
                  Pe
                </div>
                <span className="text-xs font-semibold">PhonePe</span>
              </button>

              {/* Google Pay Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod('gpay')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition text-center ${
                  selectedMethod === 'gpay'
                    ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10'
                    : 'border-navy-800 bg-navy-950/60 hover:border-navy-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  <span className="text-blue-400">G</span><span className="text-rose-400">P</span><span className="text-amber-400">a</span><span className="text-emerald-400">y</span>
                </div>
                <span className="text-xs font-semibold">Google Pay</span>
              </button>

              {/* Credit / Debit Card Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition text-center ${
                  selectedMethod === 'card'
                    ? 'border-brand-blue bg-brand-blue/10 text-white shadow-lg shadow-brand-blue/10'
                    : 'border-navy-800 bg-navy-950/60 hover:border-navy-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 text-brand-cyan flex items-center justify-center shadow-md">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Cards</span>
              </button>

              {/* UPI / QR Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod('qr')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition text-center ${
                  selectedMethod === 'qr'
                    ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/10'
                    : 'border-navy-800 bg-navy-950/60 hover:border-navy-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-md">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Scan QR</span>
              </button>

              {/* Net Banking Option */}
              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition text-center ${
                  selectedMethod === 'netbanking'
                    ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg shadow-amber-500/10'
                    : 'border-navy-800 bg-navy-950/60 hover:border-navy-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-md">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold">Net Banking</span>
              </button>
            </div>
          </div>

          {/* Payment Details Container */}
          <div className="p-5 rounded-xl bg-navy-950/80 border border-navy-800">
            
            {/* 1. PhonePe Details */}
            {selectedMethod === 'phonepe' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#5f259f] text-white flex items-center justify-center font-bold text-[10px]">
                      Pe
                    </div>
                    <span className="text-xs font-bold text-white">PhonePe UPI</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Instant Payment
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1.5">PhonePe Mobile Number or UPI VPA</label>
                  <input
                    type="text"
                    value={phonePeNumber}
                    onChange={(e) => setPhonePeNumber(e.target.value)}
                    placeholder="e.g. 9876543210 or user@ybl"
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Enter your PhonePe linked number to send payment request of <strong className="text-white">{priceDisplay}</strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {['@ybl', '@ibl', '@axl'].map(handle => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => setPhonePeNumber(prev => prev.split('@')[0] + handle)}
                      className="px-2.5 py-1 rounded bg-navy-850 hover:bg-navy-800 text-[10px] text-purple-300 border border-purple-500/20 font-mono"
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Google Pay Details */}
            {selectedMethod === 'gpay' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">Google Pay (GPay)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    GPay Verified
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1.5">Google Pay UPI ID or Mobile Number</label>
                  <input
                    type="text"
                    value={gpayNumber}
                    onChange={(e) => setGpayNumber(e.target.value)}
                    placeholder="e.g. user@okhdfcbank or 9876543210"
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {['@okhdfcbank', '@okaxis', '@oksbi', '@okicici'].map(handle => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => setGpayNumber(prev => prev.split('@')[0] + handle)}
                      className="px-2.5 py-1 rounded bg-navy-850 hover:bg-navy-800 text-[10px] text-blue-300 border border-blue-500/20 font-mono"
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Cards Details */}
            {selectedMethod === 'card' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-navy-800">
                  <span className="text-xs font-bold text-white">Credit / Debit Card (Visa, MasterCard, RuPay)</span>
                  <button
                    type="button"
                    onClick={fillDemoCard}
                    className="text-[11px] text-brand-cyan hover:underline font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Auto-fill Test Card
                  </button>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4532 8920 1123 7890"
                      maxLength={19}
                      className="w-full bg-navy-900 border border-navy-700 rounded-lg pl-3.5 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue font-mono"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      placeholder="ALEX MORGAN"
                      className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.substring(0, 4))}
                        placeholder="•••"
                        maxLength={4}
                        className="w-full bg-navy-900 border border-navy-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-blue font-mono text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="saveCard" 
                    checked={saveCard} 
                    onChange={(e) => setSaveCard(e.target.checked)} 
                    className="rounded bg-navy-900 border-navy-700 text-brand-blue focus:ring-0"
                  />
                  <label htmlFor="saveCard" className="text-[11px] text-slate-400 cursor-pointer">
                    Save card for future billing
                  </label>
                </div>
              </div>
            )}

            {/* 4. Scan QR Code */}
            {selectedMethod === 'qr' && (
              <div className="text-center space-y-4">
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl max-w-[200px] mx-auto shadow-md">
                  <div className="w-36 h-36 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-slate-900 relative">
                    <div className="w-32 h-32 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:6px_6px] p-2 flex items-center justify-center relative">
                      <div className="w-8 h-8 rounded-lg bg-navy-950 text-brand-cyan flex items-center justify-center font-bold text-[10px] shadow">
                        AI
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-900 mt-1.5 font-mono">
                    SCAN & PAY {priceDisplay}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Scan with any UPI App: PhonePe, Google Pay, Paytm, CRED, Amazon Pay, or BHIM.
                </p>
              </div>
            )}

            {/* 5. Net Banking */}
            {selectedMethod === 'netbanking' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                  <span className="text-xs font-bold text-white">All Indian Banks Net Banking</span>
                  <span className="text-[10px] text-slate-400">Direct Bank Transfer</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['HDFC', 'ICICI', 'SBI', 'AXIS'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-lg border text-xs font-bold transition ${
                        selectedBank === bank
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-navy-800 bg-navy-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {bank} Bank
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Or select other bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India (SBI)</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                    <option value="PNB">Punjab National Bank</option>
                    <option value="BOB">Bank of Baroda</option>
                  </select>
                </div>
              </div>
            )}

          </div>

          {/* Security & Action Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit Encrypted PCI-DSS Gateway</span>
            </div>
            <span>Cancel anytime</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-navy-700 bg-navy-800/80 hover:bg-navy-750 text-xs font-semibold text-slate-300 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-blue-600 hover:to-cyan-500 text-white shadow-lg shadow-brand-blue/20 transition active:scale-98"
            >
              Select & Proceed with {selectedMethod.toUpperCase()} ({priceDisplay})
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
