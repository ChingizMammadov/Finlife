export interface DPP {
  id: string;
  batchId: string;
  productName: string;
  category: string;
  factory: string;
  buyer: string;
  buyerCountry: string;
  quantity: number;
  materials: { name: string; percentage: number; origin: string; supplier: string }[];
  productionDate: string;
  waterUsage: number;
  carbonFootprint: number;
  energyUsage: number;
  chemicalsCompliant: boolean;
  status: 'Draft' | 'Pending Verification' | 'Verified' | 'Submitted' | 'EU Approved';
  invoiceId?: string;
  qrData: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  dppId: string;
  productName: string;
  buyer: string;
  buyerCountry: string;
  amount: number;
  advanceRate: number;
  issueDate: string;
  dueDate: string;
  factoringCompany: string;
  status: 'Pending DPP' | 'Awaiting Approval' | 'Approved' | 'Financed' | 'Repaid';
  processingTime?: string;
}

export interface Supplier {
  id: string;
  name: string;
  city: string;
  country: string;
  materials: string[];
  complianceScore: number;
  verificationStatus: 'Verified' | 'Pending' | 'Failed';
  certifications: string[];
  lastAudit: string;
  activeContracts: number;
}

export interface Buyer {
  id: string;
  name: string;
  country: string;
  flag: string;
  totalOrders: number;
  totalValue: number;
  paymentTerms: number;
  esrpCompliant: boolean;
  activeOrders: number;
}

