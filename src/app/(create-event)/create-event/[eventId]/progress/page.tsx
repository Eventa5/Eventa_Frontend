import React from "react";

export default function ProgressPage({
  params,
}: {
  params: { eventId: string };
}) {
  const eventId = params.eventId;

  return (
    <div className="progress-page">
      <h1 className="text-2xl font-bold">活動進度總覽</h1>

      <div className="progress-overview mt-6">
        <div className="progress-item completed">
          <h3>基本資訊</h3>
          <p>已完成</p>
        </div>

        <div className="progress-item active">
          <h3>活動形式</h3>
          <p>進行中</p>
        </div>

        <div className="progress-item">
          <h3>活動類別</h3>
          <p>尚未開始</p>
        </div>

        <div className="progress-item">
          <h3>活動內容</h3>
          <p>尚未開始</p>
        </div>

        <div className="progress-item">
          <h3>票券設定</h3>
          <p>尚未開始</p>
        </div>
      </div>
    </div>
  );
}
