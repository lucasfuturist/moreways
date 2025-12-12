import { 
  DollarSign, 
  PhoneCall, 
  FileText, 
  ShoppingBag, 
  Car, 
  Wrench, 
  Home, 
  Wifi, 
  CreditCard, 
  ShieldAlert, 
  UserX 
} from "lucide-react";

export interface ConsumerIssue {
  id: string;
  title: string;
  icon: any;
  shortDescription: string;
  potentialValue: string;
  fullDescription: string;
  examples: string[];
}

export const consumerIssues: ConsumerIssue[] = [
  {
    id: "auto-dealer-dispute",
    title: "Used Car Issues",
    icon: Car,
    shortDescription: "Hidden defects, broken promises, or warranty refusal.",
    potentialValue: "$2,000–$5,000+",
    fullDescription: "Massachusetts has strong Lemon Laws for used cars. If a dealer sold you a car that failed inspection or had undisclosed defects affecting safety or use, you may be entitled to a repair, refund, or damages.",
    examples: [
      "Car failed inspection within 7 days",
      "Dealer refused to repair safety defects",
      "Undisclosed accident history",
      "Odometer rollback"
    ]
  },
  {
    id: "debt-collection-harassment",
    title: "Debt Collection Harassment",
    icon: PhoneCall,
    shortDescription: "Repeated calls, threats, or contacting your employer.",
    potentialValue: "$1,000–$4,000+",
    fullDescription: "Debt collectors cannot harass you, call you at work if forbidden, or call more than twice a week in Massachusetts. Violations can lead to statutory damages per call.",
    examples: [
      "Calling before 8am or after 9pm",
      "Calling your workplace",
      "Threatening arrest or violence",
      "Calling more than 2x per week"
    ]
  },
  {
    id: "credit-report-errors",
    title: "Credit Reporting Errors",
    icon: FileText,
    shortDescription: "Inaccurate info on your credit report.",
    potentialValue: "$300–$1,200+",
    fullDescription: "Under the FCRA, credit bureaus must correct inaccurate information. If they fail to investigate your dispute or correct obvious errors, you may be entitled to damages.",
    examples: [
      "Accounts that don't belong to you",
      "Debts listed as 'open' that were paid",
      "Identity theft accounts",
      "Incorrect payment history"
    ]
  },
  {
    id: "online-and-retail-purchases",
    title: "Online & Retail Disputes",
    icon: ShoppingBag,
    shortDescription: "Items not delivered or refusal to refund.",
    potentialValue: "$150–$600",
    fullDescription: "If you paid for an item that never arrived, or if a seller is refusing a return that complies with their stated policy (or state law), you have rights under the Consumer Protection Act.",
    examples: [
      "Item never arrived",
      "Wrong item sent and return refused",
      "Defective product denied warranty",
      "Hidden fees at checkout"
    ]
  },
  {
    id: "contractor-home-improvement",
    title: "Contractor Issues",
    icon: Wrench,
    shortDescription: "Incomplete work, poor quality, or abandonment.",
    potentialValue: "$10,000–$15,000+",
    fullDescription: "Home improvement contractors in MA must be registered. If they abandon a job, do substandard work, or violate the contract terms, you may have a strong Chapter 93A claim.",
    examples: [
      "Contractor took deposit and disappeared",
      "Work does not meet building code",
      "Project abandoned halfway through",
      "Unlicensed work"
    ]
  },
  {
    id: "security-deposit-issues",
    title: "Landlord / Tenant",
    icon: Home,
    shortDescription: "Security deposits, conditions, or illegal eviction.",
    potentialValue: "$3,000–$4,500+",
    fullDescription: "Landlords must handle security deposits strictly (separate account, interest paid). Failure to return it within 30 days or providing a receipt can result in triple damages.",
    examples: [
      "Deposit not returned within 30 days",
      "No receipt provided for deposit",
      "Illegal deduction for 'wear and tear'",
      "Apartment conditions (heat, water)"
    ]
  },
  {
    id: "robocalls",
    title: "Robocalls & Telemarketing",
    icon: ShieldAlert,
    shortDescription: "Unwanted automated calls or texts.",
    potentialValue: "$500–$1,500 per call",
    fullDescription: "The TCPA protects you from automated marketing calls (robocalls) to your cell phone without consent. Each violation can be worth up to $1,500.",
    examples: [
      "Automated voice messages",
      "Spam text messages",
      "Calls despite being on Do-Not-Call list",
      "Spoofed numbers"
    ]
  },
  {
    id: "deceptive-practices",
    title: "Deceptive Business Practices",
    icon: UserX,
    shortDescription: "Scams, fraud, or misleading advertising.",
    potentialValue: "Varies (Triple Damages)",
    fullDescription: "Massachusetts Chapter 93A prohibits 'unfair or deceptive acts' in commerce. This catches a wide net of scams, from bait-and-switch advertising to identity theft negligence.",
    examples: [
      "Bait and switch advertising",
      "Hidden subscription fees",
      "Identity theft due to data breach",
      "Service not performed as described"
    ]
  }
];