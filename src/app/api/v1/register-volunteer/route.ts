import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '@/src/lib/db';
import { volunteers } from '@/src/lib/schema';

const volunteerSchema = z.object({
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name is required"),
  vitEmail: z.string().email("Invalid VIT email").endsWith("@vit.edu", "Must be a VIT email"),
  prn: z.string().min(1, "PRN is required"),
  contact: z.string().min(10, "Valid contact number required"),
  campus: z.enum(["Kondhwa", "Bibwewadi"], { required_error: "Please select a campus" }),
  branch: z.string().min(1, "Please select a branch"),
  division: z.string().min(1, "Division is required"),
  domains: z.array(z.string()).min(1, "Select at least one domain").max(2, "Maximum 2 domains allowed"),
  experience: z.string().min(10, "Please describe your experience (minimum 10 characters)"),
  newIdea: z.string().min(10, "Please share your idea (minimum 10 characters)"),
  whyCSI: z.string().min(10, "Please tell us why you want to join (minimum 10 characters)"),
  questions: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.headers.set('Vary', 'Origin');
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('body:', JSON.stringify(body, null, 2));
    
    const parsed = volunteerSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Validation failed:', parsed.error.flatten());
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: parsed.error.flatten() 
      }, { status: 400 });
    }

    const existingVitEmailVolunteer = await db
      .select()
      .from(volunteers)
      .where(eq(volunteers.vitEmail, parsed.data.vitEmail))
      .limit(1);

    if (existingVitEmailVolunteer.length > 0) {
      console.log('VIT Email already registered:', parsed.data.vitEmail);
      const res = NextResponse.json({ 
        error: 'VIT Email already registered',
        message: 'This VIT email is already registered.' 
      }, { status: 409 });
      
      res.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
      res.headers.set('Vary', 'Origin');
      return res;
    }

    // Insert new volunteer
    const newVolunteer = await db
      .insert(volunteers)
      .values({
        email: parsed.data.email,
        fullName: parsed.data.fullName,
        vitEmail: parsed.data.vitEmail,
        prn: parsed.data.prn,
        contact: parsed.data.contact,
        campus: parsed.data.campus,
        branch: parsed.data.branch,
        division: parsed.data.division,
        domains: parsed.data.domains,
        experience: parsed.data.experience,
        newIdea: parsed.data.newIdea,
        whyCSI: parsed.data.whyCSI,
        questions: parsed.data.questions || null,
        additionalInfo: parsed.data.additionalInfo || null,
      })
      .returning({ id: volunteers.id });

    console.log('Volunteer registered successfully:', newVolunteer[0].id);

    const res = NextResponse.json({ 
      id: newVolunteer[0].id, 
      message: 'Volunteer registered successfully!' 
    }, { status: 201 });
    
    res.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
    res.headers.set('Vary', 'Origin');
    return res;
    
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ 
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}