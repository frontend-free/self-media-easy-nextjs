'use client';

const handleRequestRes = async (res) => {
  if (!res.success) {
    throw new Error(res.message);
  }
};

export { handleRequestRes };
