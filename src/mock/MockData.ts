
export type StatementStatus = 'draft' | 'approved' | 'cancelled';
export type EntryType = 'in' | 'out';

export interface Statement {
  id: number
  number: string
  date: string
  status: StatementStatus
  is_approved: boolean
  purchase_type: {
    id: number,
    name: string
  }
  employee_name: string
  total_in: string
  total_out: string
  comment: string
  created_at: string
  updated_at: string
  items: StatementItem[]
}

export interface StatementItem {
  id: number
  counterparty: {
    id: number,
    name: string
  }
  contract: {
    id: number
    number: string
  } | null
  entry_type: EntryType
  amount: string
  comment: string
}

export const MOCK_STATEMENTS: Statement[] = [
  {
    id: 1,
    number: "00000001",
    date: "2023-10-15T00:00:00Z",
    status: "approved" as StatementStatus,
    is_approved: false,
    purchase_type: {
      id: 1,
      name: "Bojxona to'lovlari"
    },
    employee_name: "Eshmatov Toshmat",
    total_in: "12500000.00",
    total_out: "500000.00",
    comment: "Oktyabr oyi uchun bojxona xarajatlari",
    created_at: "2023-10-15T12:00:00Z",
    updated_at: "2023-10-15T12:00:00Z",
    // Detal qismi (items)
    items: [
      {
        id: 101,
        counterparty: { id: 10, name: "O'zbekiston Temir Yo'llari" },
        contract: { id: 5, number: "CON-7788" },
        entry_type: "in" as EntryType,
        amount: "12500000.00",
        comment: "Tranzit to'lovi"
      },
      {
        id: 102,
        counterparty: { id: 11, name: "Yagona Protsessing Markazi" },
        contract: null,
        entry_type: "out" as EntryType,
        amount: "500000.00",
        comment: "Xizmat haqi"
      }
    ]
  },
  {
    id: 2,
    number: "00000002",
    date: "2023-10-16T00:00:00Z",
    status: "draft" as StatementStatus,
    is_approved: true,
    purchase_type: {
      id: 2,
      name: "Yoqilg'i mahsulotlari"
    },
    employee_name: "Aliyev Vali",
    total_in: "0.00",
    total_out: "2100000.00",
    comment: "Avtopark uchun benzin",
    created_at: "2023-10-16T09:30:00Z",
    updated_at: "2023-10-16T10:00:00Z",
    items: [
      {
        id: 103,
        counterparty: { id: 12, name: "Uzbekneftegaz" },
        contract: { id: 8, number: "FUEL-2023" },
        entry_type: "out" as EntryType,
        amount: "2100000.00",
        comment: "Ai-95 markali benzin"
      }
    ]
  },
  {
    id: 3,
    number: "00000003",
    date: "2023-10-17T00:00:00Z",
    status: "cancelled" as StatementStatus,
    is_approved: false,
    purchase_type: {
      id: 3,
      name: "Ijara to'lovlari"
    },
    employee_name: "G'aniyev Olim",
    total_in: "5000000.00",
    total_out: "0.00",
    comment: "Xato kiritilgan hujjat",
    created_at: "2023-10-17T15:00:00Z",
    updated_at: "2023-10-17T15:05:00Z",
    items: []
  }
];

// Select-box'lar uchun yordamchi ma'lumotlar
export const PURCHASE_TYPES = [
  { id: 1, name: "Bojxona to'lovlari" },
  { id: 2, name: "Yoqilg'i mahsulotlari" },
  { id: 3, name: "Ijara to'lovlari" },
  { id: 4, name: "Xizmat ko'rsatish" }
];

export const MOCK_COUNTERPARTIES = [
  { id: 10, name: "O'zbekiston Temir Yo'llari" },
  { id: 11, name: "Yagona Protsessing Markazi" },
  { id: 12, name: "Uzbekneftegaz" },
  { id: 13, name: "Almalyk KMK" },
  { id: 14, name: "Navoiy kon-metallurgiya kombinati" },
];