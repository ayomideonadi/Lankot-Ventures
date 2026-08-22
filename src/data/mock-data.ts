import { Product, RFQ, Order, SavedList, UserProfile } from '../types/b2b';

export const INITIAL_USER: UserProfile = {
  companyName: 'Apex Construction & Logistics Inc.',
  taxId: 'US-849204918-B2B',
  contactPerson: 'Sarah Jenkins (Procurement Manager)',
  email: 's.jenkins@apexconstruction.com',
  phone: '+1 (555) 234-8901',
  industry: 'Commercial Construction & Infrastructure',
  address: '450 Industrial Parkway, Suite 300, Chicago, IL 60611',
  role: 'buyer',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'LNK-CON-401',
    name: 'Portland Commercial Cement Grade 52.5N (50kg)',
    category: 'Construction Materials',
    description: 'High-strength structural Portland cement designed for mega-infrastructure, heavy foundations, pre-cast concrete elements, and high-rise structural columns.',
    price: 14.50,
    unit: 'Bag (50kg)',
    stock: 4500,
    minOrderQty: 100,
    leadTime: '1-3 Business Days',
    isFeatured: true,
    tierPrices: [
      { minQty: 100, price: 14.50 },
      { minQty: 500, price: 13.20 },
      { minQty: 1000, price: 11.80 }
    ],
    specs: {
      'Compressive Strength': '52.5 MPa at 28 days',
      'Setting Time': 'Initial 90 mins, Final 240 mins',
      'Standard Compliance': 'ASTM C150 / EN 197-1',
      'Packaging': '54 Bags per Shrink-wrapped Pallet'
    },
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-2',
    sku: 'LNK-STL-802',
    name: 'Heavy Industrial Steel H-Beam (HEB 200 Structural)',
    category: 'Construction Materials',
    description: 'Hot-rolled structural steel H-beams manufactured for extreme load capacity, industrial warehouse framing, and bridge trusses.',
    price: 320.00,
    unit: 'Beam (12 Meter)',
    stock: 280,
    minOrderQty: 10,
    leadTime: '3-5 Business Days',
    isFeatured: true,
    tierPrices: [
      { minQty: 10, price: 320.00 },
      { minQty: 50, price: 295.00 },
      { minQty: 100, price: 270.00 }
    ],
    specs: {
      'Steel Grade': 'S355JR / ASTM A572 Grade 50',
      'Dimensions': 'Height 200mm, Width 200mm, Flange 15mm',
      'Length': '12.0 Meters (Custom cutting available)',
      'Surface Treatment': 'Anti-Corrosion Primer Coated'
    },
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-3',
    sku: 'LNK-ELE-309',
    name: 'Industrial 3-Phase Molded Case Circuit Breaker 630A',
    category: 'Electrical & Automation',
    description: 'Heavy-duty 4-Pole 630Amp MCCB engineered for factory distribution boards, main power switchgear, and motor control centers.',
    price: 680.00,
    unit: 'Unit',
    stock: 120,
    minOrderQty: 2,
    leadTime: '2-4 Business Days',
    isFeatured: true,
    tierPrices: [
      { minQty: 2, price: 680.00 },
      { minQty: 10, price: 615.00 },
      { minQty: 25, price: 550.00 }
    ],
    specs: {
      'Rated Current': '630A (Adjustable 0.7-1.0x)',
      'Breaking Capacity': '50kA at 415V AC',
      'Poles': '4-Pole (3P+N)',
      'Certification': 'IEC 60947-2 / CE Certified'
    },
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-4',
    sku: 'LNK-ELE-104',
    name: 'Armored Copper Power Cable 4-Core 95mm² (500m Drum)',
    category: 'Electrical & Automation',
    description: 'XLPE insulated low voltage steel wire armored (SWA) power distribution cable suitable for direct underground burial and industrial wiring.',
    price: 4250.00,
    unit: 'Drum (500 Meters)',
    stock: 35,
    minOrderQty: 1,
    leadTime: '5-7 Business Days',
    isFeatured: false,
    specs: {
      'Conductor Material': 'Class 2 Stranded Annealed Copper',
      'Voltage Rating': '600 / 1000V (0.6/1kV)',
      'Armoring': 'Galvanized Steel Wire Armor (SWA)',
      'Sheath': 'LSZH Flame Retardant Outer Jacket'
    },
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-5',
    sku: 'LNK-SAF-901',
    name: 'ANSI Type II Vented Safety Hard Hat with Ratchet Suspension',
    category: 'Safety & PPE',
    description: 'Ergonomic high-density polyethylene (HDPE) industrial hard hat with 4-point quick-adjust ratchet system and integrated chin strap mounts.',
    price: 18.50,
    unit: 'Piece',
    stock: 1500,
    minOrderQty: 50,
    leadTime: '1-2 Business Days',
    isFeatured: true,
    tierPrices: [
      { minQty: 50, price: 18.50 },
      { minQty: 250, price: 16.00 },
      { minQty: 1000, price: 13.50 }
    ],
    specs: {
      'ANSI Standard': 'ANSI/ISEA Z89.1-2014 Type II Class C',
      'Material': 'UV-Stabilized HDPE Shell',
      'Adjustment': 'Padded 6-Point Ratchet Headband',
      'Colors Available': 'High-Vis Yellow, White, Orange, Blue'
    },
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-6',
    sku: 'LNK-SAF-112',
    name: 'Heavy Duty Chem-Resistant Nitrile Gloves (Box of 100)',
    category: 'Safety & PPE',
    description: 'Industrial-grade 8mil textured nitrile gloves providing enhanced puncture resistance and protection against oils, solvents, and chemicals.',
    price: 22.00,
    unit: 'Box (100 Gloves)',
    stock: 2200,
    minOrderQty: 20,
    leadTime: '1-2 Business Days',
    isFeatured: false,
    specs: {
      'Thickness': '8 mil (0.20 mm) Heavy Duty Palm',
      'Chemical Rating': 'EN ISO 374-1 Type A (JKT)',
      'Powder-Free': '100% Latex-Free & Powder-Free',
      'Sizes': 'Medium, Large, Extra-Large'
    },
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-7',
    sku: 'LNK-FAC-502',
    name: 'Automatic Ride-On Floor Scrubber 85L Commercial',
    category: 'Facility & Maintenance',
    description: 'Battery-powered industrial floor scrubber dryer equipped with dual counter-rotating disc brushes and parabolic squeegee for large facilities.',
    price: 3850.00,
    unit: 'Unit',
    stock: 14,
    minOrderQty: 1,
    leadTime: '3-5 Business Days',
    isFeatured: true,
    specs: {
      'Cleaning Width': '750 mm / 30 inches',
      'Solution Tank Capacity': '85 Liters',
      'Battery Runtime': 'Up to 4.5 Hours continuous',
      'Productivity': 'Up to 4,200 sq. meters/hour'
    },
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'prod-8',
    sku: 'LNK-FAC-205',
    name: 'Hospital-Grade Disinfectant Concentrate Drum (200 Liters)',
    category: 'Facility & Maintenance',
    description: 'Quaternary ammonium broad-spectrum disinfectant concentrate formulated for hospital wards, food manufacturing plants, and corporate campuses.',
    price: 640.00,
    unit: 'Drum (200 Liters)',
    stock: 85,
    minOrderQty: 2,
    leadTime: '2-3 Business Days',
    isFeatured: false,
    tierPrices: [
      { minQty: 2, price: 640.00 },
      { minQty: 10, price: 580.00 },
      { minQty: 25, price: 510.00 }
    ],
    specs: {
      'Dilution Ratio': '1:256 (Makes 51,200L ready-to-use solution)',
      'Efficacy': 'Kills 99.999% Virus, Bacteria, and Fungi',
      'EPA Registration': 'EPA Reg. No. 6836-140',
      'Container': 'UN-Approved Polyethylene 200L Drum'
    },
    image: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_RFQS: RFQ[] = [
  {
    id: 'rfq-101',
    rfqNumber: 'RFQ-2026-0891',
    clientCompany: 'Apex Construction & Logistics Inc.',
    clientContact: 'Sarah Jenkins',
    email: 's.jenkins@apexconstruction.com',
    phone: '+1 (555) 234-8901',
    status: 'quoted',
    targetDeliveryDate: '2026-09-15',
    createdAt: '2026-08-20',
    notes: 'Urgent supply requirement for Phase 2 Logistics Depot foundation layout. Please include delivery freight options to Chicago site.',
    quoteAmount: 24850.00,
    quoteNotes: 'Discounted tiered contract rate applied. Delivery included via Lankot Fleet Heavy Transports.',
    items: [
      {
        productId: 'prod-1',
        quantity: 1200,
        notes: 'Palletized for crane offloading at Chicago South site.',
        product: INITIAL_PRODUCTS[0]
      },
      {
        productId: 'prod-2',
        quantity: 25,
        notes: 'Precision cut to 11.8m custom span.',
        product: INITIAL_PRODUCTS[1]
      }
    ]
  },
  {
    id: 'rfq-102',
    rfqNumber: 'RFQ-2026-0914',
    clientCompany: 'Midwest Metro Electrical Contractors',
    clientContact: 'David Vance',
    email: 'd.vance@midwestelectrical.io',
    phone: '+1 (555) 987-1234',
    status: 'pending',
    targetDeliveryDate: '2026-09-28',
    createdAt: '2026-08-22',
    notes: 'Require UL listed certifications attached to invoice quote.',
    items: [
      {
        productId: 'prod-3',
        quantity: 15,
        notes: 'With auxiliary trip contact blocks.',
        product: INITIAL_PRODUCTS[2]
      },
      {
        productId: 'prod-4',
        quantity: 4,
        notes: 'Red outer sheath requirement.',
        product: INITIAL_PRODUCTS[3]
      }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-3001',
    orderNumber: 'ORD-LNK-88301',
    clientCompany: 'Apex Construction & Logistics Inc.',
    clientContact: 'Sarah Jenkins',
    email: 's.jenkins@apexconstruction.com',
    poNumber: 'PO-APX-9941',
    status: 'shipped',
    shippingAddress: '450 Industrial Parkway, Dock #4, Chicago, IL 60611',
    totalAmount: 18450.00,
    invoiceNumber: 'INV-2026-7721',
    trackingNumber: 'LNK-TRK-992014-CH',
    createdAt: '2026-08-18',
    updatedAt: '2026-08-21',
    items: [
      {
        productId: 'prod-1',
        productName: 'Portland Commercial Cement Grade 52.5N (50kg)',
        sku: 'LNK-CON-401',
        unitPrice: 13.20,
        quantity: 1000,
        unit: 'Bag (50kg)'
      },
      {
        productId: 'prod-5',
        productName: 'ANSI Type II Vented Safety Hard Hat',
        sku: 'LNK-SAF-901',
        unitPrice: 16.00,
        quantity: 300,
        unit: 'Piece'
      }
    ]
  },
  {
    id: 'ord-3002',
    orderNumber: 'ORD-LNK-88104',
    clientCompany: 'Apex Construction & Logistics Inc.',
    clientContact: 'Sarah Jenkins',
    email: 's.jenkins@apexconstruction.com',
    poNumber: 'PO-APX-9882',
    status: 'delivered',
    shippingAddress: '450 Industrial Parkway, Dock #1, Chicago, IL 60611',
    totalAmount: 7700.00,
    invoiceNumber: 'INV-2026-6640',
    trackingNumber: 'LNK-TRK-881902-CH',
    createdAt: '2026-08-05',
    updatedAt: '2026-08-09',
    items: [
      {
        productId: 'prod-7',
        productName: 'Automatic Ride-On Floor Scrubber 85L Commercial',
        sku: 'LNK-FAC-502',
        unitPrice: 3850.00,
        quantity: 2,
        unit: 'Unit'
      }
    ]
  }
];

export const INITIAL_SAVED_LISTS: SavedList[] = [
  {
    id: 'list-1',
    name: 'Weekly Site PPE Standard Re-supply',
    description: 'Essential protective gear and safety uniforms for daily site compliance checks.',
    updatedAt: '2026-08-15',
    items: [
      { productId: 'prod-5', quantity: 100 },
      { productId: 'prod-6', quantity: 30 }
    ]
  },
  {
    id: 'list-2',
    name: 'Foundation Concrete & Steel Batch Kit',
    description: 'Pre-approved materials for commercial pad concrete pouring.',
    updatedAt: '2026-08-10',
    items: [
      { productId: 'prod-1', quantity: 500 },
      { productId: 'prod-2', quantity: 20 }
    ]
  }
];