export const dppData: DPP[] = [
  {
    id: 'DPP-2026-001',
    batchId: 'BATCH-ATK-260415',
    productName: "Men's Organic Cotton T-Shirt",
    category: 'T-Shirt',
    factory: 'Anadolu Tekstil A.Ş.',
    buyer: 'H&M',
    buyerCountry: 'Sweden',
    quantity: 5000,
    materials: [
      { name: 'Organic Cotton', percentage: 95, origin: 'Turkey', supplier: 'Çukurova Pamuk Ltd.' },
      { name: 'Elastane', percentage: 5, origin: 'Germany', supplier: 'BASF Fibers GmbH' },
    ],
    productionDate: '2026-04-15',
    waterUsage: 45.2,
    carbonFootprint: 2.8,
    energyUsage: 3.1,
    chemicalsCompliant: true,
    status: 'EU Approved',
    invoiceId: 'INV-2026-001',
    qrData: 'https://finlife.io/dpp/DPP-2026-001',
    createdAt: '2026-04-15T09:30:00Z',
  },
  {
    id: 'DPP-2026-002',
    batchId: 'BATCH-ATK-260418',
    productName: "Women's Linen Dress",
    category: 'Dress',
    factory: 'Anadolu Tekstil A.Ş.',
    buyer: 'Zara',
    buyerCountry: 'Spain',
    quantity: 3000,
    materials: [
      { name: 'Linen', percentage: 80, origin: 'Turkey', supplier: 'İzmir Elyaf Sanayi' },
      { name: 'Cotton', percentage: 20, origin: 'Egypt', supplier: 'Cairo Cotton Co.' },
    ],
    productionDate: '2026-04-18',
    waterUsage: 32.5,
    carbonFootprint: 1.9,
    energyUsage: 2.4,
    chemicalsCompliant: true,
    status: 'Verified',
    invoiceId: 'INV-2026-002',
    qrData: 'https://finlife.io/dpp/DPP-2026-002',
    createdAt: '2026-04-18T11:00:00Z',
  },
  {
    id: 'DPP-2026-003',
    batchId: 'BATCH-ATK-260420',
    productName: 'Slim Fit Denim Jeans',
    category: 'Jeans',
    factory: 'Anadolu Tekstil A.Ş.',
    buyer: 'Mango',
    buyerCountry: 'Spain',
    quantity: 2000,
    materials: [
      { name: 'Cotton', percentage: 98, origin: 'Turkey', supplier: 'Çukurova Pamuk Ltd.' },
      { name: 'Elastane', percentage: 2, origin: 'Turkey', supplier: 'Bursa Kimya Sanayi' },
    ],
    productionDate: '2026-04-20',
    waterUsage: 78.4,
    carbonFootprint: 4.2,
    energyUsage: 5.8,
    chemicalsCompliant: true,
    status: 'Submitted',
    invoiceId: 'INV-2026-003',
    qrData: 'https://finlife.io/dpp/DPP-2026-003',
    createdAt: '2026-04-20T08:00:00Z',
  },
  {
    id: 'DPP-2026-004',
    batchId: 'BATCH-ATK-260421',
    productName: 'Cotton Zip Hoodie',
    category: 'Hoodie',
    factory: 'Anadolu Tekstil A.Ş.',
    buyer: 'C&A',
    buyerCountry: 'Netherlands',
    quantity: 4000,
    materials: [
      { name: 'Cotton', percentage: 80, origin: 'Turkey', supplier: 'Çukurova Pamuk Ltd.' },
      { name: 'Polyester', percentage: 20, origin: 'China', supplier: 'Zhejiang Textile' },
    ],
    productionDate: '2026-04-21',
    waterUsage: 52.1,
    carbonFootprint: 3.6,
    energyUsage: 4.0,
    chemicalsCompliant: false,
    status: 'Pending Verification',
    qrData: 'https://finlife.io/dpp/DPP-2026-004',
    createdAt: '2026-04-21T14:00:00Z',
  },
  {
    id: 'DPP-2026-005',
    batchId: 'BATCH-ATK-260422',
    productName: "Women's Silk Blouse",
    category: 'Blouse',
    factory: 'Anadolu Tekstil A.Ş.',
    buyer: 'Next Plc',
    buyerCountry: 'United Kingdom',
    quantity: 1500,
    materials: [
      { name: 'Silk', percentage: 100, origin: 'Turkey', supplier: 'Bursa İpek Fabrikası' },
    ],
    productionDate: '2026-04-22',
    waterUsage: 28.0,
    carbonFootprint: 1.4,
    energyUsage: 1.9,
    chemicalsCompliant: true,
    status: 'EU Approved',
    invoiceId: 'INV-2026-005',
    qrData: 'https://finlife.io/dpp/DPP-2026-005',
    createdAt: '2026-04-22T10:00:00Z',
  },
  {
    id: 'DPP-2026-006',
    batchId: 'BATCH-ATK-260423',
    productName: 'Merino Wool Sweater',
    category: 'Sweater',
    factory: 'Anadolu Tekstil A.Ş.',
    buyer: 'Reserved',
    buyerCountry: 'Poland',
    quantity: 800,
    materials: [
      { name: 'Merino Wool', percentage: 90, origin: 'Australia', supplier: 'Melbourne Wool Co.' },
      { name: 'Nylon', percentage: 10, origin: 'Turkey', supplier: 'İzmir Elyaf Sanayi' },
    ],
    productionDate: '2026-04-23',
    waterUsage: 38.7,
    carbonFootprint: 5.1,
    energyUsage: 3.5,
    chemicalsCompliant: true,
    status: 'Verified',
    qrData: 'https://finlife.io/dpp/DPP-2026-006',
    createdAt: '2026-04-23T09:00:00Z',
  },
  {
    id: 'DPP-2026-007',
    batchId: 'BATCH-ATK-260424',
    productName: 'Performance Sports T-Shirt',
    category: 'Sportswear',
    factory: 'Anadolu Tekstil A.Ş.',
    buyer: 'H&M',
    buyerCountry: 'Sweden',
    quantity: 6000,
    materials: [
      { name: 'Recycled Polyester', percentage: 70, origin: 'Turkey', supplier: 'Yeşil Elyaf A.Ş.' },
      { name: 'Elastane', percentage: 30, origin: 'Germany', supplier: 'BASF Fibers GmbH' },
    ],
    productionDate: '2026-04-24',
    waterUsage: 20.3,
    carbonFootprint: 1.2,
    energyUsage: 2.1,
    chemicalsCompliant: true,
    status: 'Draft',
    qrData: 'https://finlife.io/dpp/DPP-2026-007',
    createdAt: '2026-04-24T16:00:00Z',
  },
];

