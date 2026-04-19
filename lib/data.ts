export type PartCategory = 'CPU' | 'GPU' | 'Motherboard' | 'RAM' | 'SSD' | 'PSU' | 'Case' | 'Cooler';

export interface Part {
  id: string;
  category: PartCategory;
  name: string;
  price: number;
  tdp: number; // Wattage
  specs: Record<string, string>;
  compatibilityTags: string[];
  imagePlaceholder: string;
  hasIntegratedGraphics?: boolean;
}

export const mockParts: Part[] = [
  // CPUs
  {
    id: 'cpu-1',
    category: 'CPU',
    name: 'Intel Core i9-14900K',
    price: 18500,
    tdp: 253,
    specs: { Cores: '24 (8P+16E)', Threads: '32', Socket: 'LGA 1700' },
    compatibilityTags: ['lga1700', 'ddr5', 'ddr4'],
    imagePlaceholder: 'cpu',
    hasIntegratedGraphics: true
  },
  {
    id: 'cpu-2',
    category: 'CPU',
    name: 'AMD Ryzen 7 7800X3D',
    price: 13500,
    tdp: 120,
    specs: { Cores: '8', Threads: '16', Socket: 'AM5' },
    compatibilityTags: ['am5', 'ddr5'],
    imagePlaceholder: 'cpu',
    hasIntegratedGraphics: true
  },
  {
    id: 'cpu-3',
    category: 'CPU',
    name: 'AMD Ryzen 5 7500F',
    price: 5200,
    tdp: 65,
    specs: { Cores: '6', Threads: '12', Socket: 'AM5' },
    compatibilityTags: ['am5', 'ddr5'],
    imagePlaceholder: 'cpu',
    hasIntegratedGraphics: false
  },
  {
    id: 'cpu-4',
    category: 'CPU',
    name: 'Intel Core i5-12400F',
    price: 4200,
    tdp: 65,
    specs: { Cores: '6', Threads: '12', Socket: 'LGA 1700' },
    compatibilityTags: ['lga1700', 'ddr4'],
    imagePlaceholder: 'cpu',
    hasIntegratedGraphics: false
  },
  {
    id: 'cpu-5',
    category: 'CPU',
    name: 'Intel Core i5-12400',
    price: 4800,
    tdp: 65,
    specs: { Cores: '6', Threads: '12', Socket: 'LGA 1700' },
    compatibilityTags: ['lga1700', 'ddr4'],
    imagePlaceholder: 'cpu',
    hasIntegratedGraphics: true
  },
  // GPUs
  {
    id: 'gpu-1',
    category: 'GPU',
    name: 'NVIDIA GeForce RTX 4090 24GB',
    price: 59990,
    tdp: 450,
    specs: { VRAM: '24GB GDDR6X', Length: '336mm', Slots: '3.5' },
    compatibilityTags: ['pcie4', 'atx3.0', 'large-gpu'],
    imagePlaceholder: 'gpu'
  },
  {
    id: 'gpu-2',
    category: 'GPU',
    name: 'AMD Radeon RX 7900 XTX 24GB',
    price: 33000,
    tdp: 355,
    specs: { VRAM: '24GB GDDR6', Length: '287mm', Slots: '2.5' },
    compatibilityTags: ['pcie4'],
    imagePlaceholder: 'gpu'
  },
  {
    id: 'gpu-3',
    category: 'GPU',
    name: 'NVIDIA GeForce RTX 4060 Ti 8GB',
    price: 13500,
    tdp: 160,
    specs: { VRAM: '8GB GDDR6', Length: '242mm', Slots: '2' },
    compatibilityTags: ['pcie4'],
    imagePlaceholder: 'gpu'
  },
  {
    id: 'gpu-4',
    category: 'GPU',
    name: 'AMD Radeon RX 7600 8GB',
    price: 8990,
    tdp: 165,
    specs: { VRAM: '8GB GDDR6', Length: '240mm', Slots: '2' },
    compatibilityTags: ['pcie4'],
    imagePlaceholder: 'gpu'
  },
  // Motherboards
  {
    id: 'mb-1',
    category: 'Motherboard',
    name: 'ASUS ROG MAXIMUS Z790 HERO',
    price: 19990,
    tdp: 40,
    specs: { FormFactor: 'ATX', Socket: 'LGA 1700', Memory: 'DDR5' },
    compatibilityTags: ['lga1700', 'ddr5', 'atx'],
    imagePlaceholder: 'motherboard'
  },
  {
    id: 'mb-2',
    category: 'Motherboard',
    name: 'GIGABYTE X670E AORUS MASTER',
    price: 15990,
    tdp: 40,
    specs: { FormFactor: 'E-ATX', Socket: 'AM5', Memory: 'DDR5' },
    compatibilityTags: ['am5', 'ddr5', 'e-atx'],
    imagePlaceholder: 'motherboard'
  },
  {
    id: 'mb-3',
    category: 'Motherboard',
    name: 'ASUS TUF GAMING B650M-PLUS',
    price: 4990,
    tdp: 30,
    specs: { FormFactor: 'Micro-ATX', Socket: 'AM5', Memory: 'DDR5' },
    compatibilityTags: ['am5', 'ddr5', 'm-atx'],
    imagePlaceholder: 'motherboard'
  },
  {
    id: 'mb-4',
    category: 'Motherboard',
    name: 'MSI PRO H610M-G',
    price: 2490,
    tdp: 20,
    specs: { FormFactor: 'Micro-ATX', Socket: 'LGA 1700', Memory: 'DDR4' },
    compatibilityTags: ['lga1700', 'ddr4', 'm-atx'],
    imagePlaceholder: 'motherboard'
  },
  // RAM
  {
    id: 'ram-1',
    category: 'RAM',
    name: 'G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5-6400',
    price: 6800,
    tdp: 10,
    specs: { Capacity: '64GB', Type: 'DDR5', Speed: '6400MHz' },
    compatibilityTags: ['ddr5'],
    imagePlaceholder: 'ram'
  },
  {
    id: 'ram-2',
    category: 'RAM',
    name: 'Kingston FURY Beast 32GB (2x16GB) DDR5-6000',
    price: 3400,
    tdp: 8,
    specs: { Capacity: '32GB', Type: 'DDR5', Speed: '6000MHz' },
    compatibilityTags: ['ddr5'],
    imagePlaceholder: 'ram'
  },
  {
    id: 'ram-3',
    category: 'RAM',
    name: 'ADATA XPG D35 16GB (2x8GB) DDR4-3200',
    price: 1100,
    tdp: 5,
    specs: { Capacity: '16GB', Type: 'DDR4', Speed: '3200MHz' },
    compatibilityTags: ['ddr4'],
    imagePlaceholder: 'ram'
  },
  // SSD
  {
    id: 'ssd-1',
    category: 'SSD',
    name: 'WD Black SN850X 2TB',
    price: 4500,
    tdp: 8,
    specs: { Capacity: '2TB', Interface: 'PCIe 4.0 NVMe', Read: '7300 MB/s' },
    compatibilityTags: ['nvme', 'm2'],
    imagePlaceholder: 'ssd'
  },
  {
    id: 'ssd-2',
    category: 'SSD',
    name: 'Crucial P3 Plus 1TB',
    price: 1850,
    tdp: 5,
    specs: { Capacity: '1TB', Interface: 'PCIe 4.0 NVMe', Read: '5000 MB/s' },
    compatibilityTags: ['nvme', 'm2'],
    imagePlaceholder: 'ssd'
  },
  // PSU
  {
    id: 'psu-1',
    category: 'PSU',
    name: 'SeaSonic Vertex GX-1200 1200W',
    price: 7200,
    tdp: 1200,
    specs: { Wattage: '1200W', Efficiency: '80+ Gold', Modular: 'Full' },
    compatibilityTags: ['atx', 'atx3.0'],
    imagePlaceholder: 'psu'
  },
  {
    id: 'psu-2',
    category: 'PSU',
    name: 'Corsair RM850x 850W',
    price: 4200,
    tdp: 850,
    specs: { Wattage: '850W', Efficiency: '80+ Gold', Modular: 'Full' },
    compatibilityTags: ['atx'],
    imagePlaceholder: 'psu'
  },
  {
    id: 'psu-3',
    category: 'PSU',
    name: 'FSP Hydro GSM PRO 550W',
    price: 1790,
    tdp: 550,
    specs: { Wattage: '550W', Efficiency: '80+ Gold', Modular: 'Semi' },
    compatibilityTags: ['atx'],
    imagePlaceholder: 'psu'
  },
  // Cases
  {
    id: 'case-1',
    category: 'Case',
    name: 'Lian Li O11 Dynamic EVO',
    price: 4800,
    tdp: 0,
    specs: { Type: 'Mid Tower', MBSupport: 'E-ATX, ATX, Micro-ATX' },
    compatibilityTags: ['atx', 'e-atx', 'm-atx', 'large-gpu'],
    imagePlaceholder: 'case'
  },
  {
    id: 'case-2',
    category: 'Case',
    name: 'Montech AIR 903 MAX',
    price: 1890,
    tdp: 0,
    specs: { Type: 'Mid Tower', MBSupport: 'E-ATX, ATX, Micro-ATX' },
    compatibilityTags: ['atx', 'e-atx', 'm-atx', 'large-gpu'],
    imagePlaceholder: 'case'
  },
  // Coolers
  {
    id: 'cooler-1',
    category: 'Cooler',
    name: 'NZXT Kraken Elite 360',
    price: 8900,
    tdp: 15,
    specs: { Type: 'AIO Liquid', Size: '360mm' },
    compatibilityTags: ['lga1700', 'am5', '360mm-aio'],
    imagePlaceholder: 'cooler'
  },
  {
    id: 'cooler-2',
    category: 'Cooler',
    name: 'Thermalright Peerless Assassin 120',
    price: 1400,
    tdp: 5,
    specs: { Type: 'Air Cooler', Size: '120mm Dual Tower' },
    compatibilityTags: ['lga1700', 'am5'],
    imagePlaceholder: 'cooler'
  }
];

export const CATEGORIES: PartCategory[] = ['CPU', 'Motherboard', 'GPU', 'RAM', 'SSD', 'Cooler', 'PSU', 'Case'];
