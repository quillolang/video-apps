'use client';
import { useState } from 'react';

export default function Total({ price }) {
  const [qty, setQty] = useState(1);
  return (
    <p className="total">
      <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
      <span>{qty} ticket{qty === 1 ? '' : 's'}: ${(price * qty).toFixed(2)}</span>
      <button onClick={() => setQty(qty + 1)}>+</button>
    </p>
  );
}
