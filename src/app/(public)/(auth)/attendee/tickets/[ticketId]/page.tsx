import React from "react";

export default function TicketDetailPage() {
  // 假資料
  const ticket = {
    type: "一般票",
    sn: "12312313123878",
    valid: "2025.09.10 (三) 15:00",
    price: "1,000",
    owner: "Kai, kai@gmail.com",
    status: "已分票",
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">票券資訊</h1>
      <div className="border rounded p-4 mb-4">
        <div className="text-base font-semibold mb-1">{ticket.type}</div>
        <div className="text-sm mb-1">票券編號：{ticket.sn}</div>
        <div className="text-sm mb-1">有效期限：{ticket.valid}</div>
        <div className="text-sm mb-1">票價：{ticket.price} 元</div>
        <div className="text-sm mb-1">票券持有者：{ticket.owner}</div>
        <span className="border border-green-400 text-green-600 px-4 py-1 rounded-full text-sm mt-2 inline-block">
          {ticket.status}
        </span>
      </div>
      <div>（此頁面為假資料展示）</div>
    </div>
  );
}
