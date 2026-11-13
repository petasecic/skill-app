import type { Employee } from "./types";

/** 練習用の架空社員データ(10人)。実在の人物とは関係ありません。 */
export const SEED_EMPLOYEES: Employee[] = [
  {
    id: "emp-001",
    name: "佐藤 美咲",
    department: "開発部",
    title: "リーダー",
    skills: [
      { name: "Java", level: 4 },
      { name: "SQL", level: 3 },
      { name: "プロジェクト管理", level: 3 },
      { name: "クラウド", level: 2 },
    ],
    projects: [
      {
        name: "在庫管理システムの刷新",
        start: "2023-04",
        end: "2024-03",
        role: "開発リーダー",
        skills: ["Java", "SQL", "プロジェクト管理"],
      },
      {
        name: "基幹システムのクラウド移行",
        start: "2024-06",
        end: "",
        role: "サブリーダー",
        skills: ["クラウド", "Java"],
      },
    ],
  },
  {
    id: "emp-002",
    name: "鈴木 健太",
    department: "開発部",
    title: "メンバー",
    skills: [
      { name: "JavaScript", level: 3 },
      { name: "UI/UXデザイン", level: 2 },
      { name: "SQL", level: 2 },
    ],
    projects: [
      {
        name: "社内ポータルの新規開発",
        start: "2024-01",
        end: "2024-09",
        role: "画面開発担当",
        skills: ["JavaScript", "UI/UXデザイン"],
      },
    ],
  },
  {
    id: "emp-003",
    name: "高橋 由衣",
    department: "開発部",
    title: "メンバー",
    skills: [
      { name: "Python", level: 4 },
      { name: "データ分析", level: 3 },
      { name: "SQL", level: 3 },
    ],
    projects: [
      {
        name: "売上予測ダッシュボードの構築",
        start: "2023-10",
        end: "2024-05",
        role: "分析・開発担当",
        skills: ["Python", "データ分析", "SQL"],
      },
      {
        name: "キャンペーン効果測定",
        start: "2025-02",
        end: "2025-06",
        role: "データ担当",
        skills: ["データ分析", "SQL"],
      },
    ],
  },
  {
    id: "emp-004",
    name: "田中 大輔",
    department: "開発部",
    title: "主任",
    skills: [
      { name: "クラウド", level: 4 },
      { name: "Java", level: 3 },
      { name: "SQL", level: 3 },
      { name: "英語", level: 2 },
    ],
    projects: [
      {
        name: "基幹システムのクラウド移行",
        start: "2024-06",
        end: "",
        role: "設計リーダー",
        skills: ["クラウド", "SQL"],
      },
      {
        name: "在庫管理システムの刷新",
        start: "2023-04",
        end: "2024-03",
        role: "開発担当",
        skills: ["Java", "SQL"],
      },
    ],
  },
  {
    id: "emp-005",
    name: "山本 彩",
    department: "デザイン部",
    title: "リーダー",
    skills: [
      { name: "UI/UXデザイン", level: 4 },
      { name: "Figma", level: 4 },
      { name: "資料作成", level: 3 },
    ],
    projects: [
      {
        name: "ECサイトのデザイン改善",
        start: "2024-02",
        end: "2024-11",
        role: "デザインリーダー",
        skills: ["UI/UXデザイン", "Figma"],
      },
      {
        name: "社内ポータルの新規開発",
        start: "2024-01",
        end: "2024-09",
        role: "デザイン監修",
        skills: ["UI/UXデザイン"],
      },
    ],
  },
  {
    id: "emp-006",
    name: "中村 蓮",
    department: "デザイン部",
    title: "メンバー",
    skills: [
      { name: "Figma", level: 3 },
      { name: "UI/UXデザイン", level: 2 },
      { name: "JavaScript", level: 1 },
    ],
    projects: [
      {
        name: "ECサイトのデザイン改善",
        start: "2024-04",
        end: "2024-11",
        role: "画面デザイン担当",
        skills: ["Figma", "UI/UXデザイン"],
      },
    ],
  },
  {
    id: "emp-007",
    name: "加藤 拓海",
    department: "営業部",
    title: "部長",
    skills: [
      { name: "営業提案", level: 4 },
      { name: "顧客折衝", level: 4 },
      { name: "プロジェクト管理", level: 3 },
    ],
    projects: [
      {
        name: "新商品の提案活動",
        start: "2024-04",
        end: "2025-03",
        role: "統括",
        skills: ["営業提案", "顧客折衝", "プロジェクト管理"],
      },
    ],
  },
  {
    id: "emp-008",
    name: "吉田 真由",
    department: "営業部",
    title: "主任",
    skills: [
      { name: "資料作成", level: 4 },
      { name: "営業提案", level: 3 },
      { name: "顧客折衝", level: 3 },
      { name: "英語", level: 3 },
    ],
    projects: [
      {
        name: "海外取引先との契約交渉",
        start: "2024-09",
        end: "2025-01",
        role: "交渉担当",
        skills: ["英語", "顧客折衝"],
      },
      {
        name: "新商品の提案活動",
        start: "2024-04",
        end: "2025-03",
        role: "提案担当",
        skills: ["営業提案", "資料作成"],
      },
    ],
  },
  {
    id: "emp-009",
    name: "松本 陽菜",
    department: "企画部",
    title: "リーダー",
    skills: [
      { name: "マーケティング", level: 4 },
      { name: "データ分析", level: 3 },
      { name: "資料作成", level: 3 },
    ],
    projects: [
      {
        name: "キャンペーン効果測定",
        start: "2025-02",
        end: "2025-06",
        role: "企画リーダー",
        skills: ["マーケティング", "データ分析"],
      },
    ],
  },
  {
    id: "emp-010",
    name: "林 大和",
    department: "人事部",
    title: "課長",
    skills: [
      { name: "採用面接", level: 4 },
      { name: "契約・法務対応", level: 2 },
      { name: "資料作成", level: 3 },
    ],
    projects: [
      {
        name: "新卒採用の運営",
        start: "2025-01",
        end: "",
        role: "責任者",
        skills: ["採用面接", "資料作成"],
      },
      {
        name: "社内規程の改定",
        start: "2024-05",
        end: "2024-08",
        role: "人事担当",
        skills: ["契約・法務対応"],
      },
    ],
  },
];
