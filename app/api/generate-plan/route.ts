import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Schema for Gemini output
const responseSchema = {
  type: "object",
  properties: {
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          phaseNumber: { type: "integer" },
          title: { type: "string" },
          duration: { type: "string" },
          priority: { type: "string" }, // "High", "Medium", "Low"
          description: { type: "string" },
          tasks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" }
              },
              required: ["title", "description"]
                }
              }
            },
            required: ["phaseNumber", "title", "duration", "priority", "description", "tasks"]
          }
        }
      },
      required: ["phases"]
    };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealDescription, deadline } = body;

    // Basic Validation
    if (!dealDescription || typeof dealDescription !== "string") {
      return NextResponse.json(
        { error: "dealDescription is required and must be a string." },
        { status: 400 }
      );
    }

    const deadlineStr = deadline ? String(deadline) : "60";
    const apiKey = process.env.AI_API_KEY;

    let responseData;

    if (apiKey && apiKey.trim() !== "") {
      console.log("AI API Key detected. Using Gemini 2.5 Flash for plan generation...");
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        You are an expert real estate lawyer, transaction coordinator, and PropTech financial advisor.
        Generate a detailed chronological milestone roadmap and transaction checklist for the following acquisition:
        
        Deal Description: "${dealDescription}"
        Target Transaction Deadline: ${deadlineStr} Days
        
        Focus on creating actionable, realistic legal title audits, local registry reviews, structural technical audits, and financial/mortgage validation checkpoints.
        Customize the requirements to the specific location and deal type if mentioned.
        Your response must fit the requested JSON schema.
      `;

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            systemInstruction: "You are an institutional-grade PropTech planner. Always return structured JSON matching the provided schema.",
          },
        });

        const textOutput = response.text;
        if (!textOutput) {
          throw new Error("Empty text output received from Gemini API");
        }

        responseData = JSON.parse(textOutput);
      } catch (geminiError: any) {
        console.error("Gemini API call failed, falling back to smart mock generator:", geminiError);
        responseData = generateSmartMockPlan(dealDescription, deadlineStr);
      }
    } else {
      console.log("AI API Key missing or empty in .env.local. Activating Smart Mock Generator...");
      responseData = generateSmartMockPlan(dealDescription, deadlineStr);
    }

    // Enrich the data with client-side requirements (completed status and IDs)
    const enrichedPhases = responseData.phases.map((phase: any, pIdx: number) => {
      const formattedPriority = ["High", "Medium", "Low"].includes(phase.priority) 
        ? phase.priority 
        : "Medium";

      return {
        phaseNumber: phase.phaseNumber || (pIdx + 1),
        title: phase.title || `Phase ${pIdx + 1}`,
        duration: phase.duration || `Days 1 - 30`,
        priority: formattedPriority,
        description: phase.description || "",
        tasks: (phase.tasks || []).map((task: any, tIdx: number) => ({
          id: `t${pIdx + 1}-${tIdx + 1}`,
          title: task.title || "Checklist Item",
          description: task.description || "",
          completed: false,
        }))
      };
    });

    return NextResponse.json({ phases: enrichedPhases });

  } catch (error: any) {
    console.error("Error generating milestone plan:", error);
    return NextResponse.json(
      { error: "Internal Server Error during roadmap generation: " + error.message },
      { status: 500 }
    );
  }
}

// Smart, keyword-based local fallback algorithm
function generateSmartMockPlan(dealDescription: string, deadlineStr: string): any {
  const deadlineDays = parseInt(deadlineStr, 10) || 60;
  
  // Extract budget
  const budgetMatch = dealDescription.match(/(?:[€$£¥]|\b(?:EUR|USD|GBP|PLN)\b)\s*\d+(?:\.\d+)?\s*[kKmMbB]?|\b\d+(?:\.\d+)?\s*(?:million|thousand|k|m|EUR|USD|GBP|PLN|PLN)\b/gi);
  const budgetText = budgetMatch ? budgetMatch[0] : "the planned budget";

  const lowerDesc = dealDescription.toLowerCase();
  
  // Determine location checks
  let locationLabel = "General";
  let locationLegalChecks = [
    {
      title: "Land Title & Ownership Registry Check",
      description: "Review local land registry databases to verify absolute ownership, liens, and boundary constraints."
    },
    {
      title: "Preliminary Purchase Agreement Review",
      description: "Draft and review the bilateral preliminary sales agreement with legal counsel."
    }
  ];

  if (lowerDesc.includes("warsaw") || lowerDesc.includes("poland") || lowerDesc.includes("polska") || lowerDesc.includes("pln")) {
    locationLabel = "Warsaw, Poland";
    locationLegalChecks = [
      {
        title: "Land Register (Księga Wieczysta) Audit",
        description: "Check the electronic KW register for division II (ownership), division III (claims/encumbrances), and division IV (mortgages)."
      },
      {
        title: "Preliminary Agreement & Zadatek Rules",
        description: "Draft the 'Umowa przedwstępna'. Set the deposit as 'Zadatek' (double refund penalty if seller defaults) rather than 'Zaliczka'."
      },
      {
        title: "Notary Office Selection",
        description: "Select a Polish notary public and coordinate documents required for the final deed."
      }
    ];
  } else if (lowerDesc.includes("berlin") || lowerDesc.includes("germany") || lowerDesc.includes("deutschland") || lowerDesc.includes("munich") || lowerDesc.includes("frankfurt")) {
    locationLabel = "Germany";
    locationLegalChecks = [
      {
        title: "Grundbuch (Land Register) Audit",
        description: "Obtain a recent copy of the Grundbuch (Abteilung I, II, and III) to verify ownership, easements, and mortgages."
      },
      {
        title: "Notarvertrag Draft Review",
        description: "Examine the draft of the purchase agreement (Kaufvertrag) prepared by the German notary public."
      },
      {
        title: "Auflassungsvormerkung Verification",
        description: "Ensure legal framework for registering a priority notice of conveyance in the Grundbuch."
      }
    ];
  } else if (lowerDesc.includes("london") || lowerDesc.includes("uk") || lowerDesc.includes("england") || lowerDesc.includes("gbp")) {
    locationLabel = "London, UK";
    locationLegalChecks = [
      {
        title: "Land Registry & Title Deeds Audit",
        description: "Verify title register and title plan via the HM Land Registry. Confirm tenure type (Leasehold vs Freehold)."
      },
      {
        title: "Conveyancing Solicitor Coordination",
        description: "Appoint a solicitor to run local authority searches, water/drainage searches, and environmental audits."
      },
      {
        title: "Stamp Duty Land Tax (SDLT) Assessment",
        description: "Calculate SDLT liability including additional property surcharges if buying as a second home or rental company."
      }
    ];
  } else if (lowerDesc.includes("new york") || lowerDesc.includes("ny") || lowerDesc.includes("california") || lowerDesc.includes("us") || lowerDesc.includes("usa") || lowerDesc.includes("dollar") || lowerDesc.includes("$")) {
    locationLabel = "United States";
    locationLegalChecks = [
      {
        title: "Title Search & Title Insurance",
        description: "Order title search report and secure owner's title insurance policy to protect against hidden claims."
      },
      {
        title: "HOA / Condo Association Review",
        description: "Examine Condo/HOA bylaws, financials, reserve funds, and meeting minutes for any pending special assessments."
      },
      {
        title: "Escrow Account Setup",
        description: "Open escrow with a reputable closing company and deposit earnest money."
      }
    ];
  }

  // Usage checks
  let categoryLabel = "Residential Home";
  let categoryTasks: any[] = [];
  
  if (lowerDesc.includes("rental") || lowerDesc.includes("investment") || lowerDesc.includes("business")) {
    categoryLabel = "Rental Property Investment";
    categoryTasks = [
      {
        title: "Rental Yield & Cashflow Model Validation",
        description: `Verify that rental cashflows cover expenses at ${budgetText} purchase price. Factor in vacancy rate and management fees.`
      },
      {
        title: "Landlord Compliance & Licensing Check",
        description: "Verify local buy-to-let regulations, fire safety compliance, and landlord registration rules."
      }
    ];
  } else if (lowerDesc.includes("commercial") || lowerDesc.includes("office") || lowerDesc.includes("retail") || lowerDesc.includes("warehouse")) {
    categoryLabel = "Commercial Investment";
    categoryTasks = [
      {
        title: "Commercial Lease & Tenant Estoppel Review",
        description: "Audit existing commercial lease agreements, check rent roll, and obtain signed estoppel certificates from current tenants."
      },
      {
        title: "Zoning & Environmental Phase I Audit",
        description: "Ensure building zoning conforms to commercial intent. Review past environmental audits (Phase I ESA)."
      }
    ];
  } else if (lowerDesc.includes("flip") || lowerDesc.includes("renovate") || lowerDesc.includes("refurbish") || lowerDesc.includes("construction")) {
    categoryLabel = "Renovation / Flip Project";
    categoryTasks = [
      {
        title: "Contractor Quotes & Renovation Budget",
        description: "Secure detailed bids from licensed general contractors. Add a 15-20% contingency reserve to the budget."
      },
      {
        title: "Local Building Permits & Structural Check",
        description: "Verify structural load-bearing walls and submit permit applications to local municipal planning offices."
      }
    ];
  } else {
    categoryTasks = [
      {
        title: "Residential Utility & Building Service Check",
        description: "Verify building administrative costs, community rules, and heating/waste disposal systems."
      }
    ];
  }

  // Calculate durations for phases
  const p1Days = Math.max(5, Math.round(deadlineDays * 0.25));
  const p2Days = Math.max(10, Math.round(deadlineDays * 0.4));
  const p3Days = Math.max(5, deadlineDays - p1Days - p2Days);

  const phases = [
    {
      phaseNumber: 1,
      title: `Phase 1: Legal Due Diligence (${locationLabel} Checks)`,
      duration: `Days 1 - ${p1Days}`,
      priority: "High",
      description: "Verify legal ownership status, title registers, encumbrances, and execute preliminary contracts.",
      tasks: [
        ...locationLegalChecks,
        {
          title: "Verify Property Area & Registration Records",
          description: "Confirm register boundaries align with physical reality of the building structure."
        }
      ]
    },
    {
      phaseNumber: 2,
      title: `Phase 2: Financial Assessment & Funding (${categoryLabel})`,
      duration: `Days ${p1Days + 1} - ${p1Days + p2Days}`,
      priority: "High",
      description: `Finalize transaction financing, complete asset appraisals, and calculate taxes for budget ${budgetText}.`,
      tasks: [
        {
          title: "Certified Property Appraisal",
          description: `Schedule inspection by an independent appraiser to issue official valuation report for ${budgetText}.`
        },
        {
          title: "Funding Verification & Bank Approvals",
          description: `Submit final application to the mortgage lender or compile proof of funds from overseas accounts.`
        },
        ...categoryTasks
      ]
    },
    {
      phaseNumber: 3,
      title: "Phase 3: Technical Inspection & Contract Closing",
      duration: `Days ${p1Days + p2Days + 1} - ${p1Days + p2Days + p3Days}`,
      priority: "Medium",
      description: "Perform structural inspections, coordinate with notary for final conveyance deed, and transfer ownership.",
      tasks: [
        {
          title: "Technical Audits (Electrical, Structural, Thermal)",
          description: "Hire a professional inspector to check walls, humidity, pipelines, electrical load capacity, and insulation."
        },
        {
          title: "Final Deed (Notary Signing) & Tax Settlement",
          description: "Coordinate signing of the final purchase agreement at notary and wire remaining transaction funds."
        },
        {
          title: "Key Handover Protocol & Meters Registration",
          description: "Complete formal handover inspection protocol, record gas/electric meter readings, and secure keys."
        }
      ]
    }
  ];

  return { phases };
}