export const invoiceData: Invoice[] = [
  {
    id: 'INV-2026-001',
    dppId: 'DPP-2026-001',
    productName: "Men's Organic Cotton T-Shirt",
    buyer: 'H&M',
    buyerCountry: 'Sweden',
    amount: 245000,
    advanceRate: 0.82,
    issueDate: '2026-04-16',
    dueDate: '2026-07-16',
    factoringCompany: 'Garanti Faktoring',
    status: 'Financed',
    processingTime: '3.2 hrs',
  },
  {
    id: 'INV-2026-002',
    dppId: 'DPP-2026-002',
    productName: "Women's Linen Dress",
    buyer: 'Zara',
    buyerCountry: 'Spain',
    amount: 189500,
    advanceRate: 0.82,
    issueDate: '2026-04-19',
    dueDate: '2026-07-19',
    factoringCompany: 'İş Faktoring',
    status: 'Approved',
    processingTime: '1.8 hrs',
  },
  {
    id: 'INV-2026-003',
    dppId: 'DPP-2026-003',
    productName: 'Slim Fit Denim Jeans',
    buyer: 'Mango',
    buyerCountry: 'Spain',
    amount: 320000,
    advanceRate: 0.82,
    issueDate: '2026-04-21',
    dueDate: '2026-07-21',
    factoringCompany: 'YKB Faktoring',
    status: 'Awaiting Approval',
  },
  {
    id: 'INV-2026-004',
    dppId: 'DPP-2026-004',
    productName: 'Cotton Zip Hoodie',
    buyer: 'C&A',
    buyerCountry: 'Netherlands',
    amount: 156000,
    advanceRate: 0.82,
    issueDate: '2026-04-22',
    dueDate: '2026-07-22',
    factoringCompany: 'Garanti Faktoring',
    status: 'Pending DPP',
  },
  {
    id: 'INV-2026-005',
    dppId: 'DPP-2026-005',
    productName: "Women's Silk Blouse",
    buyer: 'Next Plc',
    buyerCountry: 'United Kingdom',
    amount: 98000,
    advanceRate: 0.82,
    issueDate: '2026-04-23',
    dueDate: '2026-07-23',
    factoringCompany: 'İş Faktoring',
    status: 'Financed',
    processingTime: '4.5 hrs',
  },
  {
    id: 'INV-2025-089',
    dppId: 'DPP-2025-089',
    productName: 'Cotton Polo Shirt',
    buyer: 'H&M',
    buyerCountry: 'Sweden',
    amount: 178000,
    advanceRate: 0.82,
    issueDate: '2026-01-10',
    dueDate: '2026-04-10',
    factoringCompany: 'Garanti Faktoring',
    status: 'Repaid',
    processingTime: '2.1 hrs',
  },
];

