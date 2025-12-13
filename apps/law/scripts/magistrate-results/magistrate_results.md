[
  {
    "case_id": "batch_0_case_01",
    "intent": "Credit Reporting – Identity Theft",
    "scenario": {
      "date_noticed": "2024-02-01",
      "issue": "Unknown credit card account on report",
      "bureau_response": "Refused to investigate"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The refusal of the consumer reporting agency to investigate an unknown credit card account on the claimant's report likely violates the Fair Credit Reporting Act's requirement for reasonable procedures to ensure accuracy and proper utilization of consumer information.",
    "duration_ms": 6265
  },
  {
    "case_id": "batch_0_case_02",
    "intent": "Auto Sales – Lemon Law",
    "scenario": {
      "date_noticed": "2023-11-15",
      "issue": "Repeated transmission failure within warranty period",
      "dealer_response": "Claimed repairs resolved issue"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.85,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The facts suggest a likely violation of the warranty provisions under SECTION [urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b] due to repeated transmission failures within the warranty period, which may render the warranty illusory if the repairs did not resolve the issue.",
    "duration_ms": 3101
  },
  {
    "case_id": "batch_0_case_03",
    "intent": "Debt Collection – Harassment",
    "scenario": {
      "date_noticed": "2024-01-10",
      "issue": "Excessive phone calls at work",
      "collector_response": "Calls are within legal limits"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1:f"
    ],
    "summary": "The claim of excessive phone calls at work may constitute a violation of debt collection regulations if the calls exceed the permissible frequency. However, the facts provided are insufficient to determine the exact number of calls made, which is necessary to establish a violation.",
    "duration_ms": 3917
  },
  {
    "case_id": "batch_0_case_04",
    "intent": "Robocalls & Telemarketing – Do Not Call",
    "scenario": {
      "date_noticed": "2022-06-20",
      "issue": "Receiving calls despite being on Do Not Call list",
      "company_response": "Claimed technical error"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:10",
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:11"
    ],
    "summary": "The claim of receiving calls despite being on the Do Not Call list aligns with a potential violation of telemarketing regulations, specifically regarding the maintenance and use of the Do Not Call registry.",
    "duration_ms": 4310
  },
  {
    "case_id": "batch_0_case_05",
    "intent": "Credit Billing Errors – Unauthorized Charges",
    "scenario": {
      "date_noticed": "2023-12-05",
      "issue": "Unauthorized charges on credit card",
      "issuer_response": "Declined to reverse charges"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations for filing a dispute under the Fair Credit Billing Act.",
    "duration_ms": 3831
  },
  {
    "case_id": "batch_0_case_06",
    "intent": "Electronic Fund Transfers – Unauthorized Withdrawal",
    "scenario": {
      "date_noticed": "2024-03-15",
      "issue": "Stolen debit card used for ATM withdrawal",
      "bank_response": "Refused reimbursement"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:electronic_fund_transfer_act__efta___reg_e__:111_7bdb:a:2"
    ],
    "summary": "The facts suggest a likely violation of the Electronic Fund Transfer Act, as the bank refused reimbursement for an unauthorized transaction reported in a timely manner.",
    "duration_ms": 3617
  },
  {
    "case_id": "batch_0_case_07",
    "intent": "Home Improvement – Contractor Dispute",
    "scenario": {
      "date_noticed": "2023-09-01",
      "issue": "Incomplete work despite full payment",
      "contractor_response": "Claimed work was completed"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_1e1c:i_9400:1",
      "urn:lex:fed:truth_in_lending_act__tila_:111_1e1c:i_9400:2"
    ],
    "summary": "The facts suggest a potential issue with payment and completion of work, but lack specific details on the payment method and agreement terms.",
    "duration_ms": 4030
  },
  {
    "case_id": "batch_0_case_08",
    "intent": "Online Shopping – Subscription Traps",
    "scenario": {
      "date_noticed": "2024-02-18",
      "issue": "Charged for subscription without consent",
      "company_response": "Terms and conditions allow it"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_14:3"
    ],
    "summary": "The claim involves a potential misrepresentation regarding the nature of the business practice, specifically charging for a subscription without consent. The company's defense is based on terms and conditions, which may not sufficiently address the issue of consent.",
    "duration_ms": 3264
  },
  {
    "case_id": "batch_0_case_09",
    "intent": "Landlord/Tenant – Security Deposit",
    "scenario": {
      "date_noticed": "2022-04-10",
      "issue": "Landlord failed to return security deposit",
      "landlord_response": "Claimed damages to property"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:b_a021"
    ],
    "summary": "The landlord's failure to return the security deposit, as alleged, aligns with the prohibited acts under the cited law, specifically regarding the requirement to return the security deposit with interest and provide an itemized list of damages.",
    "duration_ms": 3255
  },
  {
    "case_id": "batch_0_case_10",
    "intent": "Auto Repairs – Warranty",
    "scenario": {
      "date_noticed": "2019-07-15",
      "issue": "Engine failure after repair, under warranty",
      "dealer_response": "Warranty does not cover issue"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The claim regarding the engine failure after repair under warranty is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3480
  },
  {
    "case_id": "batch_0_case_11",
    "intent": "Debt Collection – Workplace Calls",
    "scenario": {
      "date_noticed": "2020-11-01",
      "issue": "Debt collector calling workplace repeatedly",
      "collector_response": "Calls were necessary for collection"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1",
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_06:2"
    ],
    "summary": "The debt collector's repeated calls to the debtor's workplace likely constitute an unfair or deceptive act under Massachusetts debt collection regulations.",
    "duration_ms": 4251
  },
  {
    "case_id": "batch_0_case_12",
    "intent": "Robocalls & Telemarketing – TCPA Violation",
    "scenario": {
      "date_noticed": "2023-10-30",
      "issue": "Receiving automated calls without consent",
      "company_response": "Consent was given at signup"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a"
    ],
    "summary": "The claim involves receiving automated calls without consent, which could potentially violate telemarketing laws if consent was not properly obtained or documented. The company's response that consent was given at signup introduces ambiguity, as the nature and clarity of the consent are not detailed.",
    "duration_ms": 4580
  },
  {
    "case_id": "batch_0_case_13",
    "intent": "Credit Reporting – Incorrect Info",
    "scenario": {
      "date_noticed": "2021-05-22",
      "issue": "Old delinquent account still listed",
      "bureau_response": "Information is accurate"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The claim involves an old delinquent account still listed on a credit report, which may implicate the Fair Credit Reporting Act's requirement for consumer reporting agencies to maintain accurate information. The bureau's response that the information is accurate does not necessarily resolve the issue if the account is indeed outdated or incorrect.",
    "duration_ms": 3497
  },
  {
    "case_id": "batch_0_case_14",
    "intent": "Credit Billing Errors – Dispute",
    "scenario": {
      "date_noticed": "2024-01-23",
      "issue": "Disputed charge not investigated",
      "issuer_response": "Investigation deemed unnecessary"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a:2",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:i:ii"
    ],
    "summary": "The creditor's failure to investigate the disputed charge as required by the Fair Credit Billing Act constitutes a likely violation. The obligor provided notice of a billing error, and the creditor deemed an investigation unnecessary, which does not comply with the statutory requirements.",
    "duration_ms": 4632
  },
  {
    "case_id": "batch_0_case_15",
    "intent": "Electronic Fund Transfers – Stolen Card",
    "scenario": {
      "date_noticed": "2022-08-05",
      "issue": "Bank denied reimbursement for unauthorized transaction",
      "bank_response": "Claimed customer negligence"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_85f8:i_3796:ii_e672"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 2399
  },
  {
    "case_id": "batch_0_case_16",
    "intent": "Home Improvement – Unlicensed Contractor",
    "scenario": {
      "date_noticed": "2023-02-14",
      "issue": "Contractor unlicensed, work subpar",
      "contractor_response": "License not required for job"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 1,
    "citations": [],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 4074
  },
  {
    "case_id": "batch_0_case_17",
    "intent": "Online Shopping – Negative Option Marketing",
    "scenario": {
      "date_noticed": "2018-12-21",
      "issue": "Charged monthly after free trial",
      "company_response": "Customer agreed to terms"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:v:vii"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations. The issue was noticed on December 21, 2018, and today's date is December 13, 2025, which is well beyond the typical statute of limitations for consumer protection claims, which often range from 1 to 4 years.",
    "duration_ms": 3272
  },
  {
    "case_id": "batch_0_case_18",
    "intent": "Landlord/Tenant – Lease Violation",
    "scenario": {
      "date_noticed": "2023-07-09",
      "issue": "Landlord entered property without notice",
      "landlord_response": "Emergency maintenance needed"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:f_1f3e"
    ],
    "summary": "The claim involves a potential violation of M.G.L. c. 186, § 14, as referenced in SECTION [urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:f_1f3e], due to the landlord entering the property without notice. However, the landlord's defense of 'emergency maintenance' could justify the entry, making the violation less clear.",
    "duration_ms": 3209
  },
  {
    "case_id": "batch_0_case_19",
    "intent": "Auto Sales – Warranty",
    "scenario": {
      "date_noticed": "2024-01-05",
      "issue": "Denied warranty service on new vehicle",
      "dealer_response": "Warranty voided due to modifications"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The claimant alleges a denial of warranty service on a new vehicle due to modifications, which may align with unfair or deceptive acts if the warranty terms were not clearly communicated or if the denial was unjustified.",
    "duration_ms": 3638
  },
  {
    "case_id": "batch_0_case_20",
    "intent": "Robocalls & Telemarketing – 47 CFR 64.1200",
    "scenario": {
      "date_noticed": "2024-03-10",
      "issue": "Unsolicited telemarketing texts",
      "company_response": "Texts are informational, not promotional"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a",
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a:1"
    ],
    "summary": "The claim involves unsolicited telemarketing texts, which may fall under deceptive telemarketing practices if they are promotional. The company's defense is that the texts are informational, not promotional. The law prohibits deceptive telemarketing acts, including failing to disclose material information before a customer consents to pay for goods or services. However, the facts provided do not clearly establish whether the texts were promotional or if they required consent.",
    "duration_ms": 5422
  },
  {
    "case_id": "batch_1_case_01",
    "intent": "Credit Reporting – Identity Theft",
    "scenario": {
      "date_noticed": "2024-02-01",
      "issue": "Unknown credit card account on report",
      "bureau_response": "Refused to investigate"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The refusal of the consumer reporting agency to investigate an unknown credit card account on the claimant's report likely violates the Fair Credit Reporting Act's requirement for reasonable procedures to ensure accuracy and proper utilization of consumer information.",
    "duration_ms": 3013
  },
  {
    "case_id": "batch_1_case_02",
    "intent": "Auto Sales & Repairs – Lemon Law",
    "scenario": {
      "date_noticed": "2023-11-15",
      "issue": "Repeated engine failure within warranty",
      "dealer_response": "Refused replacement"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The facts suggest a likely violation of the warranty provisions under SECTION [urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b] due to the dealer's refusal to replace the engine despite repeated failures within the warranty period.",
    "duration_ms": 3251
  },
  {
    "case_id": "batch_1_case_03",
    "intent": "Debt Collection – Harassment",
    "scenario": {
      "date_noticed": "2019-07-20",
      "issue": "Multiple calls per day",
      "collector_response": "Continued harassment"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1:f"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations. The alleged issue occurred in 2019, and the current date is 2025, which exceeds the typical statute of limitations for debt collection claims.",
    "duration_ms": 4112
  },
  {
    "case_id": "batch_1_case_04",
    "intent": "Robocalls & Telemarketing – Do Not Call",
    "scenario": {
      "date_noticed": "2024-03-10",
      "issue": "Repeated calls despite registration",
      "company_response": "Ignored opt-out requests"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:10",
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:11"
    ],
    "summary": "The facts indicate a likely violation of telemarketing regulations due to the company's failure to honor opt-out requests, which is a violation of the do-not-call provisions.",
    "duration_ms": 4517
  },
  {
    "case_id": "batch_1_case_05",
    "intent": "Credit Billing Errors – Unauthorized Charges",
    "scenario": {
      "date_noticed": "2024-01-25",
      "issue": "Charge for unrecognized purchase",
      "creditor_response": "Denied refund"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:b:1",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:i"
    ],
    "summary": "The claimant's issue of an unrecognized purchase charge aligns with the definition of a billing error under the Fair Credit Billing Act. The creditor's denial of a refund without proper investigation or correction suggests non-compliance with statutory requirements.",
    "duration_ms": 5458
  },
  {
    "case_id": "batch_1_case_06",
    "intent": "Electronic Fund Transfers – Stolen Debit Card",
    "scenario": {
      "date_noticed": "2025-05-05",
      "issue": "Unauthorized ATM withdrawal",
      "bank_response": "Delayed investigation"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_85f8:i_3796:ii_e672"
    ],
    "summary": "The facts suggest a potential issue with an unauthorized ATM withdrawal, which may involve an electronic fund transfer as defined by the law. However, the facts provided do not clearly establish whether the transaction involved a balance inquiry or other elements necessary to fully apply the cited law.",
    "duration_ms": 2809
  },
  {
    "case_id": "batch_1_case_07",
    "intent": "Home Improvement – Contractor Disputes",
    "scenario": {
      "date_noticed": "2023-09-15",
      "issue": "Incomplete work",
      "contractor_response": "Refused to complete project"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3049
  },
  {
    "case_id": "batch_1_case_08",
    "intent": "Online Shopping – Subscription Traps",
    "scenario": {
      "date_noticed": "2024-02-18",
      "issue": "Unable to cancel subscription",
      "company_response": "Ignored cancellation requests"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_14:3"
    ],
    "summary": "The facts suggest a potential unfair trade practice due to the company's failure to respond to cancellation requests, which may misrepresent the nature of the business's commitment to customer service. However, the specific law cited pertains to misrepresentation of the nature of business, and the connection to the facts is not explicit.",
    "duration_ms": 4092
  },
  {
    "case_id": "batch_1_case_09",
    "intent": "Landlord/Tenant – Security Deposits",
    "scenario": {
      "date_noticed": "2018-06-01",
      "issue": "Deposit not returned after move-out",
      "landlord_response": "Claimed excessive damages"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:b_a021"
    ],
    "summary": "The claim regarding the non-return of the security deposit is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3904
  },
  {
    "case_id": "batch_1_case_10",
    "intent": "Credit Reporting – Incorrect Info",
    "scenario": {
      "date_noticed": "2020-11-30",
      "issue": "Wrong address listed",
      "bureau_response": "Corrected after delay"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.85,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The facts suggest a likely violation of the Fair Credit Reporting Act's requirement for consumer reporting agencies to adopt reasonable procedures to ensure the accuracy of consumer information. The issue of a wrong address being listed and only corrected after a delay indicates a potential failure to maintain accurate and timely consumer information.",
    "duration_ms": 3649
  },
  {
    "case_id": "batch_1_case_11",
    "intent": "Auto Sales & Repairs – Warranty",
    "scenario": {
      "date_noticed": "2023-08-20",
      "issue": "Transmission failure outside warranty period",
      "dealer_response": "Refused repair"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The claim regarding the transmission failure outside the warranty period is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3320
  },
  {
    "case_id": "batch_1_case_12",
    "intent": "Debt Collection – Workplace Calls",
    "scenario": {
      "date_noticed": "2025-03-25",
      "issue": "Debt collector contacted employer",
      "collector_response": "Ceased after complaint"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.5,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations"
    ],
    "summary": "AI analysis failed. Defaulting to manual review.",
    "duration_ms": 2914
  },
  {
    "case_id": "batch_1_case_13",
    "intent": "Robocalls & Telemarketing – TCPA",
    "scenario": {
      "date_noticed": "2025-02-05",
      "issue": "Unauthorized automated marketing calls",
      "company_response": "Claimed prior consent"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a"
    ],
    "summary": "The claim of unauthorized automated marketing calls could potentially violate telemarketing laws if the company did not have prior consent from the customer. The company's response of 'claimed prior consent' suggests a defense, but without evidence of such consent, a violation is plausible.",
    "duration_ms": 4156
  },
  {
    "case_id": "batch_1_case_14",
    "intent": "Credit Billing Errors – Disputes",
    "scenario": {
      "date_noticed": "2024-04-10",
      "issue": "Double-billed for a single purchase",
      "creditor_response": "Refund issued after delay"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a:1",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a:2",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a:3",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:b:1"
    ],
    "summary": "The facts suggest a likely violation of the Fair Credit Billing Act due to a billing error where the obligor was double-billed for a single purchase. The creditor's delayed response in issuing a refund aligns with the obligations under the Act.",
    "duration_ms": 4955
  },
  {
    "case_id": "batch_1_case_15",
    "intent": "Electronic Fund Transfers – Unauthorized Withdrawal",
    "scenario": {
      "date_noticed": "2015-09-18",
      "issue": "Old unauthorized withdrawal",
      "bank_response": "Claimed statute of limitations expired"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 1,
    "citations": [
      "urn:lex:fed:electronic_fund_transfer_act__efta___reg_e__:111_7bdb:a:2"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 2564
  },
  {
    "case_id": "batch_1_case_16",
    "intent": "Home Improvement – Contractor Disputes",
    "scenario": {
      "date_noticed": "2022-07-12",
      "issue": "Overcharged for materials",
      "contractor_response": "Provided partial refund"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.5,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_1e1c:i_9400"
    ],
    "summary": "AI analysis failed. Defaulting to manual review.",
    "duration_ms": 3819
  },
  {
    "case_id": "batch_1_case_17",
    "intent": "Online Shopping – Negative Option Marketing",
    "scenario": {
      "date_noticed": "2025-01-15",
      "issue": "Unwanted product shipment",
      "company_response": "Refunded after multiple requests"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:v:vii"
    ],
    "summary": "The facts suggest a potential violation of the negative option feature disclosure requirements, but lack specific details about the terms and conditions communicated to the customer.",
    "duration_ms": 3906
  },
  {
    "case_id": "batch_1_case_18",
    "intent": "Landlord/Tenant – Lease Violations",
    "scenario": {
      "date_noticed": "2023-05-01",
      "issue": "Unauthorized rent increase",
      "landlord_response": "Leased amended after dispute"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:f_1f3e"
    ],
    "summary": "The claim involves an unauthorized rent increase, which may constitute a willful violation of M.G.L. c. 186, § 14 if it was done without proper legal basis. The landlord's response indicates a lease amendment after the dispute, which could imply acknowledgment of the issue. However, the facts are vague regarding the specifics of the violation and whether it was indeed willful.",
    "duration_ms": 3824
  },
  {
    "case_id": "batch_1_case_19",
    "intent": "Credit Reporting – Identity Theft",
    "scenario": {
      "date_noticed": "2017-03-14",
      "issue": "Social security number used fraudulently",
      "bureau_response": "Resolved after prolonged delay"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations. The issue was noticed on March 14, 2017, and the current date is December 13, 2025, which is well beyond the typical statute of limitations for claims under the Fair Credit Reporting Act.",
    "duration_ms": 3354
  },
  {
    "case_id": "batch_1_case_20",
    "intent": "Robocalls & Telemarketing – Do Not Call",
    "scenario": {
      "date_noticed": "2019-11-20",
      "issue": "Sales calls to unlisted number",
      "company_response": "Continued despite complaints"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a"
    ],
    "summary": "The claim regarding sales calls to an unlisted number is ineligible due to the statute of limitations having expired. The issue was noticed on 2019-11-20, which is more than six years prior to today's date, 2025-12-13. Typically, telemarketing violations have a statute of limitations of four years.",
    "duration_ms": 4852
  },
  {
    "case_id": "batch_2_case_01",
    "intent": "Credit Reporting – Identity Theft",
    "scenario": {
      "date_noticed": "2024-02-01",
      "issue": "Unknown credit card account on report",
      "bureau_response": "Refused to investigate"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The consumer reporting agency's refusal to investigate an unknown credit card account on the claimant's report likely violates the Fair Credit Reporting Act's requirement for reasonable procedures to ensure accuracy and proper utilization of consumer information.",
    "duration_ms": 3259
  },
  {
    "case_id": "batch_2_case_02",
    "intent": "Auto Sales & Repairs – Lemon Law",
    "scenario": {
      "date_noticed": "2023-11-15",
      "issue": "Repeated transmission failures in new car",
      "dealer_response": "Refused refund or replacement"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.85,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The facts suggest a likely violation of consumer protection laws regarding warranties, as the dealer's refusal to provide a refund or replacement for repeated transmission failures in a new car may render the warranty illusory.",
    "duration_ms": 3518
  },
  {
    "case_id": "batch_2_case_03",
    "intent": "Debt Collection – Harassment",
    "scenario": {
      "date_noticed": "2023-12-01",
      "issue": "Repeated calls at workplace despite requests to stop",
      "collector_response": "Continued calling"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1",
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1:f"
    ],
    "summary": "The facts indicate a likely violation of debt collection regulations due to repeated calls to the debtor's workplace despite requests to cease such communications.",
    "duration_ms": 3603
  },
  {
    "case_id": "batch_2_case_04",
    "intent": "Robocalls & Telemarketing – TCPA",
    "scenario": {
      "date_noticed": "2019-05-10",
      "issue": "Unsolicited robocalls despite being on Do Not Call list",
      "company_response": "Claimed mistake"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:11"
    ],
    "summary": "The claim regarding unsolicited robocalls despite being on the Do Not Call list is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3717
  },
  {
    "case_id": "batch_2_case_05",
    "intent": "Credit Billing Errors – Unauthorized Charges",
    "scenario": {
      "date_noticed": "2024-01-20",
      "issue": "Unauthorized charges on credit card",
      "issuer_response": "Refused to reverse charges"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a:1",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a:2",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:b:1",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:e"
    ],
    "summary": "The facts suggest a likely violation of the Fair Credit Billing Act due to the issuer's refusal to reverse unauthorized charges, which constitutes a billing error under the Act.",
    "duration_ms": 5434
  },
  {
    "case_id": "batch_2_case_06",
    "intent": "Electronic Fund Transfers – Unauthorized Withdrawal",
    "scenario": {
      "date_noticed": "2022-03-15",
      "issue": "Stolen debit card used for unauthorized withdrawal",
      "bank_response": "Denied reimbursement"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:electronic_fund_transfer_act__efta___reg_e__:111_7bdb:a:2"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations for reporting unauthorized electronic fund transfers.",
    "duration_ms": 3621
  },
  {
    "case_id": "batch_2_case_07",
    "intent": "Home Improvement – Contractor Disputes",
    "scenario": {
      "date_noticed": "2023-07-30",
      "issue": "Incomplete work on home renovation",
      "contractor_response": "Refused to complete project"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [],
    "summary": "The claim regarding incomplete work on home renovation is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 2826
  },
  {
    "case_id": "batch_2_case_08",
    "intent": "Online Shopping – Subscription Traps",
    "scenario": {
      "date_noticed": "2024-02-15",
      "issue": "Automatic renewal of subscription without consent",
      "company_response": "Claimed user agreed in terms"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_14:3"
    ],
    "summary": "The claim involves an automatic renewal of a subscription without consent, which may constitute a misrepresentation of the nature of business under the cited law. However, the company's defense that the user agreed to the terms introduces ambiguity.",
    "duration_ms": 2944
  },
  {
    "case_id": "batch_2_case_09",
    "intent": "Landlord/Tenant – Security Deposits",
    "scenario": {
      "date_noticed": "2020-09-20",
      "issue": "Security deposit not returned after lease ended",
      "landlord_response": "Claimed damage to property"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:b_a021"
    ],
    "summary": "The landlord's failure to return the security deposit after the lease ended, coupled with the claim of property damage, suggests a likely violation of the requirements under SECTION [urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:b_a021]. The law mandates that any deductions from the security deposit for damages must be accompanied by an itemized list and evidence of repair costs, which is not mentioned in the facts.",
    "duration_ms": 3561
  },
  {
    "case_id": "batch_2_case_10",
    "intent": "Auto Sales & Repairs – Warranty",
    "scenario": {
      "date_noticed": "2023-06-10",
      "issue": "Refusal to honor warranty on faulty part",
      "dealer_response": "Stated warranty expired"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.85,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The refusal to honor a warranty on a faulty part may constitute a violation under SECTION [urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b] if the warranty was represented in a way that made it illusory or if the terms were not clearly communicated to the consumer.",
    "duration_ms": 3630
  },
  {
    "case_id": "batch_2_case_11",
    "intent": "Debt Collection – Workplace Calls",
    "scenario": {
      "date_noticed": "2023-08-15",
      "issue": "Debt collector contacting workplace after hours",
      "collector_response": "Ignored requests to stop"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1",
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_05:3"
    ],
    "summary": "The debt collector's actions of contacting the debtor's workplace after hours and ignoring requests to stop likely constitute an unfair or deceptive act under Massachusetts debt collection regulations.",
    "duration_ms": 3823
  },
  {
    "case_id": "batch_2_case_12",
    "intent": "Robocalls & Telemarketing – Do Not Call",
    "scenario": {
      "date_noticed": "2021-02-25",
      "issue": "Repeated telemarketing calls despite registration on Do Not Call list",
      "company_response": "Claimed calls were not telemarketing"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:10",
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:11"
    ],
    "summary": "The facts suggest a likely violation of telemarketing regulations due to repeated calls to a number registered on the Do Not Call list, which is prohibited under the law.",
    "duration_ms": 4177
  },
  {
    "case_id": "batch_2_case_13",
    "intent": "Credit Reporting – Incorrect Information",
    "scenario": {
      "date_noticed": "2022-11-05",
      "issue": "Incorrect late payment listed on report",
      "bureau_response": "Refused to correct"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:3009_4f3f:a_0e6c"
    ],
    "summary": "The facts suggest a likely violation of the consumer's rights under the Truth in Lending Act, as the credit bureau refused to correct an incorrect late payment listing, which the consumer has the right to dispute.",
    "duration_ms": 3542
  },
  {
    "case_id": "batch_2_case_14",
    "intent": "Credit Billing Errors – Disputes",
    "scenario": {
      "date_noticed": "2023-10-12",
      "issue": "Disputed charge not resolved within 60 days",
      "issuer_response": "Claimed investigation ongoing"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a:3",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:i:ii"
    ],
    "summary": "The creditor appears to have failed to resolve the disputed charge within the required timeframe, as mandated by the Fair Credit Billing Act. The notice of dispute was given on 2023-10-12, and the creditor has not resolved the issue within the 60-day period, nor provided a written explanation or clarification as required.",
    "duration_ms": 4766
  },
  {
    "case_id": "batch_2_case_15",
    "intent": "Electronic Fund Transfers – Stolen Debit Card",
    "scenario": {
      "date_noticed": "2021-06-25",
      "issue": "Unauthorized transactions after card reported stolen",
      "bank_response": "Refused to reimburse due to late reporting"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_85f8:i_3796:ii_e672"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 2674
  },
  {
    "case_id": "batch_2_case_16",
    "intent": "Home Improvement – Contractor Disputes",
    "scenario": {
      "date_noticed": "2023-03-15",
      "issue": "Contractor used substandard materials",
      "contractor_response": "Claimed materials met contract specifications"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [],
    "summary": "The claim regarding the contractor's use of substandard materials is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3273
  },
  {
    "case_id": "batch_2_case_17",
    "intent": "Online Shopping – Negative Option Marketing",
    "scenario": {
      "date_noticed": "2024-01-05",
      "issue": "Charged for membership not explicitly agreed to",
      "company_response": "Terms included in small print"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:v:vii"
    ],
    "summary": "The facts suggest a likely violation of the law regarding negative option features, as the company failed to clearly disclose the material terms and conditions of the negative option feature, including the automatic charge to the customer's account.",
    "duration_ms": 3707
  },
  {
    "case_id": "batch_2_case_18",
    "intent": "Landlord/Tenant – Lease Violations",
    "scenario": {
      "date_noticed": "2025-02-01",
      "issue": "Unlawful entry by landlord without notice",
      "landlord_response": "Claimed emergency situation"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:f_1f3e"
    ],
    "summary": "The claim involves an alleged unlawful entry by the landlord without notice, which could potentially violate M.G.L. c. 186, § 14 if the entry was not justified by an emergency. The landlord's defense of an emergency situation needs further examination to determine its validity.",
    "duration_ms": 3569
  },
  {
    "case_id": "batch_2_case_19",
    "intent": "Auto Sales & Repairs – Lemon Law",
    "scenario": {
      "date_noticed": "2018-04-01",
      "issue": "Persistent engine failure in new vehicle",
      "dealer_response": "Offered partial refund outside lemon law coverage"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The claim regarding the persistent engine failure in a new vehicle is ineligible due to the expiration of the statute of limitations. The issue was noticed on April 1, 2018, and today's date is December 13, 2025, which exceeds the typical statute of limitations for Lemon Law claims and contract disputes.",
    "duration_ms": 4345
  },
  {
    "case_id": "batch_2_case_20",
    "intent": "Debt Collection – Harassment",
    "scenario": {
      "date_noticed": "2025-01-20",
      "issue": "Threatening language used by debt collector",
      "collector_response": "Denied using threats"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1:b",
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_07:8"
    ],
    "summary": "The claim involves the use of threatening language by a debt collector, which could constitute an unfair or deceptive act under the debt collection regulations. However, the collector denies using threats, and there is no additional evidence provided to substantiate the claim.",
    "duration_ms": 3862
  },
  {
    "case_id": "batch_3_case_01",
    "intent": "Credit Reporting – Identity Theft",
    "scenario": {
      "date_noticed": "2024-02-01",
      "issue": "Unknown credit card account on report",
      "bureau_response": "Refused to investigate"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The consumer reporting agency's refusal to investigate an unknown credit card account on the claimant's report likely violates the Fair Credit Reporting Act's requirement for reasonable procedures to ensure accuracy and proper utilization of consumer information.",
    "duration_ms": 3085
  },
  {
    "case_id": "batch_3_case_02",
    "intent": "Auto Sales & Repairs – Lemon Law",
    "scenario": {
      "date_noticed": "2023-11-15",
      "issue": "New car with recurring engine issues",
      "dealer_response": "Denied replacement"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.5,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "AI analysis failed. Defaulting to manual review.",
    "duration_ms": 3796
  },
  {
    "case_id": "batch_3_case_03",
    "intent": "Debt Collection – Harassment",
    "scenario": {
      "date_noticed": "2022-05-10",
      "issue": "Repeated calls after 9 PM",
      "collector_response": "Claimed permissible"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1:g"
    ],
    "summary": "The facts indicate a likely violation of debt collection regulations due to repeated calls after 9 PM, which is considered an unfair or deceptive act.",
    "duration_ms": 3742
  },
  {
    "case_id": "batch_3_case_04",
    "intent": "Robocalls & Telemarketing – Do Not Call",
    "scenario": {
      "date_noticed": "2021-08-20",
      "issue": "Unsolicited sales calls despite registration",
      "company_response": "Blamed technical error"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.85,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:10",
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:11"
    ],
    "summary": "The facts suggest a likely violation of telemarketing regulations due to unsolicited sales calls despite the claimant's registration on a do-not-call list. The company's response of a 'technical error' does not negate the potential violation.",
    "duration_ms": 4346
  },
  {
    "case_id": "batch_3_case_05",
    "intent": "Credit Billing Errors – Unauthorized Charges",
    "scenario": {
      "date_noticed": "2020-12-05",
      "issue": "Unauthorized charge on credit card",
      "issuer_response": "Refused to reverse charge"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 1,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:b:1"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations. The notice of the issue was given on 2020-12-05, and today's date is 2025-12-13, which exceeds the typical statute of limitations for such claims under the Fair Credit Billing Act.",
    "duration_ms": 4651
  },
  {
    "case_id": "batch_3_case_06",
    "intent": "Electronic Fund Transfers – Unauthorized Withdrawal",
    "scenario": {
      "date_noticed": "2024-03-22",
      "issue": "Stolen debit card used for withdrawal",
      "bank_response": "Delayed investigation"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:electronic_fund_transfer_act__efta___reg_e__:111_7bdb:a:2"
    ],
    "summary": "The facts suggest a potential violation of the Electronic Fund Transfer Act, specifically regarding the unauthorized use of a stolen debit card. However, the timeliness of the consumer's notification to the financial institution and the bank's response are not fully detailed.",
    "duration_ms": 3292
  },
  {
    "case_id": "batch_3_case_07",
    "intent": "Home Improvement – Contractor Disputes",
    "scenario": {
      "date_noticed": "2019-07-30",
      "issue": "Incomplete kitchen renovation",
      "contractor_response": "Requested more payment"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_1e1c:i_9400:1",
      "urn:lex:fed:truth_in_lending_act__tila_:111_1e1c:i_9400:2"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations for contract-related issues.",
    "duration_ms": 2810
  },
  {
    "case_id": "batch_3_case_08",
    "intent": "Online Shopping – Subscription Traps",
    "scenario": {
      "date_noticed": "2024-01-10",
      "issue": "Recurring charges after free trial",
      "company_response": "Refused cancellation"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_14:3"
    ],
    "summary": "The facts suggest a potential misrepresentation regarding the nature of the business practice, specifically concerning recurring charges after a free trial. However, the details are insufficient to conclusively determine a violation of the cited law.",
    "duration_ms": 3877
  },
  {
    "case_id": "batch_3_case_09",
    "intent": "Landlord/Tenant – Security Deposits",
    "scenario": {
      "date_noticed": "2018-04-15",
      "issue": "Deposit not returned after lease ended",
      "landlord_response": "Cited damage without proof"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:b_a021"
    ],
    "summary": "The landlord's failure to return the security deposit and provide proof of damage aligns with the prohibited acts under the cited law.",
    "duration_ms": 3038
  },
  {
    "case_id": "batch_3_case_10",
    "intent": "Credit Reporting – Incorrect Info",
    "scenario": {
      "date_noticed": "2025-05-14",
      "issue": "Old debt incorrectly listed",
      "bureau_response": "Delayed correction"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.85,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The facts suggest a likely violation of the Fair Credit Reporting Act's requirement for consumer reporting agencies to adopt reasonable procedures to ensure the accuracy of consumer information. The delayed correction of an incorrectly listed old debt indicates a potential failure to maintain such procedures.",
    "duration_ms": 3498
  },
  {
    "case_id": "batch_3_case_11",
    "intent": "Auto Sales & Repairs – Warranty",
    "scenario": {
      "date_noticed": "2024-06-01",
      "issue": "Warranty claim denied for covered part",
      "dealer_response": "Claimed wear and tear"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The denial of a warranty claim for a covered part due to 'wear and tear' may constitute an unfair or deceptive act if the warranty terms are so limited as to render the warranty illusory. The facts suggest a potential misrepresentation of warranty coverage.",
    "duration_ms": 3588
  },
  {
    "case_id": "batch_3_case_12",
    "intent": "Debt Collection – Workplace Calls",
    "scenario": {
      "date_noticed": "2017-09-12",
      "issue": "Calls to work despite request to stop",
      "collector_response": "Ignored request"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1:h"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations. The issue was noticed on 2017-09-12, and today's date is 2025-12-13, which is over eight years later. This exceeds the typical statute of limitations for debt collection practices.",
    "duration_ms": 3744
  },
  {
    "case_id": "batch_3_case_13",
    "intent": "Robocalls & Telemarketing – TCPA",
    "scenario": {
      "date_noticed": "2016-11-05",
      "issue": "Automated calls with no opt-out option",
      "company_response": "Promised to fix but continued"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 1,
    "citations": [],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations. The issue was noticed on 2016-11-05, which is over nine years ago, well beyond the typical statute of limitations for telemarketing violations.",
    "duration_ms": 3436
  },
  {
    "case_id": "batch_3_case_14",
    "intent": "Credit Billing Errors – Disputes",
    "scenario": {
      "date_noticed": "2023-02-15",
      "issue": "Billing dispute not resolved",
      "issuer_response": "Claimed user error"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations for filing a billing dispute under the Fair Credit Billing Act.",
    "duration_ms": 3308
  },
  {
    "case_id": "batch_3_case_15",
    "intent": "Electronic Fund Transfers – Stolen Debit Card",
    "scenario": {
      "date_noticed": "2022-10-10",
      "issue": "Unauthorized online purchases",
      "bank_response": "Partially refunded"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_85f8:i_3796:ii_e672"
    ],
    "summary": "The claim regarding unauthorized online purchases is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3272
  },
  {
    "case_id": "batch_3_case_16",
    "intent": "Home Improvement – Contractor Disputes",
    "scenario": {
      "date_noticed": "2021-03-25",
      "issue": "Poor quality roofing work",
      "contractor_response": "Denied issue"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [],
    "summary": "The claim regarding poor quality roofing work is ineligible due to the expiration of the statute of limitations for contract-related issues.",
    "duration_ms": 3045
  },
  {
    "case_id": "batch_3_case_17",
    "intent": "Online Shopping – Negative Option Marketing",
    "scenario": {
      "date_noticed": "2025-07-18",
      "issue": "Charged for additional services not agreed upon",
      "company_response": "Offered partial refund"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:v:vii"
    ],
    "summary": "The facts suggest a potential violation of the negative option feature disclosure requirements under SECTION [urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:v:vii]. The customer was charged for additional services not agreed upon, which may indicate a failure to disclose material terms of a negative option feature.",
    "duration_ms": 3449
  },
  {
    "case_id": "batch_3_case_18",
    "intent": "Landlord/Tenant – Lease Violations",
    "scenario": {
      "date_noticed": "2020-06-05",
      "issue": "Landlord entered without notice",
      "landlord_response": "Ignored complaint"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:f_1f3e"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 2975
  },
  {
    "case_id": "batch_3_case_19",
    "intent": "Credit Reporting – Identity Theft",
    "scenario": {
      "date_noticed": "2015-12-20",
      "issue": "Multiple fraudulent accounts opened",
      "bureau_response": "Delayed response"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The claim regarding the delayed response to fraudulent accounts opened in 2015 is ineligible due to the expiration of the statute of limitations. The Fair Credit Reporting Act (FCRA) typically allows for a two-year statute of limitations from the date of discovery of the violation, or five years from the date of the violation, whichever is earlier.",
    "duration_ms": 4103
  },
  {
    "case_id": "batch_3_case_20",
    "intent": "Auto Sales & Repairs – Lemon Law",
    "scenario": {
      "date_noticed": "2019-01-08",
      "issue": "Car repeatedly fails emissions tests",
      "dealer_response": "Offered temporary fix"
    },
    "expected_bias": "GRAY AREA",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations. The issue was noticed in 2019, and the current date is 2025, which exceeds the typical statute of limitations for warranty claims.",
    "duration_ms": 4752
  },
  {
    "case_id": "batch_4_case_01",
    "intent": "Credit Reporting – Identity Theft",
    "scenario": {
      "date_noticed": "2024-02-01",
      "issue": "Unknown credit card account on report",
      "bureau_response": "Refused to investigate"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.85,
    "citations": [
      "urn:lex:fed:fair_credit_reporting_act__fcra__:15:b"
    ],
    "summary": "The refusal of the consumer reporting agency to investigate an unknown credit card account on the claimant's report likely violates the Fair Credit Reporting Act's requirement for reasonable procedures to ensure accuracy and proper utilization of consumer information.",
    "duration_ms": 3074
  },
  {
    "case_id": "batch_4_case_02",
    "intent": "Auto Sales & Repairs – Lemon Law",
    "scenario": {
      "date_noticed": "2023-06-15",
      "issue": "Car repeatedly breaks down after purchase",
      "dealer_response": "Denied replacement"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The facts suggest a potential violation of warranty terms under SECTION [urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b], as the car repeatedly breaks down and the dealer has denied replacement. However, the details of the warranty terms and conditions are not provided, making it unclear if the warranty is illusory.",
    "duration_ms": 4272
  },
  {
    "case_id": "batch_4_case_03",
    "intent": "Debt Collection – Harassment",
    "scenario": {
      "date_noticed": "2024-03-10",
      "issue": "Repeated calls by debt collector at work",
      "collector_response": "Continued calls despite requests to stop"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1:f",
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_04:1:h"
    ],
    "summary": "The facts indicate a likely violation of debt collection regulations due to repeated calls by the debt collector at the debtor's workplace despite requests to stop, which aligns with prohibited acts under the law.",
    "duration_ms": 3881
  },
  {
    "case_id": "batch_4_case_04",
    "intent": "Robocalls & Telemarketing – Do Not Call",
    "scenario": {
      "date_noticed": "2025-01-20",
      "issue": "Receiving robocalls despite being on Do Not Call list",
      "company_response": "No action taken"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:10",
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_4:11"
    ],
    "summary": "The facts indicate a likely violation of telemarketing regulations as the claimant received robocalls despite being on the Do Not Call list, and the company took no action in response. This aligns with the prohibited conduct under the telemarketing rules.",
    "duration_ms": 5447
  },
  {
    "case_id": "batch_4_case_05",
    "intent": "Credit Billing Errors – Unauthorized Charges",
    "scenario": {
      "date_noticed": "2024-11-05",
      "issue": "Unauthorized charge on credit card",
      "issuer_response": "Refused to remove charge"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:b:1"
    ],
    "summary": "The facts suggest a likely violation of the Fair Credit Billing Act due to the issuer's refusal to remove an unauthorized charge, which constitutes a billing error under the Act.",
    "duration_ms": 3201
  },
  {
    "case_id": "batch_4_case_06",
    "intent": "Electronic Fund Transfers – Unauthorized Withdrawal",
    "scenario": {
      "date_noticed": "2023-12-12",
      "issue": "Unauthorized ATM withdrawal",
      "bank_response": "Delayed investigation"
    },
    "expected_bias": "Gray Area",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:electronic_fund_transfer_act__efta___reg_e__:111_7bdb:a:2"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations for reporting unauthorized electronic fund transfers.",
    "duration_ms": 3619
  },
  {
    "case_id": "batch_4_case_07",
    "intent": "Home Improvement – Contractor Dispute",
    "scenario": {
      "date_noticed": "2025-04-01",
      "issue": "Contractor did not complete work as agreed",
      "contractor_response": "Ignored complaints"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.6,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_1e1c:i_9400:1",
      "urn:lex:fed:truth_in_lending_act__tila_:111_1e1c:i_9400:2"
    ],
    "summary": "The facts suggest a potential issue with the contractor not completing work as agreed, which may relate to payment terms under the Truth in Lending Act. However, the facts do not clearly establish whether the payment was made in accordance with the specified sections of the law.",
    "duration_ms": 4215
  },
  {
    "case_id": "batch_4_case_08",
    "intent": "Online Shopping – Subscription Traps",
    "scenario": {
      "date_noticed": "2022-08-14",
      "issue": "Charged for subscription without consent",
      "company_response": "Refused to cancel"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_14:3"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 7617
  },
  {
    "case_id": "batch_4_case_09",
    "intent": "Landlord/Tenant – Security Deposits",
    "scenario": {
      "date_noticed": "2019-03-22",
      "issue": "Landlord withheld security deposit without reason",
      "landlord_response": "Provided no explanation"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:b_a021"
    ],
    "summary": "The claim regarding the landlord's withholding of the security deposit is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3989
  },
  {
    "case_id": "batch_4_case_10",
    "intent": "Auto Sales & Repairs – Warranty",
    "scenario": {
      "date_noticed": "2018-07-01",
      "issue": "Warranty not honored for engine repair",
      "dealer_response": "Claimed issue not covered"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "The claim regarding the warranty not being honored for engine repair is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 3848
  },
  {
    "case_id": "batch_4_case_11",
    "intent": "Debt Collection – Workplace Calls",
    "scenario": {
      "date_noticed": "2020-02-18",
      "issue": "Collector contacted employer about debt",
      "collector_response": "Claimed it was legal"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.9,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_06:1:a"
    ],
    "summary": "The debt collector's contact with the debtor's employer about the debt likely constitutes an unfair or deceptive act under the debt collection regulations.",
    "duration_ms": 3254
  },
  {
    "case_id": "batch_4_case_12",
    "intent": "Robocalls & Telemarketing – TCPA Violation",
    "scenario": {
      "date_noticed": "2023-09-10",
      "issue": "Received unsolicited telemarketing texts",
      "company_response": "Apologized but continued"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a",
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:a:1"
    ],
    "summary": "The facts suggest a potential violation of telemarketing regulations due to the receipt of unsolicited telemarketing texts, which may align with prohibited deceptive telemarketing acts. However, the facts are vague regarding specific elements such as the nature of the texts and whether they included required disclosures.",
    "duration_ms": 5581
  },
  {
    "case_id": "batch_4_case_13",
    "intent": "Credit Reporting – Incorrect Information",
    "scenario": {
      "date_noticed": "2024-06-30",
      "issue": "Incorrect late payment reported",
      "bureau_response": "Corrected but took over 6 months"
    },
    "expected_bias": "Gray Area",
    "actual_verdict": "LIKELY_VIOLATION",
    "confidence": 0.85,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:3009_4f3f:a_0e6c"
    ],
    "summary": "The credit bureau took over 6 months to correct an incorrect late payment, which may indicate a failure to follow reasonable procedures to ensure accurate reporting as required by law.",
    "duration_ms": 3063
  },
  {
    "case_id": "batch_4_case_14",
    "intent": "Credit Billing Errors – Disputes",
    "scenario": {
      "date_noticed": "2021-05-03",
      "issue": "Billing dispute over returned merchandise",
      "issuer_response": "Refused refund"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:a",
      "urn:lex:fed:fair_credit_billing_act__fcba_:15:b:3"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations. The notice of the billing dispute was given on 2021-05-03, and today's date is 2025-12-13, which exceeds the typical statute of limitations for such claims.",
    "duration_ms": 4739
  },
  {
    "case_id": "batch_4_case_15",
    "intent": "Electronic Fund Transfers – Stolen Debit Card",
    "scenario": {
      "date_noticed": "2025-02-15",
      "issue": "Charges made after card reported stolen",
      "bank_response": "Delayed reimbursement"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "UNLIKELY_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:truth_in_lending_act__tila_:111_85f8:i_3796:ii_e672"
    ],
    "summary": "The facts presented do not align with the specific provisions of the cited law regarding electronic fund transfers.",
    "duration_ms": 2823
  },
  {
    "case_id": "batch_4_case_16",
    "intent": "Home Improvement – Contractor Quality",
    "scenario": {
      "date_noticed": "2023-04-04",
      "issue": "Poor quality of work, refused to fix",
      "contractor_response": "Denied responsibility"
    },
    "expected_bias": "Gray Area",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.9,
    "citations": [],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 2838
  },
  {
    "case_id": "batch_4_case_17",
    "intent": "Online Shopping – Negative Option Marketing",
    "scenario": {
      "date_noticed": "2017-11-19",
      "issue": "Trapped in subscription after free trial",
      "company_response": "Refused to cancel"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:fed:16_cfr_part_310__up_to_date_as_of_10_28_2025_:310_3:v:vii"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations.",
    "duration_ms": 2472
  },
  {
    "case_id": "batch_4_case_18",
    "intent": "Landlord/Tenant – Lease Violations",
    "scenario": {
      "date_noticed": "2024-08-25",
      "issue": "Landlord entered apartment without notice",
      "landlord_response": "Claimed it was an emergency"
    },
    "expected_bias": "Gray Area",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.7,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:f_1f3e"
    ],
    "summary": "The landlord's entry without notice could potentially violate M.G.L. c. 186, § 14, which is incorporated by reference in SECTION [urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_17:f_1f3e]. The landlord claims an emergency, which may justify the entry under certain circumstances.",
    "duration_ms": 3664
  },
  {
    "case_id": "batch_4_case_19",
    "intent": "Auto Sales & Repairs – Misleading Advertising",
    "scenario": {
      "date_noticed": "2024-07-12",
      "issue": "Advertised features not included in vehicle",
      "dealer_response": "Claimed misunderstanding"
    },
    "expected_bias": "VIOLATION",
    "actual_verdict": "POSSIBLE_VIOLATION",
    "confidence": 0.5,
    "citations": [
      "urn:lex:fed:940_cmr_3_00___unfair___deceptive_acts:3_01:b"
    ],
    "summary": "AI analysis failed. Defaulting to manual review.",
    "duration_ms": 3933
  },
  {
    "case_id": "batch_4_case_20",
    "intent": "Debt Collection – Statute of Limitations",
    "scenario": {
      "date_noticed": "2025-03-30",
      "issue": "Collector pursuing a debt from 2010",
      "collector_response": "Threatened legal action"
    },
    "expected_bias": "WEAK",
    "actual_verdict": "INELIGIBLE",
    "confidence": 0.95,
    "citations": [
      "urn:lex:ma:940_cmr_7_00___debt_collection_regulations:7_07:18"
    ],
    "summary": "The claim is ineligible due to the expiration of the statute of limitations for pursuing a debt from 2010.",
    "duration_ms": 3334
  }
]