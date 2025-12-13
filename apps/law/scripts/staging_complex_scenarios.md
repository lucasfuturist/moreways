[
  {
    "id": "complex_0_01",
    "intent": "Auto Sales – Lemon Law",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 45
      },
      "key_dates": {
        "purchase_date": "2023-01-15",
        "first_issue": "2023-01-20",
        "dealer_notice": "2023-02-01"
      },
      "financials": {
        "purchase_price": 24000,
        "repair_costs_incurred": 1500,
        "finance_company": "Ally"
      },
      "timeline": [
        {
          "date": "2023-01-15",
          "event": "Purchased Ford Explorer"
        },
        {
          "date": "2023-01-20",
          "event": "Check engine light came on"
        },
        {
          "date": "2023-01-22",
          "event": "Dealer said it was just a loose cap"
        },
        {
          "date": "2023-02-15",
          "event": "Transmission issue reoccurred"
        },
        {
          "date": "2023-03-01",
          "event": "Car towed to dealer"
        },
        {
          "date": "2023-03-10",
          "event": "Attempted repair, issue persisted"
        }
      ],
      "evidence_held": [
        "Sales Contract",
        "Repair Order #123",
        "Towing Receipt"
      ],
      "client_narrative": "I bought this car thinking it was reliable. Three days later, the light comes on. The dealer brushed me off. Now it's been in the shop 4 times for the same transmission issue. They are refusing to refund me and say I drove it too hard."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_0_02",
    "intent": "Debt Collection – Harassment",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 38
      },
      "key_dates": {
        "first_contact": "2023-01-05",
        "workplace_call": "2023-02-15",
        "cease_and_desist_sent": "2023-03-01"
      },
      "financials": {
        "alleged_debt": 4500,
        "payments_made": 500
      },
      "timeline": [
        {
          "date": "2023-01-05",
          "event": "First contact by Collection Agency"
        },
        {
          "date": "2023-02-15",
          "event": "Received call at workplace"
        },
        {
          "date": "2023-02-20",
          "event": "Sent request for debt validation"
        },
        {
          "date": "2023-03-01",
          "event": "Sent cease and desist letter"
        },
        {
          "date": "2023-03-05",
          "event": "Received another call at home"
        }
      ],
      "evidence_held": [
        "Cease and Desist Letter",
        "Call Log",
        "Debt Validation Request"
      ],
      "client_narrative": "These guys keep calling me at work, which is really embarrassing. I told them to stop and even sent them a letter to prove this debt is mine, but they just don't listen. I can't keep getting these calls at work, it's affecting my job."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_0_03",
    "intent": "Credit Reporting – Identity Theft",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 29
      },
      "key_dates": {
        "discovery_date": "2023-04-10",
        "dispute_filed": "2023-04-15"
      },
      "financials": {
        "fraudulent_accounts": [
          "Credit Card - Chase",
          "Loan - Wells Fargo"
        ],
        "disputed_amount": 10000
      },
      "timeline": [
        {
          "date": "2023-04-10",
          "event": "Received unexpected credit report"
        },
        {
          "date": "2023-04-11",
          "event": "Filed police report for identity theft"
        },
        {
          "date": "2023-04-15",
          "event": "Filed disputes with credit bureaus"
        }
      ],
      "evidence_held": [
        "Credit Report",
        "Police Report",
        "Dispute Letters"
      ],
      "client_narrative": "I got this credit report out of the blue, and it showed accounts I never opened. I followed up with the banks and the credit bureaus, but it's been a nightmare. I feel like I'm drowning in paperwork trying to prove it's not me."
    },
    "expected_bias": "GRAY AREA"
  },
  {
    "id": "complex_0_04",
    "intent": "Home Improvement – Contractor Abandonment",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 52
      },
      "key_dates": {
        "contract_signed": "2022-11-01",
        "work_stopped": "2023-01-05",
        "demand_letter_sent": "2023-03-15"
      },
      "financials": {
        "contract_value": 15000,
        "amount_paid": 8000
      },
      "timeline": [
        {
          "date": "2022-11-01",
          "event": "Signed contract for kitchen remodel"
        },
        {
          "date": "2022-12-15",
          "event": "Materials delivered"
        },
        {
          "date": "2023-01-05",
          "event": "Work stopped unexpectedly"
        },
        {
          "date": "2023-02-01",
          "event": "Attempted to contact contractor"
        },
        {
          "date": "2023-03-15",
          "event": "Sent demand letter for return of funds"
        }
      ],
      "evidence_held": [
        "Contract",
        "Payment Receipts",
        "Demand Letter"
      ],
      "client_narrative": "The contractor just vanished, leaving my kitchen half-finished. I can't cook or use the space. I've tried everything to reach him, but no luck. He took $8,000 and now I'm stuck with a mess and out more money to hire someone new."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_0_05",
    "intent": "Auto Sales – Misrepresentation",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 34
      },
      "key_dates": {
        "purchase_date": "2021-02-15",
        "issue_discovered": "2023-01-10"
      },
      "financials": {
        "purchase_price": 18000,
        "expected_repair_cost": 2000
      },
      "timeline": [
        {
          "date": "2021-02-15",
          "event": "Purchased used Honda Civic"
        },
        {
          "date": "2023-01-10",
          "event": "Discovered frame damage from previous accident"
        },
        {
          "date": "2023-01-20",
          "event": "Contacted dealer about misrepresentation"
        }
      ],
      "evidence_held": [
        "Sales Agreement",
        "CarFax Report",
        "Mechanic's Report"
      ],
      "client_narrative": "I bought this car two years ago, and only now found out it had been in a major accident before I bought it. The dealer never mentioned this and now I'm facing a huge repair bill. I just want them to cover the costs because they weren't honest."
    },
    "expected_bias": "LOSER"
  },
  {
    "id": "complex_1_01",
    "intent": "Auto Sales – Lemon Law",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 45
      },
      "key_dates": {
        "purchase_date": "2023-01-15",
        "first_issue": "2023-01-20",
        "dealer_notice": "2023-02-01"
      },
      "financials": {
        "purchase_price": 24000,
        "repair_costs_incurred": 1500,
        "finance_company": "Ally"
      },
      "timeline": [
        {
          "date": "2023-01-15",
          "event": "Purchased Ford Explorer"
        },
        {
          "date": "2023-01-20",
          "event": "Check engine light came on"
        },
        {
          "date": "2023-01-22",
          "event": "Dealer said it was just a loose cap"
        },
        {
          "date": "2023-03-15",
          "event": "Transmission failure on highway"
        },
        {
          "date": "2023-04-01",
          "event": "Dealer replaced transmission, issue persisted"
        }
      ],
      "evidence_held": [
        "Sales Contract",
        "Repair Order #123",
        "Email from Dealer"
      ],
      "client_narrative": "I bought this car thinking it was reliable. Three days later, the light comes on. The dealer brushed me off. Now it's been in the shop 4 times for the same transmission issue. They are refusing to refund me and say I drove it too hard. I even have emails where they promised to fix it, but nothing has changed. I'm at my wit's end."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_2_01",
    "intent": "Debt Collection – Harassment",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 32
      },
      "key_dates": {
        "first_contact": "2023-02-10",
        "cease_contact_request": "2023-02-25"
      },
      "financials": {
        "alleged_debt_amount": 5000
      },
      "timeline": [
        {
          "date": "2023-02-10",
          "event": "First call from debt collector"
        },
        {
          "date": "2023-02-15",
          "event": "Received threatening emails"
        },
        {
          "date": "2023-02-25",
          "event": "Sent cease and desist letter"
        },
        {
          "date": "2023-03-01",
          "event": "Debt collector called at work"
        }
      ],
      "evidence_held": [
        "Cease and desist letter",
        "Voicemail recordings"
      ],
      "client_narrative": "These people just won't stop calling. I've told them multiple times I can't talk at work, but they don't care. I've sent letters, emails, everything. They even called my boss! It's embarrassing and stressful, and they just don't seem to care about the law."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_3_01",
    "intent": "Credit Reporting – Identity Theft",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 29
      },
      "key_dates": {
        "fraud_discovery": "2023-03-05",
        "report_to_credit_agency": "2023-03-07"
      },
      "financials": {
        "fraudulent_charges": 12000
      },
      "timeline": [
        {
          "date": "2023-03-01",
          "event": "Noticed unusual charge on credit card"
        },
        {
          "date": "2023-03-05",
          "event": "Confirmed fraudulent activity"
        },
        {
          "date": "2023-03-07",
          "event": "Reported to credit agency"
        },
        {
          "date": "2023-04-10",
          "event": "Credit agency verified documents"
        }
      ],
      "evidence_held": [
        "Police report",
        "Credit card statements"
      ],
      "client_narrative": "I noticed a charge for $500 at a store I've never even been to. Then more charges started appearing. I reported it to the credit agency immediately with all the documents they needed. It's been over a month, and my credit score is still messed up. I just feel helpless."
    },
    "expected_bias": "GRAY AREA"
  },
  {
    "id": "complex_4_01",
    "intent": "Home Improvement – Contractor Issues",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 54
      },
      "key_dates": {
        "contract_signed": "2022-05-10",
        "work_stopped": "2022-06-15"
      },
      "financials": {
        "contract_amount": 15000,
        "amount_paid": 10000
      },
      "timeline": [
        {
          "date": "2022-05-10",
          "event": "Signed contract for kitchen remodel"
        },
        {
          "date": "2022-06-01",
          "event": "Contractor began work"
        },
        {
          "date": "2022-06-15",
          "event": "Work abruptly stopped"
        },
        {
          "date": "2022-07-01",
          "event": "Contractor refused to continue without more money"
        }
      ],
      "evidence_held": [
        "Contract",
        "Correspondence with contractor"
      ],
      "client_narrative": "We were so excited to get our kitchen redone. The contractor seemed so reliable at first, and the terms seemed fair. But then they just stopped showing up. Now they're demanding more money than we agreed, and we have a half-finished kitchen. It's been a nightmare dealing with them."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_5_01",
    "intent": "Credit Reporting – Mixed Files",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 38
      },
      "key_dates": {
        "first_dispute": "2022-09-25",
        "resolved_date": "2023-02-10"
      },
      "financials": {
        "incorrect_debt": 8000
      },
      "timeline": [
        {
          "date": "2022-09-25",
          "event": "Noticed incorrect debt on report"
        },
        {
          "date": "2022-10-01",
          "event": "Filed dispute with credit bureau"
        },
        {
          "date": "2022-12-15",
          "event": "Received confirmation of mixed files"
        },
        {
          "date": "2023-02-10",
          "event": "Problem resolved, incorrect debt removed"
        }
      ],
      "evidence_held": [
        "Credit report",
        "Dispute letters"
      ],
      "client_narrative": "It was shocking to see someone else's debt on my credit report. I filed disputes in good faith, yet it took months to sort this out. I'm relieved it's over, but it caused so much stress and wasted time. How can credit bureaus make such glaring errors?"
    },
    "expected_bias": "CLEAR LOSER"
  },
  {
    "id": "complex_2_01",
    "intent": "Auto Sales – Lemon Law",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 45
      },
      "key_dates": {
        "purchase_date": "2023-01-15",
        "first_issue": "2023-01-20",
        "dealer_notice": "2023-02-01"
      },
      "financials": {
        "purchase_price": 24000,
        "repair_costs_incurred": 1500,
        "finance_company": "Ally"
      },
      "timeline": [
        {
          "date": "2023-01-15",
          "event": "Purchased Ford Explorer"
        },
        {
          "date": "2023-01-20",
          "event": "Check engine light came on"
        },
        {
          "date": "2023-01-22",
          "event": "Dealer said it was just a loose cap"
        },
        {
          "date": "2023-02-05",
          "event": "Transmission failure on highway"
        },
        {
          "date": "2023-02-10",
          "event": "Dealer attempted repair, issue persisted"
        },
        {
          "date": "2023-03-15",
          "event": "Vehicle towed due to transmission issue"
        }
      ],
      "evidence_held": [
        "Sales Contract",
        "Repair Order #123",
        "Tow Receipt"
      ],
      "client_narrative": "I bought this car thinking it was reliable. Three days later, the light comes on. The dealer brushed me off, saying it was just a loose cap. Then, the transmission gives out on the highway! I was terrified. They've tried fixing it, but the problem keeps coming back. Now it's been in the shop 4 times for the same transmission issue. They are refusing to refund me and say I drove it too hard. How can they sell a lemon like this?"
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_2_02",
    "intent": "Debt Collection – Harassment",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 32
      },
      "key_dates": {
        "first_contact": "2023-02-01",
        "written_dispute": "2023-02-15"
      },
      "contact_methods": [
        "Phone",
        "Email",
        "Workplace Calls"
      ],
      "timeline": [
        {
          "date": "2023-02-01",
          "event": "First collection call at work"
        },
        {
          "date": "2023-02-05",
          "event": "Received threatening voicemail"
        },
        {
          "date": "2023-02-10",
          "event": "Email with incorrect debt amount"
        },
        {
          "date": "2023-02-15",
          "event": "Sent written dispute"
        },
        {
          "date": "2023-02-20",
          "event": "Collector ignored dispute and called workplace again"
        }
      ],
      "evidence_held": [
        "Voicemail recording",
        "Email printouts",
        "Copy of dispute letter"
      ],
      "client_narrative": "These people won't stop calling me at work! I told them to stop, and I even sent a written dispute because the amount is wrong. But they keep calling, leaving threatening voicemails, and emailing me with inflated amounts. I've had it up to here. How is this even legal?"
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_2_03",
    "intent": "Credit Reporting – Mixed Files",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 28
      },
      "key_dates": {
        "discovery_date": "2023-03-01",
        "first_dispute": "2023-03-10"
      },
      "timeline": [
        {
          "date": "2023-03-01",
          "event": "Denied credit due to unknown accounts"
        },
        {
          "date": "2023-03-05",
          "event": "Obtained credit report showing incorrect information"
        },
        {
          "date": "2023-03-10",
          "event": "Filed first dispute with credit bureau"
        },
        {
          "date": "2023-03-20",
          "event": "Received response stating information is accurate"
        },
        {
          "date": "2023-04-01",
          "event": "Second dispute filed after verification error noted"
        }
      ],
      "evidence_held": [
        "Credit report copies",
        "Dispute letters",
        "Denial of credit letter"
      ],
      "client_narrative": "I was denied credit because of accounts I know nothing about. I checked my report and it's a mess! I disputed this twice, but they keep saying it's accurate. How can they mix my file with someone else's and not fix it? It's ruining my life – I can't get a car loan now."
    },
    "expected_bias": "GRAY AREA"
  },
  {
    "id": "complex_2_04",
    "intent": "Home Improvement – Contractor Issues",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 54
      },
      "key_dates": {
        "contract_signed": "2022-11-01",
        "work_started": "2022-11-10",
        "work_stopped": "2022-12-01"
      },
      "financials": {
        "contract_amount": 15000,
        "amount_paid": 8000
      },
      "timeline": [
        {
          "date": "2022-11-01",
          "event": "Contract signed for kitchen remodel"
        },
        {
          "date": "2022-11-10",
          "event": "Work began with demolition"
        },
        {
          "date": "2022-11-20",
          "event": "Contractor requested additional funds"
        },
        {
          "date": "2022-12-01",
          "event": "Contractor stopped showing up"
        },
        {
          "date": "2023-01-15",
          "event": "Hired new contractor for assessment"
        }
      ],
      "evidence_held": [
        "Signed contract",
        "Payment receipts",
        "Photos of unfinished work"
      ],
      "client_narrative": "We signed a contract for a kitchen remodel back in November. The contractor started with demolition, but then asked for more money out of nowhere. After we paid, he just disappeared. We've been living with a gutted kitchen for months. We've had to hire someone else to even assess what's left. How can they just walk off with our money?"
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_2_05",
    "intent": "Auto Sales – Misrepresentation",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 38
      },
      "key_dates": {
        "purchase_date": "2021-06-01",
        "issue_notice": "2021-06-10"
      },
      "financials": {
        "purchase_price": 18000,
        "repair_estimates": 3000
      },
      "timeline": [
        {
          "date": "2021-06-01",
          "event": "Purchased used Honda Civic"
        },
        {
          "date": "2021-06-05",
          "event": "Noticed strange noise from engine"
        },
        {
          "date": "2021-06-10",
          "event": "Notified dealer of issue"
        },
        {
          "date": "2021-07-01",
          "event": "Dealer refused responsibility"
        }
      ],
      "evidence_held": [
        "Sales contract",
        "Mechanic's report"
      ],
      "client_narrative": "I bought this Honda because they swore it was in perfect condition. Just days later, I hear this awful noise from the engine. I took it to my mechanic who found multiple issues that should have been fixed before it was even sold. The dealer is just washing their hands of it, saying it's out of their control now. It's been over a year, but this isn't right."
    },
    "expected_bias": "LOSER (Statute of Limitations)"
  },
  {
    "id": "complex_3_01",
    "intent": "Auto Sales – Lemon Law",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 45
      },
      "key_dates": {
        "purchase_date": "2023-01-15",
        "first_issue": "2023-01-20",
        "dealer_notice": "2023-02-01"
      },
      "financials": {
        "purchase_price": 24000,
        "repair_costs_incurred": 1500,
        "finance_company": "Ally"
      },
      "timeline": [
        {
          "date": "2023-01-15",
          "event": "Purchased Ford Explorer"
        },
        {
          "date": "2023-01-20",
          "event": "Check engine light came on"
        },
        {
          "date": "2023-01-22",
          "event": "Dealer said it was just a loose cap"
        },
        {
          "date": "2023-03-03",
          "event": "Transmission started slipping"
        },
        {
          "date": "2023-03-10",
          "event": "Car returned from dealer, issue not resolved"
        }
      ],
      "evidence_held": [
        "Sales Contract",
        "Repair Order #123",
        "Dealer Communication Emails"
      ],
      "client_narrative": "I bought this car thinking it was reliable. Three days later, the light comes on. The dealer brushed me off. Now it's been in the shop 4 times for the same transmission issue. They are refusing to refund me and say I drove it too hard. I used it just to commute, and it’s a nightmare—I missed work, and they don’t care."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_3_02",
    "intent": "Debt Collection – Harassment",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 38
      },
      "key_dates": {
        "first_contact": "2023-02-05",
        "workplace_call": "2023-02-10"
      },
      "financials": {
        "alleged_debt": 5000,
        "paid_amount": 2000
      },
      "timeline": [
        {
          "date": "2023-02-05",
          "event": "Received first collection call at home"
        },
        {
          "date": "2023-02-07",
          "event": "Sent debt validation request"
        },
        {
          "date": "2023-02-10",
          "event": "Collector called my workplace"
        },
        {
          "date": "2023-03-01",
          "event": "Received debt validation, but amount is incorrect"
        }
      ],
      "evidence_held": [
        "Recorded call log",
        "Debt Validation Request Letter",
        "Employer Statement"
      ],
      "client_narrative": "I've been paying my debts, but these collectors think they own my life. They called my work! How embarrassing. I sent a letter to validate the debt, and they still called me at work again, even though the amount they're asking is wrong."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_3_03",
    "intent": "Credit Reporting – Identity Theft",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 29
      },
      "key_dates": {
        "discovered_theft": "2023-01-13",
        "reported_to_agency": "2023-01-15"
      },
      "financials": {
        "fraudulent_charges": 12000,
        "actual_loss": 5000
      },
      "timeline": [
        {
          "date": "2023-01-13",
          "event": "Noticed unfamiliar account on credit report"
        },
        {
          "date": "2023-01-14",
          "event": "Filed police report for identity theft"
        },
        {
          "date": "2023-01-15",
          "event": "Reported to credit agency"
        },
        {
          "date": "2023-02-01",
          "event": "Temporary freeze placed on credit file"
        }
      ],
      "evidence_held": [
        "Credit Report",
        "Police Report #4567",
        "Correspondence with Credit Agency"
      ],
      "client_narrative": "I was checking my credit report and saw an account I never opened. It was shocking. I filed a police report and notified the credit agency immediately, but I'm still dealing with the fallout months later. My credit score is in ruins, and it wasn't even my fault."
    },
    "expected_bias": "GRAY AREA"
  },
  {
    "id": "complex_3_04",
    "intent": "Home Improvement – Bad Work",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 50
      },
      "key_dates": {
        "contract_signed": "2022-11-01",
        "work_stopped": "2022-12-01"
      },
      "financials": {
        "contract_amount": 15000,
        "amount_paid": 10000
      },
      "timeline": [
        {
          "date": "2022-11-01",
          "event": "Contract signed for kitchen remodel"
        },
        {
          "date": "2022-11-15",
          "event": "Work commenced"
        },
        {
          "date": "2022-12-01",
          "event": "Contractor walked off the job"
        },
        {
          "date": "2023-01-20",
          "event": "Hired another contractor to fix issues"
        }
      ],
      "evidence_held": [
        "Signed Contract",
        "Correspondence with Contractor",
        "Photos of Incomplete Work"
      ],
      "client_narrative": "I hired this contractor to remodel my kitchen. He started and then disappeared, leaving everything a mess. I paid him most of the money, and now I have to pay someone else to fix and finish it. He won't return my calls, and I just want my kitchen back."
    },
    "expected_bias": "VIOLATION"
  },
  {
    "id": "complex_3_05",
    "intent": "Auto Sales – Misrepresentation",
    "formData": {
      "client_info": {
        "state": "MA",
        "age": 30
      },
      "key_dates": {
        "purchase_date": "2020-06-15",
        "discovered_issue": "2023-08-20"
      },
      "financials": {
        "purchase_price": 18000,
        "current_value": 8000
      },
      "timeline": [
        {
          "date": "2020-06-15",
          "event": "Purchased a used Honda Civic"
        },
        {
          "date": "2023-08-20",
          "event": "Discovered the car had been in a major accident"
        },
        {
          "date": "2023-09-01",
          "event": "Contacted dealer about undisclosed accident"
        }
      ],
      "evidence_held": [
        "Vehicle History Report",
        "Sales Agreement"
      ],
      "client_narrative": "I bought this used car a few years back. It was sold to me as accident-free. I found out recently it was in a major accident before I bought it—something the dealer never mentioned. I feel cheated because the value has plummeted because of this."
    },
    "expected_bias": "LOSER"
  }
]