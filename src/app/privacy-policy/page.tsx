
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BottomNavBar } from "@/components/bottom-nav-bar";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <article className="prose lg:prose-xl max-w-4xl mx-auto bg-background p-8 rounded-lg shadow">
            <h1>Privacy Policy</h1>
            <p className="lead">Last updated: July 12, 2024</p>
            
            <h2>1. Introduction</h2>
            <p>Welcome to GreenLeaf Guide. You must be 21 and over. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
            
            <h2>2. Information We Collect</h2>
            <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.</p>
            <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use.</p>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
            
            <h2>4. Will Your Information Be Shared With Anyone?</h2>
            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
            
             <h2>5. How Long Do We Keep Your Information?</h2>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements).</p>
        </article>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
