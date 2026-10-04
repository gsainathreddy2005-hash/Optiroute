import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import PaymentModal from '../components/subscription/PaymentModal';
import { subscriptionService } from '../services/subscriptionService';
import { formatPricePair } from '../utils/currency';
import { Check, Zap, Sparkles, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    subscriptionService.getPlans().then(setPlans).catch(console.error);
  }, []);

  const handlePlanClick = (plan) => {
    if (plan.id === currentPlan) return;
    
    if (plan.price_usd === 0) {
      // Free plan directly activates
      subscriptionService.upgradePlan('free')
        .then((res) => {
          setCurrentPlan('free');
          setMessage(res.message);
        })
        .catch(console.error);
      return;
    }

    // Open Payment Mode Modal for Paid Plans (Pro & Enterprise)
    setSelectedPlanForPayment(plan);
    setIsPaymentModalOpen(true);
  };

  const handleSelectPayment = async (planId, paymentDetails) => {
    try {
      await subscriptionService.upgradePlan(planId);
      setCurrentPlan(planId);
      setIsPaymentModalOpen(false);
      setMessage(`Switched to ${planId.toUpperCase()} plan using ${paymentDetails.method.toUpperCase()} payment mode.`);
      setTimeout(() => setMessage(null), 6000);
    } catch (e) {
      console.error("Subscription activation error:", e);
      setIsPaymentModalOpen(false);
    }
  };

  return (
    <DashboardLayout title="Subscription & Pricing Plans">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-blue/15 text-brand-cyan border border-brand-blue/30 uppercase tracking-wider">
            Flexible Pricing Window
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Cost-Aware Intelligent LLM Plans</h1>
          <p className="text-xs text-slate-400">
            Choose the subscription tier tailored for your API volume. Prices are displayed in both <strong className="text-white">USD ($)</strong> and <strong className="text-white">INR (₹)</strong>.
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center max-w-lg mx-auto flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {plans.map((plan) => {
            const pricePair = formatPricePair(plan.price_usd);
            const isCurrent = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative bg-navy-900/90 rounded-2xl p-6 flex flex-col justify-between border transition duration-300 ${
                  plan.is_popular
                    ? 'border-brand-blue shadow-xl shadow-brand-blue/10 scale-105'
                    : 'border-navy-800 hover:border-navy-700'
                }`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.request_limit}</p>
                  </div>

                  {/* Dual Currency Price Display */}
                  <div className="py-2 border-y border-navy-800/80">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-white font-mono">{pricePair.usd}</span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                    <div className="text-xs font-bold text-brand-cyan font-mono mt-0.5">
                      Equivalent: {pricePair.inr} INR / month
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => handlePlanClick(plan)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default font-semibold'
                        : plan.is_popular
                        ? 'bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-blue-600 hover:to-cyan-500 text-white shadow-md shadow-brand-blue/20'
                        : 'bg-navy-800 hover:bg-navy-750 text-slate-200 border border-navy-700'
                    }`}
                  >
                    {isCurrent ? (
                      'CURRENT PLAN'
                    ) : (
                      <>
                        UPGRADE TO {plan.name.toUpperCase()}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Mode Selector Modal */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlanForPayment}
          onSelectPayment={handleSelectPayment}
        />

      </div>
    </DashboardLayout>
  );
}
