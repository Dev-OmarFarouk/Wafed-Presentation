export type TeamMember = {
  id: string;
  name: string;
  photo: string;
  accent: "green" | "gold";
};

export const team: TeamMember[] = [
  { id: "member-4", name: "آلاء محمد", photo: "/assets/team/member-4.png", accent: "green" },
  { id: "member-1", name: "عمر فاروق", photo: "/assets/team/member-1.png", accent: "gold" },
  { id: "member-2", name: "شهد محمد", photo: "/assets/team/member-2.png", accent: "green" },
  { id: "member-3", name: "روضة حسين", photo: "/assets/team/member-3.png", accent: "gold" },
];