export const supplierData: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Çukurova Pamuk Ltd.',
    city: 'Adana',
    country: 'Turkey',
    materials: ['Organic Cotton', 'Raw Cotton'],
    complianceScore: 96,
    verificationStatus: 'Verified',
    certifications: ['GOTS', 'OCS', 'BCI'],
    lastAudit: '2026-03-10',
    activeContracts: 4,
  },
  {
    id: 'SUP-002',
    name: 'Bursa İpek Fabrikası',
    city: 'Bursa',
    country: 'Turkey',
    materials: ['Silk', 'Satin'],
    complianceScore: 91,
    verificationStatus: 'Verified',
    certifications: ['OEKO-TEX 100', 'ISO 9001'],
    lastAudit: '2026-02-22',
    activeContracts: 2,
  },
  {
    id: 'SUP-003',
    name: 'İzmir Elyaf Sanayi',
    city: 'İzmir',
    country: 'Turkey',
    materials: ['Linen', 'Nylon', 'Viscose'],
    complianceScore: 88,
    verificationStatus: 'Verified',
    certifications: ['OEKO-TEX 100'],
    lastAudit: '2026-01-15',
    activeContracts: 3,
  },
  {
    id: 'SUP-004',
    name: 'Yeşil Elyaf A.Ş.',
    city: 'Kahramanmaraş',
    country: 'Turkey',
    materials: ['Recycled Polyester', 'rPET'],
    complianceScore: 94,
    verificationStatus: 'Verified',
    certifications: ['GRS', 'OEKO-TEX 100', 'ISO 14001'],
    lastAudit: '2026-03-28',
    activeContracts: 2,
  },
  {
    id: 'SUP-005',
    name: 'Denizli Boyacılık A.Ş.',
    city: 'Denizli',
    country: 'Turkey',
    materials: ['Dyed Cotton', 'Printed Fabric'],
    complianceScore: 72,
    verificationStatus: 'Pending',
    certifications: ['OEKO-TEX 100'],
    lastAudit: '2025-11-01',
    activeContracts: 1,
  },
  {
    id: 'SUP-006',
    name: 'Bursa Kimya Sanayi',
    city: 'Bursa',
    country: 'Turkey',
    materials: ['Elastane', 'Lycra'],
    complianceScore: 58,
    verificationStatus: 'Failed',
    certifications: [],
    lastAudit: '2025-09-14',
    activeContracts: 0,
  },
];

export const buyerData: Buyer[] = [
  {
    id: 'BUY-001',
    name: 'H&M',
    country: 'Sweden',
    flag: '🇸🇪',
    totalOrders: 18,
    totalValue: 2340000,
    paymentTerms: 90,
    esrpCompliant: true,
    activeOrders: 5,
  },
  {
    id: 'BUY-002',
    name: 'Zara (Inditex)',
    country: 'Spain',
    flag: '🇪🇸',
    totalOrders: 14,
    totalValue: 1890000,
    paymentTerms: 60,
    esrpCompliant: true,
    activeOrders: 3,
  },
  {
    id: 'BUY-003',
    name: 'Mango',
    country: 'Spain',
    flag: '🇪🇸',
    totalOrders: 9,
    totalValue: 980000,
    paymentTerms: 60,
    esrpCompliant: true,
    activeOrders: 2,
  },
  {
    id: 'BUY-004',
    name: 'C&A',
    country: 'Netherlands',
    flag: '🇳🇱',
    totalOrders: 11,
    totalValue: 1120000,
    paymentTerms: 90,
    esrpCompliant: false,
    activeOrders: 2,
  },
  {
    id: 'BUY-005',
    name: 'Next Plc',
    country: 'United Kingdom',
    flag: '🇬🇧',
    totalOrders: 7,
    totalValue: 650000,
    paymentTerms: 60,
    esrpCompliant: true,
    activeOrders: 1,
  },
  {
    id: 'BUY-006',
    name: 'Reserved',
    country: 'Poland',
    flag: '🇵🇱',
    totalOrders: 5,
    totalValue: 420000,
    paymentTerms: 90,
    esrpCompliant: false,
    activeOrders: 1,
  },
];

export const cashFlowChartData = [
  { month: 'Oct', traditional: -42000, finlife: 168000 },
  { month: 'Nov', traditional: 18000, finlife: 195000 },
  { month: 'Dec', traditional: 55000, finlife: 220000 },
  { month: 'Jan', traditional: -28000, finlife: 241000 },
  { month: 'Feb', traditional: 34000, finlife: 268000 },
  { month: 'Mar', traditional: 72000, finlife: 305000 },
  { month: 'Apr', traditional: 88000, finlife: 342000 },
];

export const dppStatusChartData = [
  { name: 'EU Approved', value: 65, color: '#10b981' },
  { name: 'Verified', value: 38, color: '#3b82f6' },
  { name: 'Submitted', value: 22, color: '#8b5cf6' },
  { name: 'Pending', value: 12, color: '#f59e0b' },
  { name: 'Draft', value: 5, color: '#94a3b8' },
];
