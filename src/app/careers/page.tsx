
'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const jobOpenings = [
    { title: "Lead Budtender", location: "Denver, CO", type: "Full-time" },
    { title: "Inventory Specialist", location: "Boulder, CO", type: "Full-time" },
    { title: "Marketing Coordinator", location: "Remote", type: "Part-time" },
]

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
         <div className="space-y-8 text-center">
            <section>
                <h1 className="text-4xl md:text-5xl font-bold font-cursive text-primary mb-4">Join Our Team</h1>
                <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                    We're always looking for passionate and talented people to join us on our mission.
                </p>
            </section>
            
            <div className="space-y-4 max-w-2xl mx-auto text-left">
                {jobOpenings.map((job, index) => (
                    <Card key={index} className="bg-card/60 backdrop-blur-sm">
                        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                           <div className="mb-4 sm:mb-0">
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription>{job.location} &middot; {job.type}</CardDescription>
                           </div>
                             <Button variant="outline" className="w-full sm:w-auto">Apply Now</Button>
                        </CardHeader>
                    </Card>
                ))}
            </div>

        </div>
      </main>
      <Footer />
      <BottomNavBar />
    </div>
  );
}
