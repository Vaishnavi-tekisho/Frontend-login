import { ResearchData } from '../types';

// NOTE: In a real application, you would initialize the Supabase client here.
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const MOCK_DATA: ResearchData = {
  id: 'res_123456789',
  professional: {
    name: "Dr. Elena Vance",
    role: "Chief Technology Officer",
    industry: "Artificial Intelligence / Biotech",
    summary: "Dr. Vance is a distinguished researcher and executive with over 15 years of experience bridging the gap between computational biology and scalable software architecture. She has led three successful startups to exit and currently oversees a team of 200+ engineers. Her recent focus has been on ethical AI implementation in healthcare diagnostics.",
    keyInsights: [
      "Led Series B funding round raising $45M.",
      "Published 12 peer-reviewed papers on Neural Networks in 2024.",
      "Featured in TechCrunch's 'Women in AI' 2024 list.",
      "Holds 5 patents in algorithmic optimization."
    ],
    metrics: [
      { label: "Citations", value: "2,450+", trend: "up" },
      { label: "Patents", value: "5", trend: "neutral" },
      { label: "Years Exp", value: "15+" }
    ],
    lastUpdated: new Date().toISOString()
  },
  company: {
    name: "Nebula Dynamics",
    industry: "Enterprise Software",
    summary: "Nebula Dynamics is a leading provider of cloud-native infrastructure solutions tailored for the biotech sector. The company has shown 200% YoY growth and recently expanded operations into the EMEA region. They are currently pioneering a new decentralized data storage protocol for genomic data.",
    keyInsights: [
      "Market cap valuation reached $1.2B in Q3.",
      "Partnership announced with Global Health Corp.",
      "Opened new R&D center in Zurich.",
      "Employee retention rate is 95%, well above industry average."
    ],
    metrics: [
      { label: "YoY Growth", value: "200%", trend: "up" },
      { label: "Employees", value: "450+", trend: "up" },
      { label: "Offices", value: "4", trend: "neutral" }
    ],
    lastUpdated: new Date().toISOString()
  }
};

export const fetchResearchResults = async (id?: string): Promise<ResearchData> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  // REAL SUPABASE IMPLEMENTATION EXAMPLE:
  /*
  const { data, error } = await supabase
    .from('research_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
  */

  // Return mock data for the UI to be functional in this demo
  return MOCK_DATA;
};