'use client';

function Page() {
  return (
    <div>
      TODO home
      <input
        type="file"
        onChange={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
}

export default Page;
