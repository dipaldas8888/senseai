import React from "react";

type Params = Promise<{ id: string }>;

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params;
  console.log("Route param ID:", id);
  return (
    <div className="mt-16">
      <h1 className="text-3xl font-bold text-white">Cover Letter</h1>
      <p className="text-zinc-400 mt-2">
        Welcome to your AI Cover Letter generator.
      </p>
      <p className="text-zinc-400 mt-2">ID: {id}</p>
    </div>
  );
};

export default Page;
