export type Ticket = {
  id: string;
  name: string;
  price: number;
  status: string;
  assignedUserId: number | null;
  assignedEmail: string | null;
  assignedName: string | null;
  refundDeadline: string;
  startTime: string;
  endTime: string;
};

export const mockTickets: Ticket[] = [
  {
    id: "12312313123878",
    name: "一般票",
    price: 1000,
    status: "",
    assignedUserId: 2,
    assignedEmail: "kai@gmail.com",
    assignedName: "Kai",
    refundDeadline: "2025-09-02 13:00",
    startTime: "2025-09-10 13:00",
    endTime: "2025-09-10 15:00",
  },
  {
    id: "12312313123879",
    name: "一般票",
    price: 1000,
    status: "",
    assignedUserId: null,
    assignedEmail: null,
    assignedName: null,
    refundDeadline: "2025-09-02 13:00",
    startTime: "2025-09-10 13:00",
    endTime: "2025-09-10 15:00",
  },
  {
    id: "12312313123880",
    name: "優惠票",
    price: 500,
    status: "已取消",
    assignedUserId: null,
    assignedEmail: null,
    assignedName: null,
    refundDeadline: "2025-09-02 13:00",
    startTime: "2025-09-10 13:00",
    endTime: "2025-09-10 15:00",
  },
  {
    id: "12312313123881",
    name: "早鳥票",
    price: 750,
    status: "已使用",
    assignedUserId: 3,
    assignedEmail: "HsinYu",
    assignedName: "hsin-yu@gmail.com",
    refundDeadline: "2025-09-02 13:00",
    startTime: "2025-09-10 13:00",
    endTime: "2025-09-10 15:00",
  },
  {
    id: "12312313123882",
    name: "早鳥票",
    price: 750,
    status: "已逾期",
    assignedUserId: 4,
    assignedEmail: "Jill",
    assignedName: "jill@gmail.com",
    refundDeadline: "2025-09-02 13:00",
    startTime: "2025-09-10 13:00",
    endTime: "2025-09-10 15:00",
  },
];

export const getTicketStatusColor = (status: string) => {
  switch (status) {
    case "未分票":
      return "border-yellow-400 text-yellow-600 bg-yellow-50";
    case "已分票":
      return "border-green-400 text-green-600 bg-green-50";
    case "已取消":
      return "border-secondary-500 text-secondary-500 bg-secondary-50";
    case "已使用":
      return "border-neutral-400 text-neutral-600 bg-neutral-100";
    case "已逾期":
      return "border-gray-400 text-gray-500 bg-gray-100";
    default:
      return "border-gray-300 text-gray-600 bg-gray-50";
  }
};
