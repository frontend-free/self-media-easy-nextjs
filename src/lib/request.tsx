'use client';

const handleRequestRes = (res) => {
  if (!res.success) {
    throw new Error(res.message);
  }

  return res;
};

export { handleRequestRes };
