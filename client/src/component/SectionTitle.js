import React from "react";

function SectionTitle({
    title,
}) {
  return (
    <div className="flex gap-10 items-center py-10">
      <h1 className="text-3xl text-secondary">{title}</h1>
      <div className="bg-tertiary w-60 h-[1px]"></div>
    </div>
  );
}

export default SectionTitle;
