"use client"; // Needs to be client for onClick tracking

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  
  // [TRACKING] Helper for tracking specific interests
  const handleExpand = (topic: string) => {
    if (typeof window !== 'undefined' && window.moreways) {
      window.moreways.track('custom', { 
        event: 'faq_expand',
        topic: topic,
        interest_signal: 'high' 
      });
    }
  };

  return (
    <div className="py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 font-heading text-center text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mb-12 text-lg">
          Transparency is our core value. Here is exactly how Moreways works.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger onClick={() => handleExpand('cost_free')}>Is Moreways really free for consumers?</AccordionTrigger>
            <AccordionContent>
              Yes. You will never pay Moreways a dime. We charge absolutely no fees to consumers for using our intake tools, organizing documents, or connecting with attorneys.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger onClick={() => handleExpand('business_model')}>How does Moreways make money?</AccordionTrigger>
            <AccordionContent>
              We are a software platform for law firms. Attorneys pay us to use our intake infrastructure and to receive organized, verified claim files. This model allows us to provide professional-grade legal intake to you at zero cost.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger onClick={() => handleExpand('is_law_firm')}>Is Moreways a law firm?</AccordionTrigger>
            <AccordionContent>
              No. Moreways is a technology company. We do not provide legal advice or represent you in court. Our job is to gather your facts, organize your evidence, and route your file to a licensed attorney who <em>can</em> represent you.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger onClick={() => handleExpand('data_privacy')}>What happens to my data?</AccordionTrigger>
            <AccordionContent>
              Your data is encrypted and shared <strong>only</strong> with the specific law firm evaluating your claim. We do not sell your personal information to marketing lists, spammers, or data brokers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger onClick={() => handleExpand('guarantee')}>Does submitting a claim guarantee an attorney will take my case?</AccordionTrigger>
            <AccordionContent>
              No. Submitting your information allows our partner firms to review your situation. They have the sole discretion to accept or decline representation based on the facts of your case.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}