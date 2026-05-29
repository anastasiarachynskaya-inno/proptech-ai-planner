"use client";

import React, { useState } from "react";

// Types for Milestone layout
interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface MilestonePhase {
  phaseNumber: number;
  title: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  tasks: Task[];
}

export default function Home() {
  const [dealDescription, setDealDescription] = useState(
    "Buying a modern 2-bedroom apartment in Warsaw for rental business, budget €250k"
  );
  const [deadline, setDeadline] = useState("60");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPlan, setShowPlan] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Hardcoded Warsaw example milestones for the initial mock
  const [phases, setPhases] = useState<MilestonePhase[]>([
    {
      phaseNumber: 1,
      title: "Legal & Due Diligence Check",
      duration: "Days 1 - 15",
      priority: "High",
      description: "Verify property ownership, legal encumbrances, and prepare notary contracts.",
      tasks: [
        {
          id: "t1-1",
          title: "Land and Mortgage Register Review",
          description: "Check 'Księga Wieczysta' for mortgages, third-party claims, or ownership disputes.",
          completed: true,
        },
        {
          id: "t1-2",
          title: "Preliminary Agreement Draft",
          description: "Review and negotiate terms of the 'Umowa przedwstępna' and confirm downpayment (Zadatek) rules.",
          completed: false,
        },
        {
          id: "t1-3",
          title: "Energy Performance Certificate",
          description: "Request building certificates and verify outstanding administrative charges from the cooperative.",
          completed: false,
        },
      ],
    },
    {
      phaseNumber: 2,
      title: "Financial & Valuation Approvals",
      duration: "Days 16 - 35",
      priority: "High",
      description: "Appraise real estate asset and secure financing or verify cross-border payment compliance.",
      tasks: [
        {
          id: "t2-1",
          title: "Certified Property Appraisal",
          description: "Arrange visit for bank-approved appraiser to issue 'Operat szacunkowy' (valuation report).",
          completed: false,
        },
        {
          id: "t2-2",
          title: "Finalize Mortgage / Proof of Funds",
          description: "Submit final valuation to lending bank or arrange secure escrow accounts for cash buy.",
          completed: false,
        },
        {
          id: "t2-3",
          title: "Tax & Notary Cost Calculation",
          description: "Calculate 2% PCC (civil law transaction tax), notary fees, and court registration costs.",
          completed: false,
        },
      ],
    },
    {
      phaseNumber: 3,
      title: "Technical Inspection & Signing",
      duration: "Days 36 - 60",
      priority: "Medium",
      description: "Complete physical inspection, notary execution, and take ownership of keys.",
      tasks: [
        {
          id: "t3-1",
          title: "Structural & Thermal Audit",
          description: "Perform comprehensive technical inspection checking plumbing, walls, and heat leaks.",
          completed: false,
        },
        {
          id: "t3-2",
          title: "Notary Deed Execution",
          description: "Sign the 'Akt notarialny' (final sales contract) at the notary and pay outstanding balance.",
          completed: false,
        },
        {
          id: "t3-3",
          title: "Handover Protocol",
          description: "Execute 'Protokół zdawczo-odbiorczy', record meter states (gas/electricity), and transfer keys.",
          completed: false,
        },
      ],
    },
  ]);

  const toggleTask = (phaseIndex: number, taskIndex: number) => {
    const updated = [...phases];
    updated[phaseIndex].tasks[taskIndex].completed = !updated[phaseIndex].tasks[taskIndex].completed;
    setPhases(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);
    setShowPlan(false);

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealDescription,
          deadline,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate plan");
      }

      const data = await response.json();
      setPhases(data.phases);
      setShowPlan(true);
      setShowToast(true);

      // Auto dismiss toast
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
      setShowPlan(true); // Keep current layout visible
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-grid-pattern relative overflow-hidden flex flex-col">
      
      {/* Background radial glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-900/80 backdrop-blur-md bg-slate-950/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Elegant SVG Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-white tracking-wide text-lg">PropTech AI</span>
              <span className="hidden sm:inline-block text-xs bg-indigo-500/10 text-indigo-400 font-medium px-2 py-0.5 rounded-full ml-2 border border-indigo-500/20">Planner</span>
            </div>
          </div>
          
          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">AI Model Live</span>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-5 right-5 z-50 backdrop-glass bg-slate-900 border-indigo-500/30 text-white rounded-xl shadow-2xl p-4 max-w-sm flex items-start gap-3 animate-bounce">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm">Plan Generated</p>
              <p className="text-xs text-slate-400 mt-0.5">The milestone roadmap was successfully updated based on your input.</p>
            </div>
          </div>
        )}

        {/* Error Toast Notification */}
        {errorMsg && (
          <div className="fixed bottom-5 right-5 z-50 backdrop-glass bg-slate-900 border-red-500/30 text-white rounded-xl shadow-2xl p-4 max-w-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20 text-red-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Generation Error</p>
              <p className="text-xs text-slate-400 mt-0.5">{errorMsg}</p>
              <button 
                onClick={() => setErrorMsg(null)}
                className="text-[10px] text-red-400 font-semibold mt-2 hover:underline focus:outline-none cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/5 rounded-full blur-[80px]" />
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-6 drop-shadow-sm leading-tight sm:leading-none">
            AI PropTech Deal &amp; Milestone Planner
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Generate instantly customized milestones, critical paths, legal audits, and financial checkpoints tailored specifically to your real estate acquisitions.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Card */}
          <div className="lg:col-span-5 backdrop-glass rounded-2xl p-6 relative overflow-hidden shadow-2xl">
            
            {/* Glowing top border */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-transparent" />
            
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <h2 className="text-lg font-bold text-white tracking-wide">Configure Acquisition Details</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2" htmlFor="deal-description">
                  Deal Description
                </label>
                <div className="relative">
                  <textarea
                    id="deal-description"
                    rows={4}
                    value={dealDescription}
                    onChange={(e) => setDealDescription(e.target.value)}
                    placeholder="Describe your property transaction (e.g. location, property type, budget, target usage)..."
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-100 placeholder-slate-600 transition-all duration-150 resize-none font-sans"
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-600 font-mono">
                    {dealDescription.length} chars
                  </div>
                </div>
              </div>

              {/* Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2" htmlFor="deadline">
                  Target Deadline
                </label>
                <div className="relative">
                  <select
                    id="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-200 transition-all duration-150 appearance-none cursor-pointer"
                  >
                    <option value="30">30 Days (Fast Track)</option>
                    <option value="60">60 Days (Standard Transaction)</option>
                    <option value="90">90 Days (Extended Due Diligence)</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Glowing hover state helper */}
                <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing &amp; Planning...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Milestone Plan</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Tips */}
            <div className="mt-8 border-t border-slate-900 pt-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Real Estate Factors Checked</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-500" />
                  Local registers (KW)
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-500" />
                  Escrow accounts
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-500" />
                  Property appraisal
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-indigo-500" />
                  Notary preparation
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Display (Mock Layout) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Timeline header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">Transactional Roadmap</h3>
                <p className="text-xs text-slate-500 mt-1">Checklist generated for Warsaw €250k Purchase (Target: {deadline} Days)</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Status</span>
                <div className="text-xs font-semibold text-indigo-400 mt-0.5">Active Drafting</div>
              </div>
            </div>

            {/* Transition loading display or mock milestone cards */}
            <div className={`space-y-6 transition-all duration-500 ${isGenerating ? "opacity-30 blur-xs scale-98 pointer-events-none" : "opacity-100"}`}>
              {showPlan && (
                phases.map((phase, pIdx) => (
                  <div key={phase.phaseNumber} className="relative group">
                    {/* Line connecting the phase items */}
                    {pIdx < phases.length - 1 && (
                      <div className="absolute left-[26px] top-12 bottom-[-24px] w-0.5 bg-slate-900 group-hover:bg-indigo-900/30 transition-colors" />
                    )}

                    <div className="backdrop-glass rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-slate-800 hover:shadow-indigo-950/10 hover:shadow-lg">
                      
                      {/* Interactive hover glow */}
                      <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

                      <div className="flex items-start gap-4">
                        
                        {/* Circle step counter */}
                        <div className="w-[52px] h-[52px] rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex flex-col items-center justify-center shrink-0 shadow-inner">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-500/60 leading-none">Phase</span>
                          <span className="text-lg font-extrabold leading-none mt-1">{phase.phaseNumber}</span>
                        </div>

                        {/* Text description details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-md font-bold text-white tracking-wide truncate">
                              {phase.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                                {phase.duration}
                              </span>
                              <span className={`text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded ${
                                phase.priority === "High" 
                                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}>
                                {phase.priority}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                            {phase.description}
                          </p>

                          {/* Nested Tasks Checklist */}
                          <div className="space-y-3 bg-slate-950/40 rounded-lg p-3 border border-slate-900/60">
                            {phase.tasks.map((task, tIdx) => (
                              <div 
                                key={task.id} 
                                className="flex items-start gap-3 cursor-pointer group/task select-none"
                                onClick={() => toggleTask(pIdx, tIdx)}
                              >
                                {/* Checkbox container */}
                                <div className="mt-0.5 shrink-0">
                                  {task.completed ? (
                                    <div className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 rounded bg-slate-900 border border-slate-700 group-hover/task:border-indigo-500/50 transition-colors" />
                                  )}
                                </div>
                                <div>
                                  <p className={`text-xs font-semibold ${task.completed ? "text-slate-500 line-through" : "text-slate-200 group-hover/task:text-white transition-colors"}`}>
                                    {task.title}
                                  </p>
                                  <p className={`text-[11px] mt-0.5 leading-relaxed ${task.completed ? "text-slate-600" : "text-slate-400"}`}>
                                    {task.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* AI Disclaimer */}
            <div className="text-slate-600 text-[10px] leading-relaxed text-center mt-6">
              AI PropTech Planner utilizes local registers and standard banking procedures. Consult licensed real estate legal counsel or notary publics to certify legal transactions in Warsaw, Poland.
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900/60 bg-slate-950/20 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} PropTech AI Planner. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Security Protocol</span>
            <span className="hover:text-slate-400 cursor-pointer">API Integration</span>
            <span className="hover:text-slate-400 cursor-pointer">Documentation</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
